import type { IpcMainInvokeEvent } from 'electron';
import { unitGetMusicCoverApi } from '../unit';
import type { LocalMusicItem } from '../../src/constant-node';
import fs from 'fs';
import os from 'os';
import path from 'path';

// 获取当前电脑登录用户的根目录
const userHomeDir = os.homedir();

const coverDir = path.join(userHomeDir, 'Music/MY音乐/cache/cover');

fs.mkdirSync(coverDir, { recursive: true });

const coverFile = path.join(coverDir, 'cover.json');
try {
  fs.accessSync(coverFile, fs.constants.F_OK);
} catch (error) {
  fs.writeFileSync(coverFile, JSON.stringify([]));
}

type CoverInfoItem = {
  id: string;
  cover: string;
};

/**
 * 获取封面图片
 */
export async function handleReadCoverSync(event: IpcMainInvokeEvent, music: LocalMusicItem) {
  let coverInfoList: CoverInfoItem[] = [];
  try {
    const coverInfoStr = fs.readFileSync(coverFile, 'utf8');
    coverInfoList = JSON.parse(coverInfoStr) as CoverInfoItem[];
  } catch (error) {
    try {
      fs.unlinkSync(coverFile);
    } catch (err) {
      console.error('无法强制删除文件：', err);
    }
    fs.writeFileSync(coverFile, JSON.stringify([]));
  }
  try {
    const coverInfo = coverInfoList.find((it) => it.id === music.id);
    if (!coverInfo) {
      throw '本地没有封面信息';
    }
    return coverInfo.cover;
  } catch {
    const { duration, name, info } = music;
    const cover = await unitGetMusicCoverApi({ duration, name, ...info });
    if (!cover) {
      return undefined;
    }
    coverInfoList.push({ id: music.id, cover });
    fs.writeFileSync(coverFile, JSON.stringify(coverInfoList));
  }
}
