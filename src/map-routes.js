/* Curve delle otto cartine: i sei punti coincidono con i landmark disegnati. */
globalThis.MAP_ROUTE_POINTS=Object.freeze([
 [[.13,.74],[.27,.61],[.41,.67],[.54,.47],[.69,.35],[.84,.19]],
 [[.13,.71],[.27,.57],[.42,.62],[.56,.43],[.71,.36],[.84,.18]],
 [[.12,.73],[.27,.64],[.40,.51],[.55,.58],[.70,.34],[.84,.20]],
 [[.13,.70],[.29,.61],[.41,.43],[.55,.50],[.70,.31],[.84,.18]],
 [[.12,.72],[.26,.55],[.42,.63],[.56,.45],[.71,.39],[.84,.18]],
 [[.12,.71],[.28,.63],[.41,.47],[.56,.55],[.70,.32],[.84,.18]],
 [[.13,.72],[.27,.58],[.42,.49],[.56,.35],[.71,.42],[.84,.18]],
 [[.12,.76],[.27,.62],[.41,.67],[.55,.48],[.70,.37],[.84,.19]]
]);

globalThis.sampleMapRoute=function(stage,stepsPerSegment=32){
 const points=MAP_ROUTE_POINTS[stage%MAP_ROUTE_POINTS.length],out=[];
 const at=i=>points[Math.max(0,Math.min(points.length-1,i))];
 for(let i=0;i<points.length-1;i++){
  const p0=at(i-1),p1=at(i),p2=at(i+1),p3=at(i+2);
  for(let step=0;step<stepsPerSegment;step++){
   const t=step/stepsPerSegment,t2=t*t,t3=t2*t;
   out.push([
    .5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
    .5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)
   ]);
  }
 }
 out.push(points[points.length-1]);
 return out;
};
