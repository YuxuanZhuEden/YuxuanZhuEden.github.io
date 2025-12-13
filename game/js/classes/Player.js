//player
class Player {
    constructor() {
        this.sprintspeed = 10
        this.walkspeed = 4
        this.onCrate = false;
        this.frame = 0
        this.directions1 = "left"
        this.directions2 = "right"
        this.direction = this.directions1
        // this.maxreload = 50
        // this.reload = 0
        this.jumped = 0
        this.maxjump = 2
        this.jumpheight = -20
        this.isjumping = false
        this.position = {
            x: 1300,
            y: 100,
        }

        this.velocity = {
            x: 0,
            y: 0,
        }
        this.width = 128;
        this.height = 128;
        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1
        this.HP = 1000
        this.maxHP = 1000
        this.healspeed = 1
        this.mode = "Idle"
        this.changeframe = 0
        this.maxchangeframe = 5 - 1
    }
    draw() {
        c.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
        c.fillStyle = 'red'
        c.fillRect(60, 5, this.HP, 25)
        c.font = "30px serif"
        c.fillText("HP", 10, 30)

    }
    update() {
        if (hotbar.item === hotbar.item1) {
            if (this.mode === 'Shoot' && this.frame === 2 && this.changeframe === 0) {
                projectiles.push(new Projectile(this.position.x + 86, this.position.y + 76, bulletspeed, "friendly"))
                // this.reload = 0
            } else if (this.mode === 'Shootleft' && this.frame === 1 && this.changeframe === 0) {
                projectiles.push(new Projectile(this.position.x + 40, this.position.y + 76, -bulletspeed, "friendly"))
                // this.reload = 0
            } else if (this.mode === 'Shoot2' && this.frame === 3 && this.changeframe === 0) {
                projectiles.push(new Projectile(this.position.x + 90, this.position.y + 87, bulletspeed, "friendly"))
                // this.reload = 0
            } else if (this.mode === 'Shoot2left' && this.frame === 2 && this.changeframe === 0) {
                projectiles.push(new Projectile(this.position.x + 36, this.position.y + 87, -bulletspeed, "friendly"))
                // this.reload = 0
            }
        } else if (hotbar.crateamount > 0 && keys.space.pressed === true && hotbar.item === hotbar.item2 && this.frame === 2 && this.changeframe === 0) {
            if (this.direction === this.directions1) {
                crates.push(new Crate(this.position.x - 50, this.sides.bottom - 50));
            } else if (this.direction === this.directions2) {
                crates.push(new Crate(this.position.x + this.width, this.position.y + this.height - 50));
            }
            hotbar.crateamount--
        }
        if (this.HP < this.maxHP) {
            this.HP += this.healspeed
        }
        if (this.direction === this.directions2) {
            this.mode1 = "Idle";
            this.mode2 = "Shoot";
            this.mode3 = "Walk";
            this.mode4 = "Run";
            this.mode5 = "Shoot2";
            this.mode6 = "Kneel";
            this.mode7 = "Throw";
            if (this.mode === this.mode2 && hotbar.item === hotbar.item1) {
                this.maxframe = 3
                this.image = document.getElementById('Shoot')
            } else if (this.mode === this.mode3) {
                this.maxframe = 7
                this.image = document.getElementById('Walk')
            } else if (this.mode === this.mode4) {
                this.maxframe = 5
                this.image = document.getElementById('Run')
            } else if (this.mode === this.mode5 && hotbar.item === hotbar.item1) {
                this.maxframe = 3
                this.image = document.getElementById('Shoot2')
            } else if (this.mode === this.mode6 && hotbar.item === hotbar.item1) {
                this.maxframe = 0
                this.image = document.getElementById('Kneel')
            } else {
                this.maxframe = 6
                this.image = document.getElementById('Idle')
            }
        }
        if (this.direction === this.directions1) {
            this.mode1 = "Idleleft";
            this.mode2 = "Shootleft";
            this.mode3 = "Walkleft";
            this.mode4 = "Runleft";
            this.mode5 = "Shoot2left";
            this.mode6 = "Kneelleft";
            if (this.mode === this.mode2 && hotbar.item === hotbar.item1) {
                this.maxframe = 3
                this.image = document.getElementById('Shootleft')
            } else if (this.mode === this.mode3) {
                this.maxframe = 7
                this.image = document.getElementById('Walkleft')
            } else if (this.mode === this.mode4) {
                this.maxframe = 5
                this.image = document.getElementById('Runleft')
            } else if (this.mode === this.mode5 && hotbar.item === hotbar.item1) {
                this.maxframe = 3
                this.image = document.getElementById('Shoot2left')
            } else if (this.mode === this.mode6 && hotbar.item === hotbar.item1) {
                this.maxframe = 0
                this.image = document.getElementById('Kneelleft')
            } else {
                this.maxframe = 6
                this.image = document.getElementById('Idleleft')
            }
        }
        if (this.mode === this.mode2 || this.mode === this.mode5) this.velocity.x = 0
        if (this.changeframe >= this.maxchangeframe) {
            if (this.direction === this.directions2) {
                if (this.frame < this.maxframe) {
                    this.frame++
                } else {
                    this.frame = 0
                }
            } else if (this.direction === this.directions1) {
                if (this.frame > 0) {
                    this.frame--
                } else {
                    this.frame = this.maxframe
                }
            }
            this.changeframe = 0
        } else {
            this.changeframe++
        }        // if (this.reload < this.maxreload) {
        //     this.reload++
        // }
        this.onCrate = false; 
        crates.forEach(crate => {
            if (crate.position.x < this.position.x + this.width &&
                crate.position.x + crate.width > this.position.x &&
                crate.position.y <= this.position.y + this.height + 10 && 
                crate.position.y >= this.position.y + this.height - 10 && this.isjumping === false) {
                this.position.y = crate.position.y - this.height
                this.onCrate = true;
                this.jumped = this.maxjump
            }
        })
        this.isjumping = false
        if (keys.uparrow.pressed === true && this.velocity.y === 0 && this.jumped > 0) {
            this.velocity.y = this.jumpheight 
            this.isjumping = true
            this.jumped--
        }
        if (this.position.y + this.height >= canvas.height && this.velocity.y > 0) {
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height;
        } else if (this.position.y + this.height === canvas.height && this.velocity.y === 0) {
            // on floor
            this.position.y = canvas.height - this.height;
            this.jumped = this.maxjump
        } else if (this.onCrate && this.isjumping === false) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += this.gravity
        }
        this.sides.bottom = this.position.y + this.height;
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        // console.log(this.mode)

    }

}

