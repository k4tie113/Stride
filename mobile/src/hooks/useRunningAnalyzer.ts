import { useState, useCallback } from 'react';
import { initPose, estimatePoseOnImage, disposePose } from '../pose/poseModel';
import { sampleVideoFrames } from '../pose/frameSampler';
import { analyzeRunningForm } from '../pose/runnerAnalysis';
import { AnalysisResult, Pose } from '../pose/types';

export function useRunningAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeVideo = useCallback(async (videoUri: string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      await initPose();
      const frames = await sampleVideoFrames(videoUri, 16, 6000);
      const poses: (Pose|null)[] = [];
      for (const f of frames) {
        const p = await estimatePoseOnImage(f.uri, f.width, f.height);
        poses.push(p);
      }
      const analysis = analyzeRunningForm(frames, poses);
      setResult(analysis);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(async () => {
    setResult(null);
    await disposePose();
  }, []);

  return { isAnalyzing, result, analyzeVideo, reset };
}
