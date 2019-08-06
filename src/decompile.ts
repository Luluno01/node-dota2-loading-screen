import * as os from 'os'
import * as fs from 'fs'
import { promisify } from 'util'
const chmod = promisify(fs.chmod)
import { spawn } from 'child_process'


const WINDOWS_PATH = 'bin\\valve-resource-format-decompiler\\vrf_decompiler.bat'
const OTHER_PATH = 'bin/valve-resource-format-decompiler/vrf_decompiler'

/**
 * Decompile `.vtex_c` files in a folder
 * @param folder Target folder that contains `.vtex_c` files to be decompiled
 */
export async function decompile(folder: string): Promise<void> {
  let decompilerPath: string
  if(os.platform() == 'win32') {
    decompilerPath = WINDOWS_PATH
  } else {
    // Not sure whether it supports other platform
    decompilerPath = OTHER_PATH
    await chmod(OTHER_PATH, 0x775)
  }
  const decompiler = spawn(decompilerPath, [ '--recursive', '-d', '-i', folder, '-o', folder ])
  return new Promise((res, rej) => {
    decompiler.on('exit', code => {
      if(code) rej(code)
      else res()
    })
  })
}

export default decompile
