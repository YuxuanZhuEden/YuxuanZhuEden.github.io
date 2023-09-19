window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 500;


    function mySignIn() {
        var password = document.getElementById("pass").value;
        game.damage = Number(document.getElementById('level').value);
        game.enemyInterval = 3000 - Number(document.getElementById('level').value) * 100;
        var isGranted = security.check(password);
        if (isGranted) {
            canvas.style.visibility = "visible";
            securityDiv.style.visibility = "hidden";
        } else {
            canvas.style.visibility = "hidden";
            securityDiv.style.visibility = "visible";
        }
    }


    const game = new Game(canvas.width, canvas.height);
    const security = new Security();
    const securityDiv = document.getElementById("security");
    const submit = document.getElementById("submit");
    submit.onclick = function () { mySignIn() };


    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});