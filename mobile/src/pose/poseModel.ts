import '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { Pose, Keypoint } from './types';

let detector: poseDetection.PoseDetector | null = null;

export async function initPose() {
  if (detector) return;
  await tf.ready();
  if (tf.getBackend() !== 'rn-webgl') {
    await tf.setBackend('rn-webgl').catch(async () => { await tf.setBackend('cpu'); });
  }
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING, enableSmoothing: true }
  );
}

export async function disposePose() {
  if (detector) await detector.dispose();
  detector = null;
}

export async function estimatePoseOnImage(uri: string, width: number, height: number): Promise<Pose | null> {
  if (!detector) throw new Error('Pose detector not initialized');
  const res = await fetch(uri);
  const img = decodeJpeg(new Uint8Array(await res.arrayBuffer()));
  const poses = await detector.estimatePoses(img as unknown as tf.Tensor3D, { flipHorizontal: false });
  (img as any).dispose?.();
  if (!poses?.length) return null;
  const keypoints: Keypoint[] = poses[0].keypoints.map((k: any) => ({
    name: k.name ?? k.part ?? '',
    x: k.x, y: k.y, score: k.score,
  }));
  return { keypoints, width, height };
}
