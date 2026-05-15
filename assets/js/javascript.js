// hamburger
const hamburger = document.getElementById('hamburger');
const navList   = document.getElementById('nav-list');

if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navList.classList.toggle('open');
    });

    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navList.classList.remove('open');
        });
    });
}

// 3d tilt
const a3d = document.querySelector(".a3d");
 let targetY = 0, targetX = 0, currentY = 0, currentX = 0; //rotation values store krl methn hri

document.addEventListener("mousemove", (e) => {//mouvse move  wenakot funtionrun eka ( double check )
    const x = (e.clientX / window.innerWidth)  - 0.5; // X position gnnw right
    const y = (e.clientY / window.innerHeight) - 0.5;// y  position
    targetY = x * 80;// position convert krnw rotation value widiyt ethanath hri
    targetX = -y * 40;
});
 //function create krnw
function animate() {
    currentY += (targetY - currentY) * 0.08;//Smooth animation, Direct jump nh, slowly move .target value ,targetY = 40 currentY = 0 *0.8 meka sulu krm ena eka tham ansewr ek eka thama currenty
    currentX += (targetX - currentX) * 0.08;
    if (a3d) a3d.style.transform = `rotateY(${currentY}deg) rotateX(${currentX}deg)`; //Actual 3D rotation apply leftright ekai updown ekai
    requestAnimationFrame(animate); // hri rhi continuously run methna okkoma hri
}
animate();





// cursor trail
if (document.getElementById('hero')) (function () { // hero section ekenam  run wenna
    var c = document.createElement('canvas');//invisible drawing board add krnw
    var s = c.style;
    s.position = 'fixed'; s.top = '0'; s.left = '0';
    s.width = '100%'; s.height = '100%';
    s.pointerEvents = 'none'; s.zIndex = '99999';
    document.body.appendChild(c);
    var ctx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    window.addEventListener('resize', function () {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    });
    var COLORS = ['#f472b6','#ec4899','#be185d','#fce7f3','#ffffff','#ff9de2'];
    var pts = [], mx = 0, my = 0, px = 0, py = 0, pulse = 0;
    document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;// mouse ek thiyena thana track krnw
        var dx = mx - px, dy = my - py;
        var d = Math.sqrt(dx*dx + dy*dy); //mouse eke speed check
        if (d > 2) { // mouse move unoth
            var n = Math.min(Math.floor(d / 3), 10);
            for (var i = 0; i < n; i++) pts.push(new P(mx, my)); //sparkle particles
            px = mx; py = my;
        }
    });
    function P(x, y) { //practicle create (color size properties add krnw)
        this.x = x+(Math.random()-.5)*8; this.y = y+(Math.random()-.5)*8;
        this.vx = (Math.random()-.5)*3;  this.vy = (Math.random()-.5)*3-1;
        this.size = Math.random()*7+3;
        this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
        this.alpha = 1; this.decay = Math.random()*.02+.015;
        this.shrink = Math.random()*.04+.02; this.gravity = .07;
        this.rot = Math.random()*Math.PI*2;
        this.rotV = (Math.random()-.5)*.18;
        this.type = Math.floor(Math.random()*3);
    }
    P.prototype.update = function(){ //animation move wena hati
        this.x+=this.vx; this.y+=this.vy;
        this.vy+=this.gravity; this.vx*=.97;
        this.alpha-=this.decay; this.size-=this.shrink;
        this.rot+=this.rotV;
    };
    P.prototype.draw = function(){ // shapes draw krnwa (circle,tar shape)
        if(this.alpha<=0||this.size<=0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0,this.alpha);
        ctx.shadowColor = this.color; ctx.shadowBlur = 10;
        ctx.fillStyle = this.color; ctx.strokeStyle = this.color;
        ctx.translate(this.x,this.y); ctx.rotate(this.rot);
        if(this.type===0){
            ctx.beginPath(); ctx.arc(0,0,this.size*.55,0,Math.PI*2); /*circle*/ctx.fill();
        } else if(this.type===1){
            var r=this.size*.6, ir=r*.4;
            ctx.beginPath();
            for(var i=0;i<8;i++){
                var a=(i*Math.PI)/4, rad=i%2===0?r:ir;
                if(i===0) ctx.moveTo(Math.cos(a)*rad,Math.sin(a)*rad);//star shape
                else ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad);//star shape
            }
            ctx.closePath(); ctx.fill();
        } else {
            ctx.beginPath(); ctx.arc(0,0,this.size*.5,0,Math.PI*2);
            ctx.lineWidth=1.5; ctx.stroke();//rings shape
            ctx.beginPath(); ctx.arc(0,0,this.size*.15,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
    };
    function loop(){// screen ek continuously update (screen clear,mouse glow draw , particles update , particles draw, repeat)
        ctx.clearRect(0,0,c.width,c.height);
        pulse+=.1;
        var ps=8+Math.sin(pulse)*3;
        ctx.save();
        ctx.shadowColor='#f472b6'; ctx.shadowBlur=20;
        ctx.globalAlpha=.45; ctx.beginPath();
        ctx.arc(mx,my,ps,0,Math.PI*2);
        ctx.fillStyle='rgba(244,114,182,0.3)'; ctx.fill();
        ctx.globalAlpha=.9; ctx.beginPath();
        ctx.arc(mx,my,ps*.4,0,Math.PI*2);
        ctx.fillStyle='#fff'; ctx.fill();
        ctx.restore();
        for(var i=pts.length-1;i>=0;i--){
            pts[i].update(); pts[i].draw();
            if(pts[i].alpha<=0||pts[i].size<=0) pts.splice(i,1);
        }
        requestAnimationFrame(loop); //animation ek continuously run wenw
    }
    loop();
}());


// gallery filter (landscape portrait)

const btns  = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.gallery-card');

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active')); // active state manage
        btn.classList.add('active');
        const cat = btn.dataset.cat;// button eke data-cat value gnnwa (landscape portrait mkkd kiyl gnnw)
        cards.forEach(card => { //hama crd ekm check krnw
            if (cat === 'all' || card.dataset.cat === cat) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden'); // nikn all nm all show nttm data cat ekka anuwa category ek match krnwa else eke antith ctogry hide
            }
        });
    });
});


//gallery eke image pop ek
const lightbox      = document.getElementById('lightbox'); // all element select krnw
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxLabel = document.getElementById('lightbox-label');
const lightboxCat   = document.getElementById('lightbox-cat');
const closeBtn      = document.getElementById('lightbox-close');

if (lightbox && closeBtn) {

    cards.forEach(card => {
        card.addEventListener('click', () => { //all click event add
            const img   = card.querySelector('img');
            const label = card.querySelector('.card-label');
            const cat   = card.querySelector('.card-cat');

            lightboxImg.src             = img.src;// pop wen ekt click krn imagek add wenwa
            lightboxImg.alt             = img.alt;
            lightboxLabel.textContent   = label ? label.textContent : ''; // label show, label nttm nh
            lightboxCat.textContent     = cat   ? cat.textContent   : '';// text show krnw

            lightbox.classList.add('open'); // click krm open ek visible wenwa (e kiynne popup ek enwa)
            document.body.style.overflow = 'hidden';// scroll block wenw
        });
    });

    closeBtn.addEventListener('click', () => { //close button ek click krm popup nthi wwenw
        lightbox.classList.remove('open'); //popup close
        document.body.style.overflow = '';// scroll puluwn
    });

    lightbox.addEventListener('click', (e) => { //background click unmth popup ekedi popup ek ynw
        if (e.target === lightbox) {// image click unoth mukuth wenne nh
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {// esc button ekth close wenw
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}