import type { IpcMainInvokeEvent } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import type { LocalMusicItem } from '../../src/constant-node';
import { service, unitGetMusic } from '../unit';

// 获取当前电脑登录用户的根目录
const userHomeDir = os.homedir();

const lyricDir = path.join(userHomeDir, 'Music/MY音乐/cache/lyrics');

fs.mkdirSync(lyricDir, { recursive: true });

/**
 * 读取歌词
 * @param event
 * @param path
 */
export async function handleReadLyricSync(event: IpcMainInvokeEvent, music: LocalMusicItem) {
  const { name } = music;
  try {
    const lyric = fs.readFileSync(path.join(lyricDir, `${name}.lrc`), 'utf8');
    return lyric;
  } catch {
    return getLyricByApi(music);
  }
}

/**
 * 获取歌词
 * @param music
 * @returns
 */
async function getLyricByApi(music: LocalMusicItem) {
  const { duration, name, info } = music;
  const { title, artist } = info;
  const _music = await unitGetMusic({ duration, name, title, artist });
  if (!_music) return undefined;
  const musicId = _music.id;
  try {
    const apiUrl = `https://music.163.com/api/song/media?id=${musicId}`;
    const res = await service.get(apiUrl, {
      headers: {
        Cookie: 'NMTID=00Od6gdHDwTtiF9ukYnglMmej1QGdIAAAGJ8weh7Q',
      },
    });
    const data = res.data || {};
    const { code, lyric } = data;
    if (code !== 200 || !lyric) {
      return undefined;
    }
    const { name } = music;
    fs.writeFileSync(path.join(lyricDir, `${name}.lrc`), lyric);
    return lyric;
  } catch {
    return undefined;
  }
}
