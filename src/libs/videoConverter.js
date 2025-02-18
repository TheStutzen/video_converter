import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs'

export class VideoConverter {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'converted')
    fs.promises.mkdir(this.outputDir, { recursive: true }).catch(console.error)
  }

  async convertToMp4(inputPath) {
    return new Promise((resolve, reject) => {
      const outputFileName = path.basename(inputPath, '.mov') + '.mp4'
      const outputPath = path.join(this.outputDir, outputFileName)

      fs.promises
        .access(inputPath, fs.constants.F_OK)
        .then(() => {
          ffmpeg(inputPath)
            .setFfmpegPath('/usr/bin/ffmpeg')
            .output(outputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .on('end', () => {
              console.log('Conversion finished!')
              resolve(outputPath)
            })
            .on('error', (err) => {
              console.error('Error during conversion:', err)
              reject(new Error('Conversion failed: ' + err.message))
            })
            .run()
        })
        .catch((err) => {
          console.error('Input file does not exist:', err)
          reject(new Error('File not found for conversion'))
        })
    })
  }
}
