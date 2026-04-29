
    const a3d = document.querySelector(".a3d");


    let targetY = 0;
    let targetX = 0;

    let currentY = 0;
    let currentX = 0;


    document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;

    targetY = x * 80;
    targetX = -y * 40;



});

    function animate() {
    currentY += (targetY - currentY) * 0.08;
    currentX += (targetX - currentX) * 0.08;
    a3d.style.transform =
    `rotateY(${currentY}deg) rotateX(${currentX}deg)`;

    requestAnimationFrame(animate);

}
    animate();




