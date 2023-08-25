import type { IpcMainInvokeEvent } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';
import type { LocalMusicItem } from '../../src/constant-node';

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
  const { name } = music;
  const list = await getMusicsByApi(name);
  const musicId = unitGetMusicId(list, music);
  if (!musicId) return undefined;
  try {
    const apiUrl = `https://music.163.com/api/song/media?id=${musicId}`;
    const res = await axios.get(apiUrl, {
      headers: {
        Cookie: 'NMTID=00Od6gdHDwTtiF9ukYnglMmej1QGdIAAAGJ8weh7Q',
      },
    });
    const data = res.data || {};
    const { code, lyric } = data;
    if (code !== 200 || !lyric) {
      return undefined;
    }
    fs.writeFileSync(path.join(lyricDir, `${name}.lrc`), lyric);
    return lyric;
  } catch {
    return undefined;
  }
}

/**
 * 获取歌曲 ID
 * @param list
 * @param music
 * @returns
 */
function unitGetMusicId(list: Array<any>, music: LocalMusicItem) {
  const { info, duration } = music;

  const { title, artist } = info;
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
        return f[minIndex].id;
      } else {
        f[0].id;
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
        return f[minIndex].id;
      } else {
        f[0].id;
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
        return f[minIndex].id;
      } else {
        f[0].id;
      }
    }
  }
  return list[0].id;
}

/**
 * 根据名称查询歌曲列表
 * @param name
 * @returns
 */
async function getMusicsByApi(name: string) {
  try {
    const apiUrl = `https://music.163.com/api/search/pc?type=1&s=${name}&limit=10&offset=0`;

    const res = await axios.get(apiUrl, {
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
