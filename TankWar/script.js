window.addEventListener('load', function(){
    //canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    class InputHandler {
        constructor(game){
            this.game = game;
            window.addEventListener('keydown', e => {
                if (((e.key === 'ArrowUp') || (e.key === 'ArrowDown')) && this.game.keys.indexOf(e.key === 1)){
                    this.game.keys.push(e.key)
                } else if (e.key === ' ') {
                    this.game.player.shootTop();
                }
            });
            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key),1)
                }
            });
            }
        }  
    
    //Player
    class Projectile {
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;
        }
        update(){
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) this.markedForDeletion;
        }
        draw(context){
            context.fillstyle = 'yellow';
            context.fillRect(this.x, this.y, this.width, this.height)
        }
    }
    class Player {
        constructor(game){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.speedY = 0;
            this.projectiles = [];
        }
        update(){
            if (this.game.keys.includes('ArrowUp')) this.speedY = -1;
            else if (this.game.keys.includes('ArrowDown'))this.speedY = 1;
            else this.speedY = 0;
            this.y += this.speedY;
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
        draw(context){
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
            context.fillstyle = 'black';
            context.fillRect(this.x, this.y ,this.width ,this.height);
        }
        shootTop(){
            if (this.game.ammo > 0){
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
                this.game.ammo --;
            }
        }
    }
    //enemy
    class Enemy {
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random * -1.5 -0.5;
            this.markedForDeletion = false;
        }
        update() {
            this.x += this.speedX
            if (this.x + this.width < 0) this.markedForDeletion = true;
        }
        draw(context) {
            context.fillstyle = 'red';
            context.fillrect(this.x, this.y, this.width, this.height);
        }
    }
    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228;
            this.height = 169;
            this.y = Math.random() * (this.game.height * 0.9 - this.height)
        }
    }
    //background
    class Layer {

    }
    class Background {

    }
        //game
    class Particle {

    }
    class UI {
        constructor(game) {
            this.game = game;
            this.fontsize = 25;
            this.fontfamily = 'Helvetica';
            this.color = 'white'; 
        } draw(context) {
            context.fillstyle = this.color;
            for (let i = 0; i < this.game.ammo; i++){
                context.fillRect(20 + 5 * i, 20, 3, 20)
            }
        }
    }
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.ammo = 30;
            this.maxammo = 50
        }
        update(){
            this.player.update();
            this.enemies.forEach(enemy => {
                enemy.update();
            });
        }
        draw(context){
            this.player.draw(context);
            this.ui.draw(context);
        }
        addEnemy(){
            this.enemies.push(this);
        }
    }
    const game = new Game(canvas.width, canvas.height);
    //animation loop
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});