window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 500;

    //classes

    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', e => {
                if (((e.key === 'ArrowUp') ||
                    (e.key === 'ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                } else if (e.key === ' ') {
                    this.game.player.shootTop();
                } else if (e.key === 'd') {
                    this.game.debug = !this.game.debug;
                } else if (e.key === 'r') {
                    this.game.score = 0;
                    this.game.lives = 100;
                    this.game.ammo = 20;
                    this.game.enemies = [];
                    this.game.gameOver = false;
                }
            });
            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key, 1), 1)
                }
            });
        }
    }
    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 20;
            this.markedForDeletion = false;
            this.image = document.getElementById('projectile');
        }
        update() {
            this.x += this.speed;
            if (this.x > this.game.width) this.markedForDeletion = true;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y)
        }

    }

    class Player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
            this.speedy = 0;
            this.maxSpeed = 10;
            this.projectiles = [];
            this.image = document.getElementById('player');
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit = 10000;
        }
        update(deltaTime) {
            if (this.game.keys.includes('ArrowUp') && this.game.lives > 0) this.speedy = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown') && this.game.lives > 0) this.speedy = this.maxSpeed;
            else this.speedy = 0;
            if (this.game.lives <= 0) this.y += 10;
            this.y += this.speedy;
            if (this.y + this.height * 0.5 > this.game.height) this.y -= this.maxSpeed;
            if (this.y + this.height * 0.5 < this.game.height - this.game.height && this.game.lives >= 0) this.y += this.maxSpeed;
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
            if (this.frameX < this.maxFrame && this.game.lives > 0) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            if (this.powerUp) {
                if (this.powerUpTimer > this.powerUpLimit) {
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0;
                } else {
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1;
                    this.game.ammo += 0.1;
                }
            }
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

        }
        shootTop() {
            if (this.game.ammo > 0 && this.game.lives > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
                this.game.ammo--;
            }
            if (this.powerUp) this.shootBottom();
        }
        shootBottom() {
            if (this.game.ammo > 0 && this.game.gameOver === false) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175));
                this.game.ammo--;
            }
        }
        enterPowerUp() {
            this.powerUpTimer = 0;
            this.powerUp = true;
            this.game.ammo = this.game.maxAmmo + this.game.ammo;
        }
    }
    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;
            this.lives = 5;
            this.score = this.lives;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
        }
        update() {
            this.x += (this.speedX - this.game.speed);
            if (this.x + this.width < 0) this.markedForDeletion = true;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            context.font = '20px Helvetica';
            if (this.game.debug) context.fillText(this.lives, this.x, this.y);
        }
    }
    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228;
            this.height = 169;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random() * 3);
            this.lives = 2;
            this.score = this.lives;
            this.type = 'nonlucky';

        }
    }
    class Angler2 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 213;
            this.height = 165;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 30;
            this.score = this.lives;
            this.type = 'blaster';
        }
    }
    class LuckyFish extends Enemy {
        constructor(game) {
            super(game);
            this.width = 99;
            this.height = 95;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 3;
            this.score = 15;
            this.type = 'lucky';
        }
    }
    class HiveWhale extends Enemy {
        constructor(game) {
            super(game);
            this.width = 400;
            this.height = 227;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('hivewhale');
            this.frameY = 0;
            this.lives = 15;
            this.score = 15;
            this.type = 'hive';
            this.speedX = Math.random() * -1.2 - 0.2;
        }
    }
    class Drone extends Enemy {
        constructor(game, x, y) {
            super(game);
            this.width = 115;
            this.height = 95;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('drone');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 10;
            this.score = this.lives;
            this.type = 'drone';
            this.speedX = Math.random() * -10 - 2;
        }
    }
    class Healing extends Enemy {
        constructor(game) {
            super(game);
            this.width = 125;
            this.height = 105;
            this.x = this.game.width;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);;
            this.image = document.getElementById('healthpackage');
            this.speedX = Math.random() * -10 - 2;
            this.type = 'heal';
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y);
        }

    }
    class Ammo extends Enemy {
        constructor(game) {
            super(game);
            this.width = 50;
            this.height = 50;
            this.x = this.game.width;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);;
            this.image = document.getElementById('ammo');
            this.speedX = Math.random() * -10 - 2;
            this.type = 'ammo';
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y);
        }

    }
    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        update() {
            if (this.game.gameOver === false) {
                if (this.x <= -this.width) this.x = 0;
                else this.x -= this.game.speed * this.speedModifier - 0.5;
            }
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }
    }
    class Security {
        constructor() {
            this.password = "12345";
        }
        check(password) {
            return this.password === password;
        }
    }
    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById("layer1");
            this.image2 = document.getElementById("layer2");
            this.image3 = document.getElementById("layer3");
            this.image4 = document.getElementById("layer4");
            this.layer1 = new Layer(this.game, this.image1, 5);
            this.layer2 = new Layer(this.game, this.image2, 5);
            this.layer3 = new Layer(this.game, this.image3, 5);
            this.layer4 = new Layer(this.game, this.image4, 5);
            this.layers = [this.layer1, this.layer2, this.layer3, this.layer4];
        }
        update() {
            this.layers.forEach(layer => layer.update());

        }
        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }
    }
    class UI {
        constructor(game) {
            this.game = game;
            this.fontFamily = 'Bangers';
            this.color = 'white';
        }
        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 4;
            context.shadowOffsetY = 4;
            context.shadowColor = 'black';
            context.font = '20px ' + this.fontFamily;
            context.fillText('Score: ' + this.game.score, 20, 40);
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Timer: ' + formattedTime, 20, 100);
            context.fillText('HP: ' + this.game.lives, 20, 125);
            if (this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score >= this.game.winningScore) {
                    message1 = "you win!";
                    message2 = "congraulations!";
                } else if (this.game.lives <= 0) {
                    message1 = "Get my repair kit and try again!";
                    message2 = "Blazes!";

                } else {
                    message1 = "you lose!";
                    message2 = "try again next time!";
                }
                context.font = '150px ' + this.fontFamily;
                context.fillText(message1, this.game.width / 2, this.game.height / 1.2, this.game.width - this.game.width / 9, this.game.height / 3);
                context.fillText(message2, this.game.width / 2, this.game.height / 2, this.game.width - this.game.width / 9, this.game.height / 3);
            }
            context.restore();
        }
    }
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 3000;
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 400;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 500;
            this.gameTime = 0;
            this.timeLimit = 60000 * 30;
            this.speed = 1;
            this.debug = false;
            this.lives = 100;
            this.menw = true;
        }
        update(deltaTime) {
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit || this.lives <= 0) this.gameOver = true;
            this.background.update();
            this.player.update(deltaTime);
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update();
                if (enemy.type === 'blaster' && enemy.y < this.player.y) enemy.y += 3;
                if (enemy.type === 'blaster' && enemy.y > this.player.y) enemy.y -= 3;
                if (enemy.type === 'drone' && enemy.y < this.player.y) enemy.y += 5;
                if (enemy.type === 'drone' && enemy.y > this.player.y) enemy.y -= 5;
                if (enemy.type === 'hive' && enemy.y < this.player.y) enemy.y += 1;
                if (enemy.type === 'hive' && enemy.y > this.player.y) enemy.y -= 1;
                if (enemy.type === 'unlucky' && enemy.y < this.player.y) enemy.y += 2;
                if (enemy.type === 'unlucky' && enemy.y > this.player.y) enemy.y -= 2;
                // if (this.checkProjectileHit(this.player.projectiles, enemy)) {
                //     if (enemy.type === 'blaster') enemy.y += enemy.height;
                //     if (enemy.type === 'drone') enemy.y += enemy.height;
                //     if (enemy.type === 'hive') enemy.y += enemy.height;
                //     if (enemy.type === 'unlucky') enemy.y += enemy.height;
                // }

                if (this.checkCollision(this.player, enemy)) {
                    enemy.markedForDeletion = true;
                    if (enemy.type === 'lucky' && this.lives > 0) this.player.enterPowerUp();
                    else if (enemy.type !== 'ammo' && enemy.type !== 'lucky' && enemy.type !== 'heal' && this.lives + enemy.lives > 0 && this.gameOver === false) this.lives -= enemy.lives;
                    else if (this.lives + enemy.lives < 0) this.lives = 0;
                    if (enemy.type === 'heal' && this.lives + 15 <= 100 && this.gameOver === false) this.lives += 15;
                    else if (enemy.type === 'heal' && this.lives + 10 > 100 && this.gameOver === false) this.lives = 100;
                    if (enemy.type === 'ammo' && this.gameOver === false) this.ammo += 25;
                }
                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        if (enemy.type !== 'heal' && enemy.type !== 'ammo') enemy.lives--;
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0 && enemy.type) {
                            enemy.markedForDeletion = true;
                            if (enemy.type === 'hive') {
                                this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                                this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                                this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                                this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                                this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                            }
                            if (!this.gameOver) this.score += enemy.score;
                            if (this.score >= this.winningScore) this.gameOver = true;
                        }
                    }
                })
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }
        draw(context) {
            this.background.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.player.draw(context);
        }
        addEnemy() {
            const randomize = Math.random();
            if (randomize < 0.1) this.enemies.push(new Angler1(this));
            else if (randomize < 0.2) this.enemies.push(new Angler2(this));
            else if (randomize < 0.4) this.enemies.push(new LuckyFish(this));
            else if (randomize < 0.6) this.enemies.push(new HiveWhale(this));
            else if (randomize < 0.8) this.enemies.push(new Healing(this));
            else this.enemies.push(new Ammo(this));
        }
        checkCollision(rect1, rect2) {
            return (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y);
        }
        checkProjectileHit(projectiles, enemy) {
            var a = projectiles.some(pic1 =>
                pic1.y > enemy.y &&
                pic1.y < enemy.y + enemy.height
            );
            console.log("a is " + a);
            return a;
        }
    }
    function mySignIn() {
        var password = document.getElementById("pass").value;
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