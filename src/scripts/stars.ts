type Star={
  x:number;
  y:number;
  r:number;
  base:number;
  layer:number;
  tw:number;
  phase:number;
  vx:number;
  vy:number;
  color:string;
  bright:boolean;
};

type Shooter={
  x:number;
  y:number;
  vx:number;
  vy:number;
  born:number;
  life:number;
  len:number;
  color:string;
};

const TAU=Math.PI*2;
const MAX_DPR=2;
const FRAME_MS=33;
const rand=(min:number,max:number):number=>min+Math.random()*(max-min);
const wrap=(value:number,max:number):number=>((value%max)+max)%max;

export function initStars():void {
  const canvas=document.querySelector<HTMLCanvasElement>('#stars');
  if(!canvas){
    return;
  }
  const drawing=canvas.getContext('2d');
  if(!drawing){
    return;
  }
  const canvasEl:HTMLCanvasElement=canvas;
  const ctx:CanvasRenderingContext2D=drawing;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');

  let width=0;
  let height=0;
  let dpr=1;
  let stars:Star[]=[];
  let shooters:Shooter[]=[];
  let frame=0;
  let running=false;
  let lastFrame=0;
  let nextShoot=0;

  const pointer={x:0,y:0,targetX:0,targetY:0};

  const isDark=():boolean=>document.documentElement.dataset.theme==='dark';

  const build=():void=>{
    const count=Math.max(120,Math.min(360,Math.round(width*height/4800)));
    stars=[];
    for(let index=0;index<count;index++){
      let x:number;
      let y:number;
      if(Math.random()<0.64){
        const progress=Math.random();
        const bandX=progress*width;
        const bandY=height*0.88+(height*0.08-height*0.88)*progress;
        const offset=(Math.random()-0.5)*height*0.34;
        x=bandX+offset*0.45;
        y=bandY+offset*0.9;
      }else{
        x=Math.random()*width;
        y=Math.random()*height;
      }
      const layer=Math.random()<0.45?0:Math.random()<0.68?1:2;
      const radius=layer===0?rand(0.35,0.8):layer===1?rand(0.55,1.15):rand(0.8,1.65);
      const base=layer===0?rand(0.18,0.45):layer===1?rand(0.24,0.6):rand(0.34,0.8);
      const roll=Math.random();
      stars.push({
        x:wrap(x,width),
        y:wrap(y,height),
        r:radius,
        base,
        layer,
        tw:rand(0.00035,0.0013),
        phase:rand(0,TAU),
        vx:(layer+1)*rand(0.03,0.12)+rand(-0.03,0.03),
        vy:rand(-0.02,0.02),
        color:roll<0.62?'#9DB1DC':roll<0.8?'#8FA8D8':roll<0.9?'#A58ACB':roll<0.96?'#75B3AA':'#A9B7E0',
        bright:roll>0.975
      });
    }
    shooters=[];
  };

  const drawShooters=(now:number):void=>{
    for(let index=shooters.length-1;index>=0;index--){
      const shooter=shooters[index];
      if(!shooter){
        continue;
      }
      const age=now-shooter.born;
      if(age>shooter.life){
        shooters.splice(index,1);
        continue;
      }
      const progress=age/shooter.life;
      const fade=progress<0.2?progress/0.2:1-(progress-0.2)/0.8;
      const x=shooter.x+shooter.vx*(age/1000);
      const y=shooter.y+shooter.vy*(age/1000);
      const speed=Math.hypot(shooter.vx,shooter.vy)||1;
      const tailX=x-(shooter.vx/speed)*shooter.len;
      const tailY=y-(shooter.vy/speed)*shooter.len;
      const gradient=ctx.createLinearGradient(x,y,tailX,tailY);
      gradient.addColorStop(0,shooter.color);
      gradient.addColorStop(1,'rgba(157,177,220,0)');
      ctx.globalAlpha=fade*0.55;
      ctx.strokeStyle=gradient;
      ctx.lineWidth=1.2;
      ctx.lineCap='round';
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(tailX,tailY);
      ctx.stroke();
      ctx.globalAlpha=fade*0.8;
      ctx.fillStyle=shooter.color;
      ctx.beginPath();
      ctx.arc(x,y,1.3,0,TAU);
      ctx.fill();
    }
  };

  const drawStars=(now:number,animate:boolean):void=>{
    ctx.clearRect(0,0,width,height);
    pointer.x+=(pointer.targetX-pointer.x)*0.055;
    pointer.y+=(pointer.targetY-pointer.y)*0.055;
    const offsetX=(pointer.x-width/2)/width;
    const offsetY=(pointer.y-height/2)/height;
    const seconds=now/1000;
    for(const star of stars){
      const depth=star.layer===0?3:star.layer===1?7:13;
      const x=animate?wrap(star.x+seconds*star.vx+offsetX*depth,width):star.x;
      const y=animate?wrap(star.y+seconds*star.vy+offsetY*depth,height):star.y;
      const twinkle=animate?0.74+0.26*Math.sin(now*star.tw+star.phase):0.9;
      const alpha=star.base*twinkle;
      if(star.bright){
        ctx.globalAlpha=alpha*0.32;
        ctx.strokeStyle=star.color;
        ctx.lineWidth=0.6;
        const glint=star.r*5;
        ctx.beginPath();
        ctx.moveTo(x-glint,y);
        ctx.lineTo(x+glint,y);
        ctx.moveTo(x,y-glint);
        ctx.lineTo(x,y+glint);
        ctx.stroke();
      }
      if(star.r>1.25||star.bright){
        ctx.globalAlpha=alpha*0.1;
        ctx.fillStyle=star.color;
        ctx.beginPath();
        ctx.arc(x,y,star.r*3.4,0,TAU);
        ctx.fill();
      }
      ctx.globalAlpha=alpha;
      ctx.fillStyle=star.color;
      ctx.beginPath();
      ctx.arc(x,y,star.r,0,TAU);
      ctx.fill();
    }
    if(animate){
      drawShooters(now);
    }
    ctx.globalAlpha=1;
  };

  const spawnShooter=(now:number):void=>{
    if(shooters.length>=2){
      nextShoot=now+rand(6000,12000);
      return;
    }
    const fromLeft=Math.random()<0.5;
    const x=fromLeft?rand(width*0.04,width*0.5):rand(width*0.5,width*0.96);
    const y=rand(0,height*0.42);
    const angle=fromLeft?rand(Math.PI*0.16,Math.PI*0.3):rand(Math.PI*0.7,Math.PI*0.84);
    const speed=rand(420,760);
    shooters.push({
      x,
      y,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      born:now,
      life:rand(480,900),
      len:rand(80,170),
      color:Math.random()<0.65?'#9DB1DC':'#A58ACB'
    });
    nextShoot=now+rand(8000,18000);
  };

  const drawStatic=():void=>{
    if(!stars.length){
      resize();
      return;
    }
    drawStars(performance.now(),false);
  };

  const loop=(now:number):void=>{
    if(!running){
      return;
    }
    frame=requestAnimationFrame(loop);
    if(document.hidden){
      return;
    }
    if(!lastFrame){
      lastFrame=now;
    }
    if(now-lastFrame<FRAME_MS){
      return;
    }
    lastFrame=now;
    if(now>=nextShoot){
      spawnShooter(now);
    }
    drawStars(now,true);
  };

  const start=():void=>{
    if(running||reduce.matches||!isDark()){
      return;
    }
    if(!stars.length){
      resize();
    }
    running=true;
    lastFrame=0;
    nextShoot=performance.now()+rand(5000,11000);
    frame=requestAnimationFrame(loop);
  };

  const stop=():void=>{
    running=false;
    if(frame){
      cancelAnimationFrame(frame);
    }
    frame=0;
    shooters=[];
    ctx.clearRect(0,0,width,height);
  };

  const resize=():void=>{
    width=window.innerWidth;
    height=window.innerHeight;
    dpr=Math.min(window.devicePixelRatio||1,MAX_DPR);
    canvasEl.width=Math.floor(width*dpr);
    canvasEl.height=Math.floor(height*dpr);
    canvasEl.style.width=`${width}px`;
    canvasEl.style.height=`${height}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    build();
    if(!running){
      drawStatic();
    }
  };

  const sync=():void=>{
    if(!isDark()){
      stop();
      return;
    }
    const wanted=Math.floor(window.innerWidth*Math.min(window.devicePixelRatio||1,MAX_DPR));
    if(canvasEl.width!==wanted||!stars.length){
      resize();
    }
    if(reduce.matches){
      stop();
      drawStatic();
      return;
    }
    start();
  };

  reduce.addEventListener('change',sync);
  window.addEventListener('portfolio:themechange',sync);
  window.addEventListener('resize',()=>{
    if(isDark()){
      resize();
      if(reduce.matches){
        drawStatic();
      }
    }
  },{passive:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      stop();
    }else if(isDark()&&!reduce.matches){
      start();
    }
  });
  window.addEventListener('pointermove',event=>{
    pointer.targetX=event.clientX;
    pointer.targetY=event.clientY;
  },{passive:true});
  window.addEventListener('pointerleave',()=>{
    pointer.targetX=window.innerWidth/2;
    pointer.targetY=window.innerHeight/2;
  });
  pointer.x=pointer.targetX=window.innerWidth/2;
  pointer.y=pointer.targetY=window.innerHeight/2;
  sync();
}
