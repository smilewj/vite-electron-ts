import ffmpegPath from 'ffmpeg-static';
import childProcess from 'child_process';
import ID3 from 'node-id3';
import path from 'path';
import isDev from 'electron-is-dev';

/**
 * 获取音频的总时长
 * @param filePath
 * @returns
 */
export function unitGetAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve) => {
    if (!ffmpegPath) {
      resolve(0);
      return;
    }
    const localFfmpegPath = isDev ? ffmpegPath : path.join(process.resourcesPath, path.basename(ffmpegPath));
    const command = `"${localFfmpegPath}" -i "${filePath}" 2>&1 | grep Duration | awk '{print $2}'`;

    try {
      childProcess.exec(command, (error, stdout) => {
        if (error) {
          resolve(0);
          return;
        }
        const durationParts = stdout.trim().split(':');
        const hours = parseInt(durationParts[0]);
        const minutes = parseInt(durationParts[1]);
        const seconds = parseFloat(durationParts[2]);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        resolve(totalSeconds);
      });
    } catch {
      resolve(0);
    }
  });
}

/**
 * 获取歌曲封面图
 * @param tags
 * @returns
 */
export function unitGetMusicCover(filePath: string) {
  try {
    const tags = ID3.read(filePath);
    const { image } = tags;
    if (!image) return;
    if (typeof image === 'string') {
      return image;
    }
    const { mime = 'image/jpeg', imageBuffer } = image;
    if (!imageBuffer) return;
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    return `data:${mime};base64,${base64Image}`;
  } catch {
    return undefined;
  }
}
