import * as path from 'path'
import LoadingScreenList from '../LoadingScreenList'


function usage() {
  console.log(`npm run e -- path/to/dota\\ 2\\ beta/game/dota/pak01_dir.vpk \\
  [dst]

  dst:
    Destination folder (Default: loading-screens)`)
}

async function main() {
  if(!process.argv[2]) {
    usage()
    return
  }
  const vpkPath = process.argv[2]
  const dst = process.argv[3] || 'loading-screens'
  const list = await LoadingScreenList.fromVPKFile(vpkPath)
  console.log('Extracting...')
  console.log(`Expecting ${list.length} loading screen(s)`)
  console.log('Note that some loading screen(s) are missing in the official VPK archives')
  const start = Date.now()
  const extracted = await list.extractAll(dst)
  console.log(`${extracted} loading screen${extracted > 1 ? 's' : ''} extracted to ${path.resolve(dst)}, ${(Date.now() - start) / 1000} second(s) taken`)
}

main()
