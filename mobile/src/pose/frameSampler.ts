import * as VideoThumbnails from 'expo-video-thumbnails';
import { FrameSample } from '../pose/types';

export async function sampleVideoFrames(videoUri: string, sampleCount=16, maxMs=6000): Promise<FrameSample[]> {
  const frames: FrameSample[] = [];
  const step = Math.floor(maxMs / sampleCount);
  for (let i=0;i<sampleCount;i++){
    const time = i*step;
    const { uri, width, height } = await VideoThumbnails.getThumbnailAsync(videoUri, { time });
    frames.push({ uri, width: width ?? 0, height: height ?? 0, tsMs: time });
  }
  return frames;
}
