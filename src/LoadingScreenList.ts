import { VPKFile } from 'vpk'
import decompile from './decompile'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)
const exists = promisify(fs.exists)


async function ensureFileName(folder: string, fileName: string, extension: string, currentIndex: number = 0) {
  const baseFileName = fileName
  let _path: string
  if(currentIndex) {
    fileName = `${baseFileName}_${currentIndex}`
  }
  while(await exists(_path = path.join(folder, fileName) + extension)) {
    fileName = `${baseFileName}_${++currentIndex}`
  }
  return [ _path, /* Next index */ currentIndex ] as [ string, number ]
}

export class LoadingScreenList {
  public static prefix: string = 'panorama/images/'
  public list: string[] = []
  public get length() {
    return this.list.length
  }

  private vpk: VPKFile

  constructor(vpk: VPKFile, itemsGame: Buffer | string) {
    itemsGame = itemsGame.toString()
    this.vpk = vpk
    const match = itemsGame.match(/(?<="asset"\s*")(loadingscreens\/[\s\S]+?)(?=")/g)
    if(!match) {
      throw new TypeError('Given items_game.txt does not contain loading screen assets information')
    }
    this.list = match.map(item => item.replace(/(\.vtex)?$/, '.vtex_c'))
  }

  /**
   * Load DotA2 loading screen list from VPK file
   * @param vpk `VPKFile` or path to VPK directory file
   */
  public static async fromVPKFile(vpk: VPKFile | string) {
    if(typeof vpk == 'string') vpk = await VPKFile.fromFile(vpk)
    return new LoadingScreenList(vpk, await vpk.readFile('scripts/items/items_game.txt', true))
  }

  /**
   * Extract all loading screen `.vtex_c` files
   * @param dst Destination folder
   */
  public async extractAll(dst: string) {
    let extracted: number = 0
    if(!await exists(dst)) {
      await mkdir(dst, { recursive: true })
    }
    const names: Map<string, number> = new Map
    await Promise.all(this.list.map(async item => {
      const baseFileName = item.match(/loadingscreens\/([\s\S]+?)\//)[1]
      if(names.has(baseFileName)) {
        names.set(baseFileName, names.get(baseFileName) + 1)
      } else {
        names.set(baseFileName, 0)
      }
      const [ data, [ fileName, nextIndex ] ] = await Promise.all([
        (async () => {
          try {
            return await this.vpk.readFile(LoadingScreenList.prefix + item, true)
          } catch {
            try {
              return await this.vpk.readFile(LoadingScreenList.prefix + item.replace(/\.vtex_c$/, '_tga.vtex_c'), true)
            } catch(_) {
              return null
            }
          }
        })(),
        ensureFileName(dst, baseFileName, '.vtex_c', names.get(baseFileName))
      ])
      if(data) {
        names.set(baseFileName, nextIndex)
        await writeFile(fileName, data)
        extracted++
      }
    }))
    return extracted
  }

  /**
   * Extract all loading screen `.vtex_c` files and decompile them
   * @param dst Destination folder
   */
  public async extracAndDecompileAll(dst: string) {
    const extracted = await this.extractAll(dst)
    await decompile(dst)
    return extracted
  }
}

export default LoadingScreenList
