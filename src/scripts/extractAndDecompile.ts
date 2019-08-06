import * as path from 'path'
import LoadingScreenList from '../LoadingScreenList'
import decompile from '../decompile'


function usage() {
  console.log(`npm run ed path/to/dota\\ 2\\ beta/game/dota/pak01_dir.vpk \\
  [dst] [decompile_dst]

  dst:
    Destination folder (Default: loading-screens)

  decompile_dst
    Destination folder for decompilation output (Default: \`dst\`/decompiled)`)
}

async function main() {
  if(!process.argv[2]) {
    usage()
    return
  }
  const vpkPath = process.argv[2]
  const dst = process.argv[3] || 'loading-screens'
  const decompileDst = process.argv[4] || path.join(dst, 'decompiled')
  const list = await LoadingScreenList.fromVPKFile(vpkPath)
  console.log('Extracting...')
  console.log(`Expecting ${list.length} loading screen(s)`)
  console.log('Note that some loading screen(s) are missing in the official VPK archives')
  const start = Date.now()
  const extracted = await list.extractAll(dst)
  const extractEnd = Date.now()
  console.log('\nDecompiling...')
  const decompileStart = Date.now()
  await decompile(dst, decompileDst, true)
  const end = Date.now()
  console.log(`\nSummary:
  Extract:
    Expected ${list.length} loading screen(s)
    ${extracted} loading screen${extracted > 1 ? 's' : ''} extracted
    Target folder: ${path.resolve(dst)}
    ${(extractEnd - start) / 1000} second(s) taken

  Decompile:
    Target folder: ${path.resolve(decompileDst)}
    ${(end - decompileStart) / 1000} second(s) taken`)
  console.log(`\nTotal: ${(end - start) / 1000} second(s)`)
}

main()
