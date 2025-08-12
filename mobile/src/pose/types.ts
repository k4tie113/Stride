export type Keypoint = { name: string; x: number; y: number; score?: number };
export type Pose = { keypoints: Keypoint[]; width: number; height: number };

export type FrameSample = { uri: string; width: number; height: number; tsMs: number };

export type RunMetrics = {
  kneeFlexionDeg: number;   // contact proxy
  trunkLeanDeg: number;     // + = forward vs vertical
  headOffsetPct: number;    // % of shoulder width
  footStrikeFrame?: number; // index
};

export type AnalysisResult = {
  frames: FrameSample[];
  poses: Pose[];
  metrics: RunMetrics;
  notes: string[];
};
