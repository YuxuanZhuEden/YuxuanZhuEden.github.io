window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 500;
    let game;
    let mouseX, mouseY;
    let ishooting;

    const securityDiv = document.getElementById("security");
    const gameDiv = document.getElementById("gamePage");
    const shopDiv = document.getElementById("shoppingPage");
    const marketDiv = document.getElementById("marketPage");
    const submit = document.getElementById("submit");
    const body = document.getElementById("body");
    var hardnessLevel = "normal";


    const EnemyType = {
        nonlucky: "nonlucky",
        blaster: "blaster",
        hivewhale: "hivewhale",
        drone: "drone",
        boss: "boss",
        heal: "heal",
        ammo: "ammo",
        sheild: "sheild",
        repair: "repair",
        trash: "trash"
    }

    const badEnemyTypes = [EnemyType.trash, EnemyType.nonlucky, EnemyType.blaster, EnemyType.hivewhale, EnemyType.drone, EnemyType.boss];

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
                } else if (e.key === 'p' && !this.game.pause) {
                    this.game.pause = true;
                } else if (e.key === 'p' && this.game.pause === true) {
                    this.game.pause = false;
                } else if (e.key === 'm') {
                    this.game.rocketlaunch = true;
                } else if (e.key === 'h') {
                    this.game.healing = true;
                } else if (e.key === 'r') {
                    this.game.repairing = true;
                } else if (e.key === 'w') {
                    this.game.commandup = true;
                } else if (e.key === 's') {
                    this.game.commanddown = true;
                } else if (e.key === 'f') {
                    this.game.forsefield = true;
                    this.game.forsefieldHp = this.game.maxforsefieldHp;
                } else if (e.key === 'i' && this.game.invisability > 0) {
                    this.game.hide = true;
                    this.game.invisability--;
                    this.game.hidetimer = this.game.maxhidetimer;
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
                } else if (e.key === 'm') {
                    this.game.rocketlaunch = false;
                } else if (e.key === 'b' && !this.game.blocking && this.game.shields > 0) {
                    this.game.shields--;
                    this.game.blocking = true;
                    this.game.sheildhealth = 125;
                } else if (e.key === 'h') {
                    this.game.healing = false;
                } else if (e.key === 'w') {
                    this.game.commandup = false;
                } else if (e.key === 's') {
                    this.game.commanddown = false;
                } else if (e.key === 'r') {
                    this.game.repairing = false;
                }
            });
            window.addEventListener("mousemove", (event) => {
                mouseX = event.clientX;
                mouseY = event.clientY;
            });
            window.addEventListener("mousedown", (event) => {
                ishooting = true;
                console.log("mouse down x", mouseX);
            });
            window.addEventListener("mouseup", (event) => {
                ishooting = false;
            });
        }
    }

    class Projectile {
        constructor(game, x, y, angle = 0) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.speedX = this.game.projectile_speed;
            this.speedY = this.speedX * Math.tan(angle);
            this.width = 10;
            this.height = 3;
            this.type = 'normal';
            this.markedForDeletion = false;
            this.image = document.getElementById('projectile');
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > this.game.player.x + this.game.ammoreach) this.markedForDeletion = true;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y)
        }

    }

    class Bubble {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 95;
            this.height = 49;
            this.speedX = 20;
            let moveY = 0;
            const targetEnemy1 = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
                && enemy.shocked === false
            )
            const targetEnemy2 = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
            )
            if (targetEnemy1) {
                moveY = 20 * (targetEnemy1.y - this.y) / (targetEnemy1.x - this.x);
            } else if (targetEnemy2) {
                moveY = 20 * (targetEnemy2.y - this.y) / (targetEnemy2.x - this.x);
            }
            this.speedY = moveY;
            this.markedForDeletion = false;
            this.image = document.getElementById('bubble');
            this.type = 'bubble';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y)
        }

    } class potion {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.markedForDeletion = false;
            this.speed = 20;
        }
        update() {
            this.x += this.speed;
            if (this.x > 1000) this.markedForDeletion = true;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }

    }


    class poison extends potion {
        constructor() {
            super(game);
            this.width = 45;
            this.height = 55;
            this.image = document.getElementById('poison');
        }
    }
    class invisability extends potion {
        constructor() {
            super(game);
            this.width = 60;
            this.height = 81;
            this.image = document.getElementById('invisability');
        }
    } class harming extends potion {
        constructor() {
            super(game);
            this.width = 45;
            this.height = 63;
            this.image = document.getElementById('harming');
        }
    } class weakness extends potion {
        constructor() {
            super(game);
            this.width = 40;
            this.height = 55;
            this.image = document.getElementById('weakness');
        }
    }
    class confusion extends potion {
        constructor() {
            super(game);
            this.width = 45;
            this.height = 62;
            this.image = document.getElementById('confusion');
        }
    }

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
        }
        update() {
            this.speedX += 2;
            this.x += this.speedX;
            if (this.x > 1700) this.markedForDeletion = true;
            let targetEnemy = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
            )
            if (targetEnemy) {
                if (this.y < targetEnemy.y) this.y += 10;
                else if (this.y > targetEnemy.y) this.y -= 10;
            }
            console.log("targetenemy.y:" + targetEnemy?.y);
            console.log("this.y:" + this.y);
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }

    }
    class Electricty {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 95;
            this.height = 49;
            this.speedX = 20;
            let moveY = 0;
            const targetEnemy1 = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
                && enemy.shocked === false
            )
            const targetEnemy2 = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
            )
            if (targetEnemy1) {
                moveY = 20 * (targetEnemy1.y - this.y) / (targetEnemy1.x - this.x);
            } else if (targetEnemy2) {
                moveY = 20 * (targetEnemy2.y - this.y) / (targetEnemy2.x - this.x);
            }
            this.speedY = moveY;
            this.markedForDeletion = false;
            this.image = document.getElementById('electrictyDown');
            this.imageDown = document.getElementById('electrictyDown');
            this.imageUp = document.getElementById('electrictyUp');
            this.type = 'electrify';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }
    }
    class spike {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 95;
            this.height = 49;
            this.speedX = 20;
            let moveY = 0;
            const targetEnemy1 = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
                && enemy.shocked === false
            )
            const targetEnemy2 = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
            )
            if (targetEnemy1) {
                moveY = 20 * (targetEnemy1.y - this.y) / (targetEnemy1.x - this.x);
            } else if (targetEnemy2) {
                moveY = 20 * (targetEnemy2.y - this.y) / (targetEnemy2.x - this.x);
            }
            this.speedY = moveY;
            this.markedForDeletion = false;
            this.image = document.getElementById('spike');
            this.imageDown = document.getElementById('spikeUp');
            this.imageUp = document.getElementById('spikeDown');
            this.type = 'spike';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width * 0.2, this.height * 0.2);
        }
    }
    class Player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 550;
            this.y = 100;
            this.centerX = this.x + this.width / 2;
            this.centerY = this.y + this.height / 2;
            this.frameX = 0;
            this.frameY = 0
            this.maxFrame = 37;
            this.smokeFrameX = 0;
            this.smokeMaxFrame = 4;
            this.speedy = 0;
            this.maxSpeed = 5;
            this.projectiles = [];
            this.bombs = [];
            this.image = document.getElementById('player');
            this.smokestatus = 0;
            this.smoketimer = 40;
            this.angle = 0;
        }
        update() {
            if (this.game.keys.includes('ArrowUp') && this.game.lives > 0) this.speedy = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown') && this.game.lives > 0) this.speedy = this.maxSpeed;
            else this.speedy = 0;
            let heal = Math.random() * 200;
            const formattedheal = parseInt(heal);
            if (ishooting && this.game.shoottime >= this.game.firerate) {
                this.shootTop();
                this.game.shoottime = 0;
            }
            if (this.game.rocketlaunch === true && this.game.rocketime === 50) {
                this.launchtherocket();
                this.game.rocketime = 0;
            }
            if (this.game.healing === true && this.game.grabedhealing > 0
                && this.game.lives + formattedheal < this.game.maxlives
                && !this.game.gameOver) {
                this.game.lives += formattedheal;
                this.game.grabedhealing--;
            }
            if (this.game.repairing === true && this.game.repairkits > 0
                && this.game.sheildhealth + formattedheal < 125 && !this.game.gameOver
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
            this.angle = Math.atan((mouseY - this.centerY) / (mouseX - this.centerX));
        }
        draw(context) {
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
            if (!this.game.hide) {
                context.translate(this.x + this.width / 2, this.y + this.height / 2);
                context.rotate(this.angle);
                context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                    this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
                context.rotate(-this.angle);
                context.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));

                if (this.game.blocking === true) {
                    context.drawImage(document.getElementById('sheild'), this.x + 5, this.y - 20,
                        this.width + 30, this.height + 30);
                    context.fillStyle = '#880000';
                    context.fillRect(this.x + 15, this.y - 30, 125, 10);
                    context.fillStyle = 'red';
                    context.fillRect(this.x + 15, this.y - 30, this.game.sheildhealth, 10);
                }
            } else {
                context.strokeRect(this.x, this.y, this.width, this.height);
            }
            context.fillStyle = '#880000';
            context.fillRect(50, 225, this.game.maxlives / 6, 20);
            context.fillStyle = 'red';
            context.fillRect(50, 225, this.game.lives / 6, 20);
            this.bombs.forEach(bomb => {
                bomb.draw(context);
            });
            if (this.game.forsefield) {
                context.drawImage(document.getElementById('forseField'), this.x + (this.width / 4), this.y - 50)
                context.fillRect(this.x - (this.width / 4), this.y - 80, this.game.forsefieldHp, 10);
            }

        }
        shootTop() {
            if (this.game.ammo > 0 && this.game.lives > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, this.angle));
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
    class Dolphin {
        constructor(game, y) {
            this.game = game;
            this.width = 64;
            this.height = 104;
            this.x = 300;
            this.y = y;
            this.frameX = 0;
            this.frameY = 0
            this.maxFrame = 5;
            this.projectiles = [];
            this.bombs = [];
            this.image = document.getElementById('dolphin');
            this.firerate = 0;
            this.markedForDeletion = false;
            this.lives = 1000;
            this.maxlives = 1000;
            this.type = "dolphin";
        }
        update() {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            if (this.firerate < this.maxfirerate) {
                this.firerate++;
            }
            else if (this.game.lives > 0 && this.game.lives + 50 < this.game.maxlives + 100) {
                this.firerate = 0;
                this.game.lives += 50;
            }
            if (this.y < this.game.player.y) {
                this.y++;
            } else {
                this.y--;

            }
        }
        draw(context) {
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width * 2, this.height * 2);
            let healthWidth = this.lives / 6;
            let healthpos = this.x - (healthWidth - this.width) / 2;
            context.fillRect(healthpos, this.y - 10, healthWidth, 10);
        }
    }
    class eel {
        constructor(game, y) {
            this.game = game;
            this.width = 48;
            this.height = 52;
            this.x = 300;
            this.y = y;
            this.frameX = 0;
            this.frameY = 0
            this.maxFrame = 5;
            this.projectiles = [];
            this.bombs = [];
            if (this.firerate > 24) {
                this.image = document.getElementById('eelAttack');
            } else {
                this.image = document.getElementById('eelWalk');
            }
            this.firerate = 0;
            this.maxfirerate = 30;
            this.markedForDeletion = false;
            this.lives = 1000;
            this.maxlives = 1000;
            this.projectiles = [];
            this.type = "eel";
        }
        update() {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            const targetEnemy2 = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
            )
            if (this.firerate < this.maxfirerate) {
                this.firerate++;
            } else if (targetEnemy2) {
                this.firerate = 0;
                this.projectiles.push(new Electricty(this.game, this.x, this.y));
            }
            if (this.y < this.game.player.y) {
                this.y++;
            } else {
                this.y--;
            }
            this.projectiles.forEach(bolt => {
                bolt.update();
            })
        }
        draw(context) {
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width * 3, this.height * 3);
            let healthWidth = this.lives / 6;
            let healthpos = this.x - (healthWidth - this.width) / 2;
            context.fillRect(healthpos, this.y - 10, healthWidth, 10);
            this.projectiles.forEach(bolt => {
                bolt.draw(context);
            })
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
    }
    class pufferfish {
        constructor(game, y) {
            this.game = game;
            this.width = 38;
            this.height = 30;
            this.x = 300;
            this.y = y;
            this.frameX = 0;
            this.frameY = 0
            this.maxFrame = 1;
            this.projectiles = [];
            this.bombs = [];
            this.image = document.getElementById('pufferfish');
            this.firerate = 0;
            this.maxfirerate = 30;
            this.markedForDeletion = false;
            this.lives = 1000;
            this.maxlives = 1000;
            this.projectiles = [];
            this.type = "pufferfish";
            this.addframeX = 0;
            this.maxaddframeX = 5000;
        }
        update() {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            const targetEnemy2 = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
            )
            if (this.firerate < this.maxfirerate) {
                this.firerate++;
            } else if (targetEnemy2) {
                this.firerate = 0;
                this.projectiles.push(new spike(this.game, this.x, this.y));
            }
            if (this.y < this.game.player.y) {
                this.y++;
            } else {
                this.y--;
            }
            this.projectiles.forEach(bolt => {
                bolt.update();
            })
        }
        draw(context) {
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width * 3, this.height * 3);
            let healthWidth = this.lives / 6;
            let healthpos = this.x - (healthWidth - this.width) / 2;
            context.fillRect(healthpos, this.y - 10, healthWidth, 10);
            this.projectiles.forEach(bolt => {
                bolt.draw(context);
            })
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
    }
    class fish {
        constructor(game, y) {
            this.game = game;
            this.width = 100;
            this.height = 52;
            this.x = 300;
            this.y = y;
            this.frameX = 0;
            this.frameY = 0
            this.maxFrame = 1;
            this.projectiles = [];
            this.bombs = [];
            this.image = document.getElementById('fish');
            this.firerate = 0;
            this.maxfirerate = 30;
            this.markedForDeletion = false;
            this.lives = 1000;
            this.maxlives = 1000;
            this.projectiles = [];
            this.type = "fish";
        }
        update() {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            const targetEnemy2 = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
            )
            if (this.firerate < this.maxfirerate) {
                this.firerate++;
            } else if (targetEnemy2) {
                this.firerate = 0;
                this.projectiles.push(new Bubble(this.game, this.x, this.y));
            }
            if (this.y < this.game.player.y) {
                this.y++;
            } else {
                this.y--;
            }
            this.projectiles.forEach(bolt => {
                bolt.update();
            })
        }
        draw(context) {
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width, this.height);
            let healthWidth = this.lives / 6;
            let healthpos = this.x - (healthWidth - this.width) / 2;
            context.fillRect(healthpos, this.y - 10, healthWidth, 10);
            this.projectiles.forEach(bolt => {
                bolt.draw(context);
            })
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
    }
    class Turtle {
        constructor(game, y) {
            this.game = game;
            this.width = 48;
            this.height = 52;
            this.x = 300;
            this.y = y;
            this.frameX = 0;
            this.frameY = 0
            this.maxFrame = 5;
            this.projectiles = [];
            this.bombs = [];
            this.image = document.getElementById('turtle');
            this.firerate = 0;
            this.maxfirerate = 400;
            this.markedForDeletion = false;
            this.lives = 1000;
            this.maxlives = 1000;
            this.type = "turtle";
        }
        update() {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            if (this.firerate < this.maxfirerate) {
                this.firerate++;
            }
            else {
                this.firerate = 0;
                this.game.forsefieldHp = this.game.maxforsefieldHp;
                this.game.forsefield = true;
            }
            if (this.y < this.game.player.y) {
                this.y++;
            } else {
                this.y--;
            }
        }
        draw(context) {
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width * 3, this.height * 3);
            let healthWidth = this.lives / 6;
            let healthpos = this.x - (healthWidth - this.width) / 2;
            context.fillRect(healthpos, this.y - 10, healthWidth, 10);
            this.projectiles.forEach(bolt => {
                bolt.draw(context);
            })
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
    }
    class Helper {
        constructor(game, y) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 300;
            this.y = y;
            this.frameX = 0;
            this.frameY = 0
            this.maxFrame = 37;
            this.projectiles = [];
            this.bombs = [];
            this.image = document.getElementById('player');
            this.firerate = 0;
            this.maxfirerate = 20;
            this.markedForDeletion = false;
            this.lives = 1000;
            this.maxlives = 1000;
            this.type = "seahorse";
            // if (this.mode === 1) {
            //     this.maxfirerate = 50;
            //     this.damage = 10;
            // } else {
            //     this.maxfirerate = 20;
            //     this.damage = 3;
            // }
        }
        update() {
            if (this.frameX <= this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            if (this.game.commanddown) this.y += 5;
            if (this.game.commandup) this.y -= 5;
            let targetEnemy = this.game.enemies.find((enemy) =>
                badEnemyTypes.includes(enemy.type) && (enemy.x > this.x) && (enemy.x < this.game.width)
            )
            if (targetEnemy) {
                if (this.y < targetEnemy.y) this.y += 1;
                else if (this.y > targetEnemy.y) this.y -= 1;
            }
            if (this.firerate < this.maxfirerate) {
                this.firerate++;
            }
            else if (targetEnemy) {
                this.firerate = 0;
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
            }
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
        draw(context) {
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width, this.height);
            let healthWidth = this.lives / 6;
            let healthpos = this.x - (healthWidth - this.width) / 2;
            context.fillRect(healthpos, this.y - 10, healthWidth, 10);
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
            this.image = document.getElementById('enemyprojectile');
        }
        update() {
            this.x += this.speed;
            if (this.x < 0) this.markedForDeletion = true;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y)
        }

    }
    class enemyRocket {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            if (this.game.speedup === true) this.speedX = -1;
            else if (this.game.speeddown === true) this.speedX = -1;
            else this.speedX = -1;
            this.markedForDeletion = false;
            this.image = document.getElementById('enemyrocket');
            this.speedY = 0;
        }
        update() {
            this.speedX -= 2;
            this.x += this.speedX;
            if (this.x < 0 + this.width) this.markedForDeletion = true;
            if (this.game.player.y < this.y) this.y--;
            else this.y++;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
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
            this.enemybomb = [];
            this.enemyshoottime = 0;
            this.scaleRate = 1;
            this.blastposx = 0;
            this.blastposy = 0;
            this.shocked = false;
            this.trapped = false;
            this.misslefirerate = 0;
        }
        update() {
            if (!this.trapped) this.x += (this.speedX - this.game.speed);
            else (this.x += (this.speedX - this.game.speed) / 2)
            this.misslefirerate++;
            if (this.x + this.width < 0) this.markedForDeletion = true;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            if (this.shocked === true) {
                this.lives -= 0.05;
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
            }
            if (this.lives <= 0) {
                this.markedForDeletion = true;
                if (this.type === EnemyType.boss) this.game.bossbattle = false;
                this.game.evenharder += 0.001;
                this.game.downEnemy += 500;
                if (this.type === EnemyType.hivewhale) {
                    for (let i = 0; i < 5; i++) {
                        this.game.enemies.push(new Drone(this, this.x, Math.random() * this.height));
                    }
                }
            }
        }
        draw(context) {
            let yp = this.y - 30;
            const lifeBarW = 100;
            let xp = this.x + (this.width - lifeBarW) / 2;
            let frameX = this.frameX;
            if (this instanceof Boss) {
                frameX = (this.frameX / 6).toFixed(0);
            }
            context.drawImage(this.image, frameX * this.width / this.scaleRate, this.frameY * this.height / this.scaleRate,
                this.width / this.scaleRate, this.height / this.scaleRate, this.x, this.y, this.width, this.height);
            if (this.type !== EnemyType.drone) {
                context.fillStyle = '#880000';
                context.fillRect(xp, yp, lifeBarW, 10);
                context.fillStyle = '#ff0000';
                context.fillRect(xp, yp, this.lives * lifeBarW / this.fullhealth, 10);
            }
            if (this instanceof Angler2 || this instanceof Boss) {
                this.enemyprojectiles.forEach(projectile => {
                    projectile.draw(context);
                });
            }
            if (this instanceof Boss) {
                this.enemyprojectiles.forEach(projectile => {
                    projectile.draw(context);
                });
                this.enemybomb.forEach(projectile => {
                    projectile.draw(context);
                });
            }
            if (this.shocked === true) {
                context.drawImage(document.getElementById('shock'), this.x, this.y, this.width, this.height)
            }
            if (this.trapped === true) {
                context.drawImage(document.getElementById('bubble'), this.x - 10, this.y - 10, this.width + 20, this.height + 20)
            }
        }
        shoot() {
            const randomize = Math.random();
            if (!this.game.freeze) {
                if (this.enemyshoottime <= 10 && this instanceof Angler2) {
                    this.enemyprojectiles.push(new EnemyProjectile(this.game, this.x + this.blastposx, this.y + this.blastposy));
                }
                if (this.frameX === 3 && this instanceof Boss) {
                    this.enemyprojectiles.push(new EnemyProjectile(this.game, this.x + this.blastposx, this.y + this.blastposy));
                }
                if (this.misslefirerate === 40 && this instanceof Boss) {
                    this.enemybomb.push(new enemyRocket(this.game, this.x + this.blastposx, this.y + this.blastposy));
                    if (randomize < 0.20) {
                        this.game.enemies.push(new trash1(this.game, this.x, this.y))
                    } else if (randomize < 0.40) {
                        this.game.enemies.push(new trash2(this.game, this.x, this.y))
                    } else if (randomize < 0.60) {
                        this.game.enemies.push(new trash3(this.game, this.x, this.y))
                    } else if (randomize < 0.80) {
                        this.game.enemies.push(new trash5(this.game, this.x, this.y))
                    } else {
                        this.game.enemies.push(new trash4(this.game, this.x, this.y))
                    }
                    this.misslefirerate = 0;
                }
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
            this.enemybomb.forEach(projectile => {
                projectile.update();
            });
            this.enemybomb = this.enemybomb.filter(projectile => !projectile.markedForDeletion);
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
            this.lives = 200;
            this.type = EnemyType.nonlucky;
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
            this.type = EnemyType.blaster;
            this.fullhealth = this.lives;
            this.blastposx = 30;
            this.blastposy = 100;
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
            this.type = EnemyType.hivewhale;
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
            this.type = EnemyType.drone;
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
            this.type = EnemyType.heal;
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
            this.type = EnemyType.ammo;
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
            this.type = EnemyType.sheild;
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
            this.type = EnemyType.repair;
        }
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y);
        }

    }
    class Boss extends Enemy {
        constructor(game) {
            super(game);
            this.scaleRate = 1.5;
            this.width = 100 * this.scaleRate;
            this.height = 76 * this.scaleRate;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('sub');
            this.frameY = 0;
            this.lives = 100;
            this.type = EnemyType.boss;
            this.speedX = Math.random() * -1.2 - 0.2;
            this.fullhealth = this.lives;
            this.maxFrame = 6;
            this.blastposx = 24;
            this.blastposy = 29;
        }

    }

    class trash1 extends Enemy {
        constructor(game, x, y) {
            super(game);
            this.width = 50;
            this.height = 22;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('bottle1');
            this.speedX = Math.random() * -20 - 10;
            this.type = EnemyType.trash;
            this.lives = 50;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            this.y += 0.2;
            if (this.y > this.game.height) {
                this.markedForDeletion = true;
            }
        }

    }
    class trash2 extends Enemy {
        constructor(game, x, y) {
            super(game);
            this.width = 55;
            this.height = 20;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('bottle2');
            this.speedX = Math.random() * -20 - 10;
            this.type = EnemyType.trash;
            this.lives = 50;

        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            this.y += 0.2;
            if (this.y > this.game.height) {
                this.markedForDeletion = true;
            }
        }

    }
    class trash3 extends Enemy {
        constructor(game, x, y) {
            super(game);
            this.width = 55;
            this.height = 20;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('bottle3');
            this.speedX = Math.random() * -20 - 10;
            this.type = EnemyType.trash;
            this.lives = 50;

        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            this.y += 0.2;
            if (this.y > this.game.height) {
                this.markedForDeletion = true;
            }
        }

    }
    class trash4 extends Enemy {
        constructor(game, x, y) {
            super(game);
            this.width = 55;
            this.height = 20;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('bottle4');
            this.speedX = Math.random() * -20 - 10;
            this.type = EnemyType.trash;
            this.lives = 50;

        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            this.y += 0.2;
            if (this.y > this.game.height) {
                this.markedForDeletion = true;
            }
        }

    }
    class trash5 extends Enemy {
        constructor(game, x, y) {
            super(game);
            this.width = 56;
            this.height = 28;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('bottle5');
            this.speedX = Math.random() * -20 - 10;
            this.type = EnemyType.trash;
            this.lives = 50;

        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            this.y += 0.2;
            if (this.y > this.game.height) {
                this.markedForDeletion = true;
            }
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
            this.vipPassword = "16237";
            this.password = "13245";
        }
        check(password, isVip) {
            return (isVip && this.vipPassword === password)
                || (!isVip && this.password === password);
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
            this.frameX = 0;
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
            context.fillText("x" + this.game.shields, 1320, 160);
            context.drawImage(document.getElementById('fix'), 1350 - (30 + backupAmmoG) - 40, 170, 30, 30);
            context.fillText("x" + this.game.repairkits, 1320, 200);
            context.drawImage(document.getElementById('invisability'), 1350 - (30 + backupAmmoG) - 40, 210, 40, 40);
            context.fillText("x" + this.game.invisability, 1320, 235);
            context.drawImage(document.getElementById('coin'), 20, 5, 40, 40);
            context.fillText("x" + this.game.downEnemy, 65, 40);
            context.fillText('Damage: ' + this.game.damage, 20, 170);
            context.fillText('armor: ' + this.game.armor, 20, 190);
            context.fillText('HP: ', 20, 240);
            context.fillStyle = 'white';
            //maxrockettimer
            context.fillRect(20, 200, 150, 20);
            context.fillStyle = 'white';
            if (this.game.bossbattle === true) {
                let width = 55;
                let height = 90;
                let maxFrame = 5;
                let image = document.getElementById("warning");
                if (this.frameX <= maxFrame) {
                    this.frameX++;
                } else {
                    this.frameX = 0;
                }
                context.drawImage(image, this.frameX * width, 0, width, height, 700, 250, width, height);
            }
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

                }
                context.font = '150px ' + this.fontFamily;
                context.fillText(message1, this.game.width / 2, this.game.height / 1.2,
                    this.game.width - this.game.width / 9, this.game.height / 3);
                context.fillText(message2, this.game.width / 2, this.game.height / 2,
                    this.game.width - this.game.width / 9, this.game.height / 3);
            }
            context.restore();
            context.fillRect(20, 200, this.game.rocketime * 3, 20);
        }
    }
    class Game {
        constructor(width, height, vip) {
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
            this.shields = 1;
            this.forsefieldHp = 200;
            this.maxforsefieldHp = 200;
            this.forsefield = true;
            this.gameOver = false;
            this.score = 0;
            this.gameTime = 0;
            this.timeLimit = 60 * 1000 * 20; // 20 min
            this.uplimit = 30000;
            this.speed = 0;
            this.debug = false;
            if (hardnessLevel === "easy") {
                this.lives = 1000;
                this.maxlives = 1000;
                this.helpers = [new pufferfish(this, 0), new fish(this, 0), new Turtle(this, 0), new eel(this, 0), new Helper(this, 300), new Dolphin(this, 300)];
            } else if (hardnessLevel === "hard") {
                this.lives = 300;
                this.maxlives = 300;
                this.helpers = [new Turtle(this, 300)];
            } else {
                this.lives = 500;
                this.maxlives = 500;
                this.helpers = [new Turtle(this, 0), new eel(this, 0)];
            }

            this.vip = vip;
            this.damage = 2;
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
            this.projectile_speed = 5
            this.evenharder = 0.5;
            this.bossbattle = false;
            this.bossbattlewarningtime = 1000;
            this.freeze = false;
            this.smokegernade = 1;
            this.hide = false;
            this.hidetimer = 0;
            this.maxhidetimer = 1500;
            this.poison = 1;
            this.invisability = 1;
            this.commandup = false;
            this.commanddown = false;
            this.armor = 1;
            this.firerate = 100;
            this.ammoreach = 500;
            this.luck = 500;
        }
        update(deltaTime, context) {
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.stopdamage < this.staydamagestop) this.lives -= this.staydamage * 0.1;
            else {
                this.staydamage = 0
            }
            this.stopdamage++;
            if (this.hide) {
                this.hidetimer--;
            }
            if (this.hidetimer <= 0) {
                this.hide = false;
            }
            if (this.forsefieldHp <= 0) {
                this.forsefield = false;
            }
            if (this.shoottime <= this.firerate) {
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
            this.bossbattlewarningtime++;
            this.background.update();
            this.player.update(deltaTime);
            if (this.ammo === 0 && this.backupammo > 0) {
                this.ammo = 50;
                this.backupammo--;
            }

            this.enemies.forEach(enemy => {
                enemy.update();
                if (enemy.type === EnemyType.hivewhale && this.launch <= 0) {
                    this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                }

                if (this.checkCollision(this.player, enemy)) {
                    enemy.markedForDeletion = true;
                    if (badEnemyTypes.includes(enemy.type) && !this.gameOver
                        && !this.blocking) this.lives -= (3 / this.armor);
                    else if (badEnemyTypes.includes(enemy.type) && !this.gameOver
                        && this.blocking === true) this.sheildhealth -= enemy.lives;
                    if (this.lives - enemy.lives < 0) this.lives = 0;
                    if (enemy.type === EnemyType.heal && !this.gameOver) {
                        this.grabedhealing += 5;
                    }
                    if (enemy.type === EnemyType.ammo && !this.gameOver) {
                        this.backupammo += 5;
                    }
                    if (enemy.type === EnemyType.sheild && !this.gameOver) {
                        this.shields += 5;
                    }
                    if (enemy.type === EnemyType.repair && !this.gameOver) {
                        this.repairkits += 5;
                    }
                }
                if (!enemy.trapped) {
                    if (enemy instanceof Angler2 || enemy instanceof Boss) {
                        enemy.shoot();
                        enemy.enemyprojectiles.forEach(projectile => {
                            if (!this.gameOver && this.checkCollision(projectile, this.player)) {
                                if (!this.blocking && !this.forsefield) {
                                    this.lives -= (3 / this.armor);
                                    this.staydamage++;
                                    this.stopdamage = 0;
                                } else if (this.blocking && !this.forsefield) {
                                    this.sheildhealth -= 3;
                                } else if (this.forsefield) {
                                    this.forsefieldHp -= 3;
                                }
                                projectile.markedForDeletion = true;
                            }
                        });
                        enemy.enemybomb.forEach(projectile => {
                            if (!this.gameOver && this.checkCollision(projectile, this.player)) {
                                if (!this.blocking && !this.forsefield) {
                                    this.lives -= (50 / this.armor);
                                } else if (this.blocking && !this.forsefield) {
                                    this.sheildhealth -= 20;
                                } else if (this.forsefield) {
                                    this.forsefieldHp -= 10;
                                }
                                projectile.markedForDeletion = true;
                            }
                        });
                    }
                }




                if (this.player.projectiles.some((projectile) => projectile.x < enemy.x + enemy.width)) {
                    if (this.player.projectiles.some((projectile) =>
                        projectile.y < enemy.y + enemy.height && enemy.y < projectile.y + projectile.height)) {
                        if (enemy.type === EnemyType.blaster) enemy.y -= 2;
                        else if (enemy.type === EnemyType.drone) enemy.y -= 3;
                        else if (enemy.type === EnemyType.hivewhale) enemy.y -= 1;
                        else if (enemy.type === EnemyType.nonlucky) enemy.y -= 2;
                        else if (enemy.type === EnemyType.boss) enemy.y -= 3;
                    }
                }
                else {
                    this.chasePlayer(enemy);
                }

                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        if (badEnemyTypes.includes(enemy.type)) {
                            enemy.lives -= this.damage;
                            enemy.x += enemy.speedX + 50;
                            projectile.markedForDeletion = true;
                        }
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;
                            if (enemy.type === EnemyType.boss) this.bossbattle = false;
                            this.evenharder += 0.001;
                            this.downEnemy += this.luck;
                            if (enemy.type === EnemyType.hivewhale) {
                                for (let i = 0; i < 15; i++) {
                                    this.enemies.push(new Drone(this, enemy.x, Math.random() * this.height));
                                }
                            }
                        }
                    }
                })

                this.player.bombs.forEach(bomb => {
                    if (this.checkCollision(bomb, enemy)) {
                        if (badEnemyTypes.includes(enemy.type)) {
                            enemy.lives -= 20 + this.damage;
                            enemy.x += enemy.speedX + 100;
                            bomb.markedForDeletion = true;
                        }
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;
                        }
                    }
                })
            });

            this.helpers.forEach(helper => {
                helper.update();


                this.enemies.forEach(enemy => {
                    if (enemy instanceof Angler2 || enemy instanceof Boss) {
                        enemy.enemyprojectiles.forEach(projectile => {
                            if (this.checkCollision(projectile, helper)) {
                                if (helper.lives > 0) {
                                    helper.lives -= 5;
                                    projectile.markedForDeletion = true
                                } else {
                                    helper.markedForDeletion = true;
                                }
                            }
                        })
                    }
                    if (enemy instanceof Boss) {
                        enemy.enemybomb.forEach(projectile => {
                            if (this.checkCollision(projectile, helper)) {
                                if (helper.lives > 0) {
                                    helper.lives -= 50;
                                    projectile.markedForDeletion = true
                                } else {
                                    helper.markedForDeletion = true;
                                }
                            }
                        })
                    }

                    helper.projectiles.forEach(bullet => {
                        if (this.checkCollision(bullet, enemy)) {
                            if (badEnemyTypes.includes(enemy.type)) {
                                if (bullet.type === 'normal') {
                                    enemy.x += enemy.speedX + 50;
                                    enemy.lives -= 5;
                                    bullet.markedForDeletion = true;
                                }
                                if (bullet.type === 'electrify') {
                                    enemy.shocked = true;
                                    bullet.markedForDeletion = true;
                                }
                                if (bullet.type === 'bubble') {
                                    enemy.trapped = true;
                                    bullet.markedForDeletion = true;
                                }
                                if (bullet.type === 'spike') {
                                    enemy.lives -= 5;
                                    bullet.x = enemy.x + enemy.width;
                                }
                            }
                        }
                    })
                })
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
            this.helpers = this.helpers.filter(helper => !helper.markedForDeletion)
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
            this.helpers.forEach(helper => {
                helper.draw(context);
            });
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
            if (randomize < 0.1) this.enemies.push(new Angler1(this));
            else if (randomize < 0.3) this.enemies.push(new Angler2(this));
            else if (randomize < 0.5) this.enemies.push(new HiveWhale(this));
            else if (randomize < 0.6) this.enemies.push(new Healing(this));
            else if (randomize < 0.7) this.enemies.push(new Ammo(this));
            else if (randomize < 0.8) this.enemies.push(new UltraSheild(this));
            else if (randomize < 0.9) this.enemies.push(new Fix(this));
            else if (randomize < 0.93) {
                this.enemies.push(new Boss(this));
                this.bossbattle = true;
                this.bossbattlewarningtime = 0;
            } else if (randomize < 0.94) {
                this.enemies.push(new trash1(this));
            } else if (randomize < 0.95) {
                this.enemies.push(new trash2(this));
            } else if (randomize < 0.96) {
                this.enemies.push(new trash3(this));
            } else if (randomize < 0.97) {
                this.enemies.push(new trash4(this));
            } else if (randomize < 0.98) {
                this.enemies.push(new trash5(this));
            }
        }
        checkCollision(rect1, rect2) {
            return rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y;
        }
        chasePlayer(enemy) {
            // chase player
            if (this.lives > 0 && enemy.x < this.width && !this.hide) {
                // player still alive and enemy is visible
                if (enemy.y + enemy.blastposy > this.player.y + this.player.height) {
                    // enemy is lower, so it chase up
                    if (enemy.type === EnemyType.boss) enemy.y -= 7;
                    else if (enemy.type === EnemyType.drone) enemy.y -= 5;
                    else if (enemy.type === EnemyType.blaster) enemy.y -= 3;
                    else if (enemy.type === EnemyType.nonlucky) enemy.y -= 2;
                    else if (enemy.type === EnemyType.hivewhale) enemy.y -= 1;
                } else if (enemy.y + enemy.blastposy < this.player.y) {
                    // enemy is higher, so it chase down
                    if (enemy.type === EnemyType.boss) enemy.y += 7;
                    else if (enemy.type === EnemyType.drone) enemy.y += 5;
                    else if (enemy.type === EnemyType.blaster) enemy.y += 3;
                    else if (enemy.type === EnemyType.nonlucky) enemy.y += 2;
                    else if (enemy.type === EnemyType.hivewhale) enemy.y += 1;
                }
            }
        }
    }
    function mySignIn() {
        var password = document.getElementById("pass").value;
        const radioButtons = document.querySelectorAll('input[name="hardness_level"]');
        const vips = document.querySelectorAll('input[name="veryimportantperson"]');
        let isVip;

        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                hardnessLevel = radioButton.value;
                break;
            }
        }
        for (const friend of vips) {
            if (friend.checked) {
                hardnessLevel = friend.value;
                isVip = true;
                break;
            }
        }

        var isGranted = security.check(password, isVip);
        if (isGranted) {
            game = new Game(canvas.width, canvas.height, isVip);
            gameDiv.style.visibility = "visible";
            securityDiv.style.visibility = "hidden";
            shopDiv.style.visibility = "hidden";
            body.style.overflow = 'hidden';

            let lastTime = 0;
            let red = 0;
            let green = 150;
            function animate(timeStamp) {
                const deltaTime = timeStamp - lastTime;
                lastTime = timeStamp;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (!game.pause) {
                    game.update(deltaTime, ctx);
                }
                game.draw(ctx);
                if (red === 255) {
                    red = 0;
                } else {
                    red++;
                }
                if (green === 255) {
                    green = 0;
                } else {
                    green++;
                }
                ctx.fillStyle = "rgb(0, green, 0)";
                ctx.fill();
                requestAnimationFrame(animate);
            }
            animate(0);
        } else {
            gameDiv.style.visibility = "hidden";
            securityDiv.style.visibility = "visible";
            shopDiv.style.visibility = "hidden";
            body.style.overflow = 'hidden';
        }
    }


    function goselling() {
        gameDiv.style.visibility = "hidden";
        shopDiv.style.visibility = "hidden";
        securityDiv.style.visibility = "hidden";
        marketDiv.style.visibility = "visible";
        body.style.overflow = 'visible';
        game.pause = true;
        updateBalance();
    }
    sellButton.onclick = function () {
        goselling();
    }

    function goshoping() {
        gameDiv.style.visibility = "hidden";
        shopDiv.style.visibility = "visible";
        securityDiv.style.visibility = "hidden";
        marketDiv.style.visibility = "hidden";
        body.style.overflow = 'visible';
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
        body.style.overflow = 'hidden';
        marketDiv.style.visibility = "hidden";
        game.pause = false;

    }
    btnBuymaxforsefieldHp.onclick = function () {
        if (game.downEnemy >= 1000) {
            game.downEnemy -= 1000;
            game.maxforsefieldHp += 5;
        }
        updateBalance();
    }
    btnBuyammo.onclick = function () {
        if (game.downEnemy >= 2000) {
            game.downEnemy -= 2000;
            game.backupammo += 5;
        }
        updateBalance();
    }
    btnBuyfirerate.onclick = function () {
        if (game.downEnemy >= 3000 && game.firerate > 5) {
            game.downEnemy -= 3000;
            game.firerate -= 5;
        }
        updateBalance();
    }
    btnBuyultrasheild.onclick = function () {
        if (game.downEnemy >= 3000) {
            game.downEnemy -= 3000;
            game.shields += 5;
        }
        updateBalance();
    }
    btnBuygrabedhealing.onclick = function () {
        if (game.downEnemy >= 2000) {
            game.downEnemy -= 2000;
            game.grabedhealing += 5;
        }
        updateBalance();
    }
    btnBuymissile.onclick = function () {
        if (game.downEnemy >= 1000) {
            game.downEnemy -= 1000;
            game.rocketammo += 5;
        }
        updateBalance();
    }
    btnBuyFix.onclick = function () {
        if (game.downEnemy >= 500) {
            game.downEnemy -= 500;
            game.repairkits += 5;
        }
        updateBalance();
    }
    btnBuyspeed.onclick = function () {
        if (game.downEnemy >= 500) {
            game.downEnemy -= 500;
            game.projectile_speed += 1;
        }
        updateBalance();
    }
    btnBuydamage.onclick = function () {
        if (game.downEnemy >= 500) {
            game.downEnemy -= 500;
            game.damage += 1;
        }
        updateBalance();
    }
    btnBuybackup.onclick = function () {
        if (game.downEnemy >= 3000) {
            game.downEnemy -= 3000;
            game.helpers.push(new Helper(game, Math.random() * 400));
        }
        updateBalance();
    }
    btnBuySmokeGernade.onclick = function () {
        if (game.downEnemy >= 800) {
            game.downEnemy -= 800;
            game.smokegernade++;
        }
        updateBalance();
    }
    btnBuyArmor.onclick = function () {
        if (game.downEnemy >= 1000) {
            game.downEnemy -= 1000;
            game.armor++;
        }
        updateBalance();
    }
    btnBuyDolphin.onclick = function () {
        if (game.downEnemy >= 5000) {
            game.downEnemy -= 5000;
            game.helpers.push(new Dolphin(game, Math.random() * 400));
        }
        updateBalance();
    }
    btnBuyeel.onclick = function () {
        if (game.downEnemy >= 5000) {
            game.downEnemy -= 5000;
            game.helpers.push(new eel(game, Math.random() * 400));
        }
        updateBalance();
    }
    btnBuyTurtle.onclick = function () {
        if (game.downEnemy >= 5000) {
            game.downEnemy -= 5000;
            game.helpers.push(new Turtle(game, Math.random() * 400));
        }
        updateBalance();
    }
    btnBuyFish.onclick = function () {
        if (game.downEnemy >= 20000) {
            game.downEnemy -= 20000;
            game.helpers.push(new fish(game, Math.random() * 400));
        }
        updateBalance();
    }
    btnBuypufferfish.onclick = function () {
        if (game.downEnemy >= 15000) {
            game.downEnemy -= 15000;
            game.helpers.push(new pufferfish(game, Math.random() * 400));
        }
        updateBalance();
    }
    btnBuyammoreach.onclick = function () {
        if (game.downEnemy >= 1000) {
            game.downEnemy -= 1000;
            game.ammoreach += 10;
        }
        updateBalance();
    }
    // sell
    marketResumeGame.onclick = function () {
        gameDiv.style.visibility = "visible";
        securityDiv.style.visibility = "hidden";
        shopDiv.style.visibility = "hidden";
        body.style.overflow = 'hidden';
        marketDiv.style.visibility = "hidden";
        game.pause = false;

    }

    btnSellammo.onclick = function () {
        if (game.backupammo >= 5) {
            game.downEnemy += 2000;
            game.backupammo -= 5;
        }
        marketupdateBalance();
    }
    btnSellultrasheild.onclick = function () {
        if (game.shields >= 5) {
            game.downEnemy += 3000;
            game.shields -= 5;
        }
        marketupdateBalance();
    }
    btnSellgrabedhealing.onclick = function () {
        if (game.grabedhealing >= 5) {
            game.downEnemy += 2000;
            game.grabedhealing -= 5;
        }
        marketupdateBalance();
    }
    btnSellmissile.onclick = function () {
        if (game.rocketammo >= 5) {
            game.downEnemy += 1000;
            game.rocketammo -= 5;
        }
        marketupdateBalance();
    }
    btnSellFix.onclick = function () {
        if (game.repairkits >= 5) {
            game.downEnemy += 500;
            game.repairkits -= 5;
        }
        marketupdateBalance();
    }


    btnSellbackup.onclick = function () {
        if (game.helpers.length > 0) {
            game.downEnemy += 10000;
            let helperIndex = game.helpers.findIndex((helper) =>
                helper.type === 'seahorse'
            )
            game.helpers.splice(helperIndex, 1)
        }
        marketupdateBalance();
    }
    btnSellSmokeGernade.onclick = function () {
        if (game.smokegernade > 0) {
            game.downEnemy += 800;
            game.smokegernade--;
        }
        marketupdateBalance();
    }
    btnSellArmor.onclick = function () {
        if (game.armor > 0) {
            game.downEnemy += 1000;
            game.armor--;
        }
        marketupdateBalance();
    }
    btnSellDolphin.onclick = function () {
        if (game.helpers > 0) {
            game.downEnemy += 5000;
            let dolphinIndex = game.helpers.findIndex((helper) =>
                helper.type === 'dolphin'
            )
            game.helpers.splice(dolphinIndex, 1)
        }
        marketupdateBalance();
    }


    function updateBalance() {
        let balance = document.getElementById('howRich');
        balance.innerText = 'balance: ' + game.downEnemy;
    }
    function marketupdateBalance() {
        let marketbalance = document.getElementById('markethowRich');
        marketbalance.innerText = 'balance: ' + game.downEnemy;
    }

    const security = new Security();
    submit.onclick = function () { mySignIn() };
});