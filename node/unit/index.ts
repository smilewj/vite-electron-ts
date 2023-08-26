import ffmpegPath from 'ffmpeg-static';
import childProcess from 'child_process';
import ID3, { type Tags } from 'node-id3';
import path from 'path';
import isDev from 'electron-is-dev';
import axios from 'axios';

export const service = axios.create({ timeout: 5000 });

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
 * 获取歌曲信息
 * @param tags
 * @returns
 */
export function unitGetMusicInfo(filePath: string) {
  try {
    const tags = ID3.read(filePath);
    const { artist, title } = tags;
    return {
      artist,
      title,
    };
  } catch {
    return {
      artist: undefined,
      title: undefined,
    };
  }
}

/**
 * 获取本地歌曲中的封面图
 * @param tags
 * @returns
 */
export function unitGetMusicCoverLocal(tags: Tags) {
  try {
    const { image } = tags;
    if (!image) {
      return;
    }
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

/**
 * 从网络中获取歌曲的封面图
 * @param musicInfo
 * @returns
 */
export async function unitGetMusicCoverApi(musicInfo: {
  title?: string;
  artist?: string;
  duration?: number;
  name: string;
}) {
  const music = await unitGetMusic(musicInfo);
  if (!music) return;
  const { album = {} } = music;
  return album.picUrl as string | undefined;
}

/**
 * 获取歌曲
 * @param music
 * @returns
 */
export async function unitGetMusic(musicInfo: { title?: string; artist?: string; duration?: number; name: string }) {
  const { duration, name, title, artist } = musicInfo;

  const list = await getMusicsByApi(name);

  if (!list.length) return undefined;

  if (title && artist) {
    const f1 = list.filter((it) => it.name.includes(title));
    const f = f1.filter((it) => {
      const artists: any[] = Array.isArray(it.artists) ? it.artists : [];
      return artists.some((ele) => ele.name.includes(artist));
    });
    if (f.length) {
      if (duration) {
        const duration1 = duration * 1000;
        const dds = f.map((it) => Math.abs(duration1 - (Number(it.duration) || 0)));
        const min = Math.min(...dds);
        const minIndex = dds.findIndex((it) => it === min);
        return f[minIndex];
      } else {
        f[0];
      }
    }
  }
  if (title) {
    const f = list.filter((it) => it.name.includes(title));
    if (f.length) {
      if (duration) {
        const duration1 = duration * 1000;
        const dds = f.map((it) => Math.abs(duration1 - (Number(it.duration) || 0)));
        const min = Math.min(...dds);
        const minIndex = dds.findIndex((it) => it === min);
        return f[minIndex];
      } else {
        f[0];
      }
    }
  }
  if (artist) {
    const f = list.filter((it) => {
      const artists: any[] = Array.isArray(it.artists) ? it.artists : [];
      return artists.some((ele) => ele.name.includes(artist));
    });
    if (f.length) {
      if (duration) {
        const duration1 = duration * 1000;
        const dds = f.map((it) => Math.abs(duration1 - (Number(it.duration) || 0)));
        const min = Math.min(...dds);
        const minIndex = dds.findIndex((it) => it === min);
        return f[minIndex];
      } else {
        f[0];
      }
    }
  }
  return list[0];
}

/**
 * 根据名称查询歌曲列表
 * @param name
 * @returns
 */
async function getMusicsByApi(name: string) {
  try {
    const apiUrl = `https://music.163.com/api/search/pc?type=1&s=${name}&limit=10&offset=0`;

    const res = await service.get(apiUrl, {
      headers: {
        Cookie: 'NMTID=00Od6gdHDwTtiF9ukYnglMmej1QGdIAAAGJ8weh7Q',
      },
    });
    const data = res.data || {};

    const { code, result } = data;
    if (code !== 200 || !result) {
      return [];
    }
    const { songs } = result;
    return Array.isArray(songs) ? songs : [];
  } catch {
    return [];
  }
}
