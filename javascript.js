//
//     const a3d = document.querySelector(".a3d");
//
//
//     let targetY = 0;
//     let targetX = 0;
//
//     let currentY = 0;
//     let currentX = 0;
//
//
//     document.addEventListener("mousemove", (e) => {
//     const x = (e.clientX / window.innerWidth) - 0.5;
//     const y = (e.clientY / window.innerHeight) - 0.5;
//
//     targetY = x * 80;
//     targetX = -y * 40;
//
//
//
// });
//
//     function animate() {
//     currentY += (targetY - currentY) * 0.08;
//     currentX += (targetX - currentX) * 0.08;
//     a3d.style.transform =
//     `rotateY(${currentY}deg) rotateX(${currentX}deg)`;
//
//     requestAnimationFrame(animate);
//
// }
//     animate();
//
//
//
//
//
//
//     const a3d = document.querySelector(".a3d");
//     let targetY=0,targetX=0,currentY=0,currentX=0;
//     document.addEventListener("mousemove",(e)=>{
//         const x=(e.clientX/window.innerWidth)-0.5;
//         const y=(e.clientY/window.innerHeight)-0.5;
//         targetY=x*80; targetX=-y*40;
//     });
//     function animate(){
//         currentY+=(targetY-currentY)*0.08;
//         currentX+=(targetX-currentX)*0.08;
//         a3d.style.transform=`rotateY(${currentY}deg) rotateX(${currentX}deg)`;
//         requestAnimationFrame(animate);
//     }
//     animate();
//
//     /* ✦ MAGIC CURSOR TRAIL ✦ */
//     (function(){
//         var c=document.createElement('canvas');
//         var s=c.style;
//         s.position='fixed';s.top='0';s.left='0';
//         s.width='100%';s.height='100%';
//         s.pointerEvents='none';s.zIndex='99999';
//         document.body.appendChild(c);
//         var ctx=c.getContext('2d');
//         c.width=window.innerWidth;
//         c.height=window.innerHeight;
//         window.addEventListener('resize',function(){
//             c.width=window.innerWidth;
//             c.height=window.innerHeight;
//         });
//         var COLORS=['#f472b6','#ec4899','#be185d','#fce7f3','#ffffff','#ff9de2'];
//         var pts=[];
//         var mx=0,my=0,px=0,py=0,pulse=0;
//         document.addEventListener('mousemove',function(e){
//             mx=e.clientX; my=e.clientY;
//             var dx=mx-px,dy=my-py;
//             var d=Math.sqrt(dx*dx+dy*dy);
//             if(d>2){
//                 var n=Math.min(Math.floor(d/3),10);
//                 for(var i=0;i<n;i++) pts.push(new P(mx,my));
//                 px=mx;py=my;
//             }
//         });
//         function P(x,y){
//             this.x=x+(Math.random()-.5)*8;
//             this.y=y+(Math.random()-.5)*8;
//             this.vx=(Math.random()-.5)*3;
//             this.vy=(Math.random()-.5)*3-1;
//             this.size=Math.random()*7+3;
//             this.color=COLORS[Math.floor(Math.random()*COLORS.length)];
//             this.alpha=1;
//             this.decay=Math.random()*.02+.015;
//             this.shrink=Math.random()*.04+.02;
//             this.gravity=.07;
//             this.rot=Math.random()*Math.PI*2;
//             this.rotV=(Math.random()-.5)*.18;
//             this.type=Math.floor(Math.random()*3);
//         }
//         P.prototype.update=function(){
//             this.x+=this.vx;this.y+=this.vy;
//             this.vy+=this.gravity;this.vx*=.97;
//             this.alpha-=this.decay;this.size-=this.shrink;
//             this.rot+=this.rotV;
//         };
//         P.prototype.draw=function(){
//             if(this.alpha<=0||this.size<=0)return;
//             ctx.save();
//             ctx.globalAlpha=Math.max(0,this.alpha);
//             ctx.shadowColor=this.color;ctx.shadowBlur=10;
//             ctx.fillStyle=this.color;ctx.strokeStyle=this.color;
//             ctx.translate(this.x,this.y);ctx.rotate(this.rot);
//             if(this.type===0){
//                 ctx.beginPath();ctx.arc(0,0,this.size*.55,0,Math.PI*2);ctx.fill();
//             }else if(this.type===1){
//                 var r=this.size*.6,ir=r*.4;
//                 ctx.beginPath();
//                 for(var i=0;i<8;i++){
//                     var a=(i*Math.PI)/4,rad=i%2===0?r:ir;
//                     if(i===0)ctx.moveTo(Math.cos(a)*rad,Math.sin(a)*rad);
//                     else ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad);
//                 }
//                 ctx.closePath();ctx.fill();
//             }else{
//                 ctx.beginPath();ctx.arc(0,0,this.size*.5,0,Math.PI*2);
//                 ctx.lineWidth=1.5;ctx.stroke();
//                 ctx.beginPath();ctx.arc(0,0,this.size*.15,0,Math.PI*2);ctx.fill();
//             }
//             ctx.restore();
//         };
//         function loop(){
//             ctx.clearRect(0,0,c.width,c.height);
//             pulse+=.1;
//             var ps=8+Math.sin(pulse)*3;
//             ctx.save();
//             ctx.shadowColor='#f472b6';ctx.shadowBlur=20;
//             ctx.globalAlpha=.45;ctx.beginPath();
//             ctx.arc(mx,my,ps,0,Math.PI*2);
//             ctx.fillStyle='rgba(244,114,182,0.3)';ctx.fill();
//             ctx.globalAlpha=.9;ctx.beginPath();
//             ctx.arc(mx,my,ps*.4,0,Math.PI*2);
//             ctx.fillStyle='#fff';ctx.fill();
//             ctx.restore();
//             for(var i=pts.length-1;i>=0;i--){
//                 pts[i].update();pts[i].draw();
//                 if(pts[i].alpha<=0||pts[i].size<=0)pts.splice(i,1);
//             }
//             requestAnimationFrame(loop);
//         }
//         loop();
//     })();