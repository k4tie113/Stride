import { AnalysisResult, FrameSample, Pose, RunMetrics } from './types';

const deg = (r:number)=>r*180/Math.PI;

function angleABC(ax:number,ay:number,bx:number,by:number,cx:number,cy:number){
  const v1x=ax-bx, v1y=ay-by, v2x=cx-bx, v2y=cy-by;
  const dot=v1x*v2x+v1y*v2y, n1=Math.hypot(v1x,v1y), n2=Math.hypot(v2x,v2y);
  if (!n1 || !n2) return 0;
  return deg(Math.acos(Math.max(-1,Math.min(1,dot/(n1*n2)))));
}
const get=(p:Pose,n:string)=>p.keypoints.find(k=>k.name===n);

function kneeAngle(p: Pose){ // min of L/R
  const lk=get(p,'left_knee'), la=get(p,'left_ankle'), lh=get(p,'left_hip');
  const rk=get(p,'right_knee'), ra=get(p,'right_ankle'), rh=get(p,'right_hip');
  const l = (lk&&la&&lh)? angleABC(la.x,la.y,lk.x,lk.y,lh.x,lh.y) : Infinity;
  const r = (rk&&ra&&rh)? angleABC(ra.x,ra.y,rk.x,rk.y,rh.x,rh.y) : Infinity;
  return Math.min(l,r);
}
function trunkLean(p: Pose){
  const ls=get(p,'left_shoulder'), rs=get(p,'right_shoulder');
  const lh=get(p,'left_hip'), rh=get(p,'right_hip');
  if (!(ls&&rs&&lh&&rh)) return 0;
  const sx=(ls.x+rs.x)/2, sy=(ls.y+rs.y)/2;
  const hx=(lh.x+rh.x)/2, hy=(lh.y+rh.y)/2;
  const vx=hx-sx, vy=hy-sy;             // vertical is (0,-1) in screen coords
  return deg(Math.atan2(vx, vy));       // 0≈vertical; +≈lean
}
function headOffsetPct(p: Pose){
  const nose=get(p,'nose'); const ls=get(p,'left_shoulder'), rs=get(p,'right_shoulder');
  const lh=get(p,'left_hip'), rh=get(p,'right_hip');
  if (!(nose&&ls&&rs&&lh&&rh)) return 0;
  const torsoCx=(ls.x+rs.x+lh.x+rh.x)/4;
  const shoulderW=Math.max(1,Math.abs(rs.x-ls.x));
  return Math.abs(nose.x-torsoCx)/shoulderW*100;
}

export function analyzeRunningForm(frames: FrameSample[], poses: (Pose|null)[]): AnalysisResult {
  const valid = poses.map((p,i)=>p?{i,p}:null).filter(Boolean) as {i:number,p:Pose}[];
  let strike = valid.length? valid[0].i : -1, minK = Infinity;
  for(const v of valid){ const k=kneeAngle(v.p); if(k < minK){minK=k; strike=v.i;} }
  const sPose = strike>=0 ? poses[strike]! : valid[0]?.p;
  const metrics: RunMetrics = {
    kneeFlexionDeg: sPose? kneeAngle(sPose) : 0,
    trunkLeanDeg:   sPose? trunkLean(sPose)  : 0,
    headOffsetPct:  sPose? Math.round(headOffsetPct(sPose)) : 0,
    footStrikeFrame: strike>=0? strike: undefined,
  };
  const notes:string[]=[];
  if (metrics.kneeFlexionDeg > 165) notes.push('Possible overstriding (extended knee at contact).');
  if (metrics.trunkLeanDeg < 2)     notes.push('Very upright trunk; consider slight forward lean.');
  if (metrics.headOffsetPct > 35)   notes.push('Head notably off torso center; check alignment.');

  return {
    frames,
    poses: poses.map(p=>p ?? {keypoints:[],width:0,height:0}),
    metrics, notes,
  };
}
