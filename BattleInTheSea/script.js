window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 500;

    //classes

    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                } else if (e.key === ' ' && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                } else if (e.key === 'ArrowRight') {
                    this.game.speedup = true;
                } else if (e.key === 'ArrowLeft') {
                    this.game.speeddown = true;
                } else if (e.key === 'p' && this.game.pause === false) {
                    this.game.pause = true;
                } else if (e.key === 'p' && this.game.pause === true) {
                    this.game.pause = false;
                } else if (e.key === 'r') {
                    this.game.rocketlaunch = true;
                } else if (e.key === 'h') {
                    this.game.healing = true;
                } else if (e.key === 'f') {
                    this.game.repairing = true;
                }
            });
            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key, 1), 1)
                }
                if (e.key === 'ArrowRight') {
                    this.game.speedup = false;
                } else if (e.key === 'ArrowLeft') {
                    this.game.speeddown = false;
                } else if (e.key === 'r') {
                    this.game.rocketlaunch = false;
                } else if (e.key === 'b' && this.game.blocking === false && this.game.forsefield > 0) {
                    this.game.forsefield--;
                    this.game.blocking = true;
                    this.game.sheildhealth = 125;
                } else if (e.key === 'f') {
                    this.game.repairing = false;
                } else if (e.key === 'h') {
                    this.game.healing = false;
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

            this.markedForDeletion = false;
            this.image = document.getElementById('projectile');
        }
        update() {
            this.x += this.game.projectspeed;
            if (this.x > this.game.width + 10000000000000) this.markedForDeletion = true;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y)
        }

    }
    const enemyTypes = ['unlucky', 'blaster', 'hivewhale', 'drone'];
    class Rocketlauncher {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            if (this.game.speedup === true) this.speedX = 1;
            else if (this.game.speeddown === true) this.speedX = 1;
            else this.speedX = 1;
            this.markedForDeletion = false;
            this.image = document.getElementById('rocket');
            this.speedY = 0;
            this.targetEnemy = this.game.enemies?.find((enemy) => enemyTypes.includes(enemy.type));
        }
        update() {
            this.speedX += 2;
            this.x += this.speedX;
            if (this.x > 1700) this.markedForDeletion = true;
            if (this.targetEnemy) {
                this.speedY = this.speedX * (this.targetEnemy.y - this.y) / (this.targetEnemy.x - this.x);
                this.y += this.speedY;
            }
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
            this.x = 550;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0
            this.maxFrame = 37;
            this.speedy = 0;
            this.maxSpeed = 5;
            this.projectiles = [];
            this.bombs = [];
            this.image = document.getElementById('player');
        }
        update(deltaTime) {
            if (this.game.keys.includes('ArrowUp') && this.game.lives > 0) this.speedy = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown') && this.game.lives > 0) this.speedy = this.maxSpeed;
            else this.speedy = 0;
            let heal = Math.random() * 200;
            const formattedheal = parseInt(heal);
            if (this.game.keys.includes(' ') && this.game.shoottime === 5) {
                this.game.player.shootTop();
                this.game.shoottime = 0;
            }
            if (this.game.rocketlaunch === true && this.game.rocketime === 50) {
                this.launchtherocket();
                this.game.rocketime = 0;

            }
            if (this.game.healing === true && this.game.grabedhealing > 0
                && this.game.lives + formattedheal < this.game.maxlives && this.game.gameOver === false) {
                this.game.lives += formattedheal;
                this.game.grabedhealing--;
            }
            if (this.game.repairing === true && this.game.repairkits > 0
                && this.game.sheildhealth + formattedheal < 125 && this.game.gameOver === false
                && this.game.blocking === true) {
                this.game.sheildhealth = 125;
                this.game.repairkits--;
            }
            if (this.game.lives <= 0) this.y += 10;
            this.y += this.speedy;
            if (this.y + this.height > this.game.height) this.y -= this.maxSpeed;
            if (this.y < this.game.height - this.game.height && this.game.lives >= 0) this.y += this.maxSpeed + 0.1;


            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.bombs.forEach(bomb => {
                bomb.update();
            });
            this.bombs = this.bombs.filter(projectile => !projectile.markedForDeletion);
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);

            if (this.frameX < this.maxFrame && this.game.lives > 0) {
                this.frameX++;
                if (this.game.speedup === true) {
                    this.frameX += 1;
                }
            } else {
                this.frameX = 0;
            }
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });

            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width, this.height);
            context.fillStyle = '#880000';
            context.fillRect(50, 225, 1 * this.game.maxlives, 20);
            context.fillStyle = 'red';
            context.fillRect(50, 225, 1 * this.game.lives, 20);
            this.bombs.forEach(bomb => {
                bomb.draw(context);
            });
            if (this.game.blocking === true) {
                context.drawImage(document.getElementById('sheild'), this.x + 5, this.y - 20,
                    this.width + 30, this.height + 30);
                context.fillStyle = '#880000';
                context.fillRect(this.x + 15, this.y - 30, 125, 10);
                context.fillStyle = 'red';
                context.fillRect(this.x + 15, this.y - 30, this.game.sheildhealth, 10);

            }
        }
        shootTop() {
            if (this.game.ammo > 0 && this.game.lives > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
                this.game.ammo--;
            }

        }
        launchtherocket() {
            if (this.game.rocketammo > 0 && this.game.lives >= 0) {
                this.bombs.push(new Rocketlauncher(this.game, this.x + 80, this.y + 30));
                this.game.rocketammo--;
            }
        }
    }

    class EnemyProjectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            if (this.game.speedup === true) this.speed = -30;
            else if (this.game.speeddown === true) this.speed = -10;
            else this.speed = -20;
            this.markedForDeletion = false;
            this.image = document.getElementById('projectile');
        }
        update() {
            this.x += this.speed;
            if (this.x < 0) this.markedForDeletion = true;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y)
        }

    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width + 300;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.firstspeed = this.speedX;
            this.markedForDeletion = false;
            this.lives = 5;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
            this.type;
            this.enemyprojectiles = [];
            this.enemyshoottime = 0;
        }
        update() {
            this.x += (this.speedX - this.game.speed);
            if (this.x + this.width < 0) this.markedForDeletion = true;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            if (this.game.speedup === true) {
                this.speedX = this.speedX - 1;
            } else if (this.game.speeddown === true) {
                this.speedX = this.speedX + 1;
            } else {
                this.speedX = this.firstspeed;
            }

            if (this instanceof Angler2 || this instanceof Boss) {
                this.updateProjectiles();
                console.log("fire!!!")
            }
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            let lifePixel = 20;
            let yp = this.y - 30;
            let lifeBarW = this.fullhealth * lifePixel;
            let xp = this.x + (this.width - lifeBarW) / 2;
            let frameX = this.frameX;
            if (this instanceof Boss) {
                frameX = (this.frameX / 6).toFixed(0);
            }
            context.drawImage(this.image, frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width, this.height);
            if (this.type !== 'drone') {
                context.fillStyle = '#880000';
                context.fillRect(xp, yp, lifeBarW, 10);
                context.fillStyle = '#ff0000';
                context.fillRect(xp, yp, this.lives * lifePixel, 10);
            }
            if (this instanceof Angler2 || this instanceof Boss) {
                this.enemyprojectiles.forEach(projectile => {
                    projectile.draw(context);
                });
            }
        }
        shoot() {
            if (this.enemyshoottime <= 1 && this instanceof Angler2) {
                this.enemyprojectiles.push(new EnemyProjectile(this.game, this.x + 30, this.y + 100));
            }
            if (this.frameX === 1 && this instanceof Boss || this.frameX === 4 && this instanceof Boss) {
                this.enemyprojectiles.push(new EnemyProjectile(this.game, this.x + 34, this.y + 19));
            }

        }
        updateProjectiles() {
            if (this.enemyshoottime < 90) {
                this.enemyshoottime++;
            } else {
                this.enemyshoottime = 0;
            }
            this.enemyprojectiles.forEach(projectile => {
                projectile.update();
            });
            this.enemyprojectiles = this.enemyprojectiles.filter(projectile => !projectile.markedForDeletion);
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
            this.lives = 70;
            this.type = 'nonlucky';
            this.fullhealth = this.lives;
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
            this.lives = 50;
            this.type = 'blaster';
            this.fullhealth = this.lives;

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
            this.lives = 30;
            this.type = 'hive';
            this.speedX = Math.random() * -1.2 - 0.2;
            this.fullhealth = this.lives;

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
            this.type = 'drone';
            this.speedX = Math.random() * -1.2 - 0.2;
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
    class UltraSheild extends Enemy {
        constructor(game) {
            super(game);
            this.width = 30;
            this.height = 60;
            this.x = this.game.width;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);;
            this.image = document.getElementById('sheild');
            this.speedX = Math.random() * -10 - 2;
            this.type = 'sheild';
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

    }
    class Fix extends Enemy {
        constructor(game) {
            super(game);
            this.width = 33;
            this.height = 30;
            this.x = this.game.width;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);;
            this.image = document.getElementById('fix');
            this.speedX = Math.random() * -10 - 2;
            this.type = 'repair';
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y);
        }

    }
    class Boss extends Enemy {
        constructor(game) {
            super(game);
            this.width = 67;
            this.height = 69;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('boss');
            this.frameY = 0;
            this.lives = 100;
            this.type = 'boss';
            this.speedX = Math.random() * -1.2 - 0.2;
            this.fullhealth = this.lives;
            this.maxFrame = 30;
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
            if (!this.game.gameOver) {
                if (this.game.speedup === true) {
                    if (this.x <= -this.width) this.x = 0;
                    else this.x -= this.game.speed * this.speedModifier + 10;
                } else if (this.game.speeddown) {
                    if (this.x > 0) this.x = -this.width + 0.01;
                    else if (this.x <= -this.width) this.x = 0;
                    else this.x -= this.game.speed * this.speedModifier - 10;
                } else {
                    if (this.x <= -this.width) this.x = 0;
                    else this.x -= this.game.speed * this.speedModifier;
                }
            }
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
            context.drawImage(this.image, this.x - this.width, this.y);
        }
    }
    class Security {
        constructor() {
            this.password = "13245";
            this.isGranted = false;
        }
        check(password) {
            this.isGranted = this.password === password;
            return this.isGranted;
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
            const backupAmmoW = 10;//width
            const backupAmmoG = 3;// gap
            context.drawImage(document.getElementById('loadedammo'), 23, 45, 10, 28);
            context.fillText("x" + this.game.ammo, 40, 70);
            context.drawImage(document.getElementById('allrocket'), 5 + backupAmmoW, 75);
            context.fillText("x" + this.game.rocketammo, 40, 150);
            context.drawImage(document.getElementById('ammo'), 1350 - (backupAmmoW + 20) - 40, 50, 40, 40);
            context.fillText("x" + this.game.backupammo, 1320, 85);
            context.drawImage(document.getElementById('grabedhealing'), 1350 - (20 + backupAmmoG) - 40, 100, 20, 20);
            context.fillText("x" + this.game.grabedhealing, 1320, 120);
            context.drawImage(document.getElementById('sheild'), 1350 - (20 + backupAmmoG) - 40, 130, 15, 30);
            context.fillText("x" + this.game.forsefield, 1320, 160);
            context.drawImage(document.getElementById('fix'), 1350 - (30 + backupAmmoG) - 40, 170, 30, 30);
            context.fillText("x" + this.game.repairkits, 1320, 200);
            if (this.game.speedup && this.game.gameOver === false) this.game.gameTime += 100;
            if (this.game.speeddown && this.game.gameOver === false) this.game.gameTime -= 100;
            const formattedTime = ((this.game.timeLimit - this.game.gameTime) * 0.001).toFixed(0);
            context.fillText("coins: " + this.game.downEnemy, 20, 40);
            context.fillText('Damage: ' + this.game.damage, 20, 170);
            context.fillText('Time Left Until You Get To Enemy Base: ' + formattedTime + 's', 20, 190);
            context.fillText('HP: ', 20, 240);
            context.fillStyle = 'white';
            context.fillRect(20, 200, 250, 20);
            context.fillStyle = 'white';
            context.fillStyle = this.color;
            if (this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.lives > 0) {
                    message1 = "you win!";
                    message2 = "congraulations!";
                    let base = document.getElementById('base');
                    context.drawImage(base, 1200, 200, 539, 198);
                } else if (this.game.lives <= 0) {
                    message1 = "Get my repair kit and try again!";
                    message2 = "Blazes!";

                } else {
                    message1 = "you lose!";
                    message2 = "try again next time!";
                }
                context.font = '150px ' + this.fontFamily;
                context.fillText(message1, this.game.width / 2, this.game.height / 1.2,
                    this.game.width - this.game.width / 9, this.game.height / 3);
                context.fillText(message2, this.game.width / 2, this.game.height / 2,
                    this.game.width - this.game.width / 9, this.game.height / 3);
            }
            context.restore();
            context.fillRect(20, 200, this.game.rocketime * 5, 20);
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
            this.backupammo = 1;
            this.forsefield = 1;
            this.gameOver = false;
            this.score = 0;
            this.gameTime = 0;
            this.timeLimit = 60 * 1000 * 10; // 10 min
            this.uplimit = 30000;
            this.speed = 1;
            this.debug = false;
            if (hardnessLevel === 'easy') {
                this.lives = 100000000000000000000;
                this.maxlives = 100000000000000000000;
            } else if (hardnessLevel === 'hard') {
                this.lives = 200;
                this.maxlives = 200;
            } else {
                this.lives = 300;
                this.maxlives = 300;
            }
            this.damage = 1;
            this.downEnemy = 10000;
            this.speedup = false;
            this.speeddown = false;
            this.shoottime = 0;
            this.pause = false;
            this.launch = 1;
            this.rocketlaunch = false;
            this.rocketime = 0;
            this.rocketammo = 1;
            this.grabedhealing = 1;
            this.healing = false;
            this.blocking = false;
            this.sheildhealth = 125;
            this.staydamage = 0;
            this.staydamagestop = 100;
            this.stopdamage = 100;
            this.repairkits = 1;
            this.repairing = false;
            this.projectspeed = 5
        }
        update(deltaTime, context) {

            if (!security.isGranted) return;
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.stopdamage < this.staydamagestop) this.lives -= this.staydamage * 0.1;
            this.stopdamage++;
            if (this.shoottime < 5) {
                this.shoottime++;
            }
            if (this.sheildhealth <= 0) this.blocking = false;

            if (this.launch > 0) {
                this.launch--;
            } else {
                this.launch = 40;
            }
            if (this.rocketime < 50 && this.lives >= 0) {
                this.rocketime++;
            }

            if (this.gameTime > this.timeLimit || this.lives <= 0) this.gameOver = true;
            this.background.update();
            this.player.update(deltaTime);
            if (this.ammo === 0 && this.backupammo > 0) {
                this.ammo = 50;
                this.backupammo--;
            }


            this.enemies.forEach(enemy => {
                enemy.update();
                let nailedit = Math.random();
                if (enemy.type === 'hive' && this.launch <= 0) {
                    this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                }
                if (enemy.type === 'blaster' && enemy.y < this.player.y
                    && enemy.x < this.width && this.lives > 0) enemy.y += 3;
                if (enemy.type === 'blaster' && enemy.y > this.player.y
                    && enemy.x < this.width && this.lives > 0) enemy.y -= 3;
                if (enemy.type === 'drone' && enemy.y < this.player.y
                    && enemy.x < this.width && this.lives > 0) enemy.y += 5;
                if (enemy.type === 'drone' && enemy.y > this.player.y
                    && enemy.x < this.width && this.lives > 0) enemy.y -= 5;
                if (enemy.type === 'hive' && enemy.y < this.player.y
                    && enemy.x < this.width && this.lives > 0) enemy.y += 1;
                if (enemy.type === 'hive' && enemy.y > this.player.y
                    && enemy.x < this.width && this.lives > 0) enemy.y -= 1;
                if (enemy.type === 'nonlucky' && enemy.y < this.player.y
                    && enemy.x < this.width && this.lives > 0) enemy.y += 2;
                if (enemy.type === 'nonlucky' && enemy.y > this.player.y
                    && enemy.x < this.width && this.lives > 0) enemy.y -= 2;
                if (enemy.type === 'boss' && enemy.y < this.player.y
                    && enemy.x < this.width && this.lives > 0) enemy.y += 7;
                if (enemy.type === 'boss' && enemy.y > this.player.y
                    && enemy.x < this.width && this.lives > 0) enemy.y -= 7;
                if (enemy instanceof Angler2 || enemy instanceof Boss) {
                    enemy.shoot();
                    enemy.enemyprojectiles.forEach(projectile => {
                        if (this.checkCollision(projectile, this.player) && this.gameOver === false
                            && this.blocking === false && nailedit < 0.5) {
                            this.lives -= 3;
                            this.staydamage++;
                            this.stopdamage = 0
                            projectile.markedForDeletion = true;
                        } else if (this.checkCollision(projectile, this.player) && this.gameOver === false
                            && this.blocking === true && nailedit < 0.5) {
                            this.sheildhealth -= 3;
                            projectile.markedForDeletion = true;
                        }
                    });
                }

                if (this.checkCollision(this.player, enemy) && nailedit < 0.5) {
                    enemy.markedForDeletion = true;
                    if (enemy.type !== 'ammo' && enemy.type !== 'lucky' && enemy.type !== 'heal'
                        && enemy.type !== 'sheild' && enemy.type !== 'repair' && this.gameOver === false
                        && this.blocking === false) this.lives -= enemy.lives;
                    else if (enemy.type !== 'ammo' && enemy.type !== 'lucky' && enemy.type !== 'heal'
                        && enemy.type !== 'sheild' && enemy.type !== 'repair' && this.gameOver === false
                        && this.blocking === true) this.sheildhealth -= enemy.lives;
                    if (this.lives - enemy.lives < 0) this.lives = 0;
                    if (enemy.type === 'heal' && this.gameOver === false && this.grabedhealing + 5 <= 30) {
                        this.grabedhealing += 5;
                    }
                    if (enemy.type === 'ammo' && this.gameOver === false && this.backupammo < 10) {
                        this.backupammo += 3;
                    }
                    if (enemy.type === 'ammo' && this.gameOver === false && this.backupammo < 10) {
                        this.backupammo = 10;
                    }
                    if (enemy.type === 'ammo' && this.gameOver === false && this.rocketammo < 20) {
                        this.rocketammo += 3;
                    } if (enemy.type === 'ammo' && this.gameOver === false && this.rocketammo > 20) {
                        this.rocketammo = 20;
                    }
                    if (enemy.type === 'sheild' && this.gameOver === false && this.forsefield < 27) {
                        this.forsefield += 2;
                    }
                    if (enemy.type === 'repair' && this.gameOver === false && this.repairkits < 27) {
                        this.repairkits += 2;
                    }
                }
                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy) && nailedit < 0.5) {
                        if (enemy.type !== 'heal' && enemy.type !== 'ammo'
                            && enemy.type !== 'sheild' && enemy.type !== 'repair') {
                            enemy.lives -= this.damage;
                            enemy.x += enemy.speedX + 50;
                        }
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;
                            this.downEnemy += 2000;
                            if (enemy.type === 'hive') {
                                this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                                this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                                this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                                this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                                this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                            }
                        }
                    }
                })
                this.player.bombs.forEach(bomb => {
                    if (this.checkCollision(bomb, enemy) && nailedit < 0.5) {
                        if (enemy.type !== 'heal' && enemy.type !== 'ammo') {
                            enemy.lives -= 20 + this.damage;
                            enemy.x += enemy.speedX + 100;
                        }
                        bomb.markedForDeletion = true;

                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;
                            let money = Math.random();

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
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.ui.draw(context);
            if (this.lives <= 70) {
                context.drawImage(document.getElementById('redbackground'), 0, 0, 1400, 500);
            }
        }
        addEnemy() {
            const randomize = Math.random();
            if (randomize < 0.75) this.enemies.push(new Boss(this));
        }
        checkCollision(rect1, rect2) {
            return (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y);
        }
        checkHit(rect1, rect2) {
            return (rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y);
        }
    }
    function mySignIn() {
        var password = document.getElementById("pass").value;
        var isGranted = security.check(password);
        const radioButtons = document.querySelectorAll('input[name="hardness_level"]');

        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                hardnessLevel = radioButton.value;
                break;
            }
        }

        if (isGranted) {
            gameDiv.style.visibility = "visible";
            securityDiv.style.visibility = "hidden";
            shopDiv.style.visibility = "hidden";

            let lastTime = 0;
            function animate(timeStamp) {
                const deltaTime = timeStamp - lastTime;
                lastTime = timeStamp;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (game.pause === false) {
                    game.update(deltaTime, ctx);
                }
                game.draw(ctx);

                requestAnimationFrame(animate);
            }
            animate(0);
        } else {
            gameDiv.style.visibility = "hidden";
            securityDiv.style.visibility = "visible";
            shopDiv.style.visibility = "hidden";
        }
    }
    function goshoping() {
        gameDiv.style.visibility = "hidden";
        shopDiv.style.visibility = "visible";
        securityDiv.style.visibility = "hidden";
        game.pause = true;
        updateBalance();
    }
    shopButton.onclick = function () {
        goshoping();
    }
    resumeGame.onclick = function () {
        gameDiv.style.visibility = "visible";
        securityDiv.style.visibility = "hidden";
        shopDiv.style.visibility = "hidden";
        game.pause = false;

    }

    btnBuyammo.onclick = function () {
        if (game.downEnemy > 0) {
            game.downEnemy -= 2000;
            game.backupammo += 5;
        }
        updateBalance();
    }
    btnBuyultrasheild.onclick = function () {
        if (game.downEnemy > 0) {
            game.downEnemy -= 3000;
            game.forsefield += 5;
        }
        updateBalance();
    }
    btnBuygrabedhealing.onclick = function () {
        if (game.downEnemy > 0) {
            game.downEnemy -= 1000;
            game.grabedhealing += 5;
        }
        updateBalance();
    }
    btnBuymissile.onclick = function () {
        if (game.downEnemy > 0) {
            game.downEnemy -= 1000;
            game.rocketammo += 5;
        }
        updateBalance();
    }
    btnBuyFix.onclick = function () {
        if (game.downEnemy > 0) {
            game.downEnemy -= 500;
            game.repairkits += 5;
        }
        updateBalance();
    }
    btnBuyspeed.onclick = function () {
        if (game.downEnemy > 0) {
            game.downEnemy -= 500;
            game.projectspeed += 1;
        }
        updateBalance();
    }
    btnBuydamage.onclick = function () {
        if (game.downEnemy > 0) {
            game.downEnemy -= 500;
            game.damage += 1;
        }
        updateBalance();
    }

    function updateBalance() {
        let balance = document.getElementById('howRich');
        balance.innerText = 'balance: ' + game.downEnemy;
    }

    const game = new Game(canvas.width, canvas.height);
    const security = new Security();
    const securityDiv = document.getElementById("security");
    const gameDiv = document.getElementById("gamePage");
    const shopDiv = document.getElementById("shoppingPage");
    const submit = document.getElementById("submit");
    var hardnessLevel = "normal";
    submit.onclick = function () { mySignIn() };
});