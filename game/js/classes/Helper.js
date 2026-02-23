//Helper
class Helper {
    constructor(x, y, base) {
        this.frame = 0
        this.directions1 = "left"
        this.directions2 = "right"
        this.jumped = 2
        this.maxjump = 2
        this.walkspeed = 2.5
        this.sprintspeed = 7.5
        this.jumpheight = -17.5
        this.isjumping = false
        this.direction = this.directions1
        this.sprintrange = 200
        this.position = {
            x: x,
            y: y,
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
        this.maxHP = 100
        this.HP = this.maxHP
        this.healspeed = 0.1
        this.mode1 = "idle"
        this.mode2 = "walk"
        this.mode3 = "sprint"
        this.mode4 = "shoot"
        this.mode5 = "shoot2"
        this.mode = this.mode1
        this.changeframe = 0
        this.maxchangeframe = 5 - 1
        this.image = document.getElementById('Idle')
        this.markedForDeletion = false
        this.gunpoint = this.position.y + 76
        this.onCrate = false;
        this.shootchance = 0.1
        this.walkchance = 0.1
        this.sprintchance = 0.1
        this.jumpchance = 0.75
        this.runaway = false
        this.runawaydistance = 2000 + Math.random() * 500
        this.amountofcrates = 10
        this.ammoamount = 50
        this.cratecooldown = 0
        this.finishcooldown = 0
        this.maxcooldown = 50
        // this.target = Math.ceil(Math.random() * (enemies.length - 1))
        this.targetnumber = 0
        this.target = enemies[this.targetnumber]
        this.base = base
    }
    draw() {
        c.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
        c.fillStyle = 'black'
        c.fillRect(this.position.x + 13, this.position.y + 9, this.maxHP + 2, 7)
        c.fillStyle = 'pink'
        c.fillRect(this.position.x + 14, this.position.y + 10, this.maxHP, 5)
        c.fillStyle = 'green'
        c.fillRect(this.position.x + 14, this.position.y + 10, this.HP, 5)
    }
    update() {
        if (this.ammoamount === 0 && ammos.length > 0) {
            this.target = ammos[0]
        } else if (enemies.length > 0) {
            this.target = enemies[this.targetnumber]
        } else if (flag1.mode === "hostile") {
            this.target = flag1
        } else if (flag2.mode === "hostile") {
            this.target = flag2
        } else {
            this.mode = this.mode1
            this.velocity.x = 0
        }
        if (this.ammoamount > 100) {
            this.ammoamount = 100
        }
        if (this.cratecooldown !== this.finishcooldown) {
            this.cratecooldown--
        }
        if (this.HP < this.maxHP && this.markedForDeletion === false) {
            this.HP += this.healspeed
        }
        this.isjumping = false
        this.onCrate = false
        this.gunpoint = this.position.y + 76
        //run away
        if (this.HP <= this.maxHP/2) {
            this.runaway = true
        } else {
            this.runaway = false
        }
        //jumping on crates
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
        //switch image and shooting
        if (this.direction === this.directions1) {
            if (this.mode === this.mode1) {
                this.image = document.getElementById('Idle')
                this.maxframe = 6
            } else if(this.mode === this.mode2) {
                this.image = document.getElementById('Walk')
                this.maxframe = 7
            } else if (this.mode === this.mode3) {
                this.image = document.getElementById('Run')
                this.maxframe = 5
            } else if (this.mode === this.mode4) {
                this.image = document.getElementById('Shoot')
                this.maxframe = 3
                if (this.frame === 2 && this.changeframe === 0) {
                    projectiles.push(new Projectile(this.position.x + 86, this.position.y + 76, bulletspeed, "friendly"))
                    this.ammoamount --
                }
            } 
        } else if (this.direction === this.directions2) {
            if (this.mode === this.mode1) {
                this.maxframe = 6
                this.image = document.getElementById('Idleleft')
            } else if(this.mode === this.mode2) {
                this.maxframe = 7
                this.image = document.getElementById('Walkleft')
            } else if (this.mode === this.mode3) {
                this.maxframe = 5
                this.image = document.getElementById('Runleft')     
            } else if (this.mode === this.mode4) {
                this.image = document.getElementById('Shootleft')
                this.maxframe = 3
                if (this.frame === 1 && this.changeframe === 0) {
                    projectiles.push(new Projectile(this.position.x + 86, this.position.y + 76, -bulletspeed, "friendly"))
                    this.ammoamount --
                }
            }
        }
        //change frame
        if (this.changeframe >= this.maxchangeframe) {
            if (this.frame < this.maxframe) {
                this.frame++
            } else {
                this.frame = 0
            }
            this.changeframe = 0
        } else {
            this.changeframe++
        }
        //place crates to block
        if (this.amountofcrates > 1 && this.cratecooldown === this.finishcooldown) {
            projectiles.forEach(projectile => {
                if (projectile.position.y > this.position.y && projectile.position.y < this.position.y + this.height && projectile.type === "hostile") {
                    if (this.direction === "right") {
                        crates.push(new Crate(this.position.x - 50, this.sides.bottom - 50, "friendly"));
                        crates.push(new Crate(this.position.x - 50, this.sides.bottom - 100, "friendly"));
                    } else if (this.direction === "left") {
                        crates.push(new Crate(this.position.x + this.width, this.sides.bottom - 50, "friendly"));
                        crates.push(new Crate(this.position.x + this.width, this.sides.bottom - 100, "friendly"));
                    }
                    this.cratecooldown = this.maxcooldown
                    this.amountofcrates -= 2
                }
            })
        }
        //place crates to climb
        if (this.amountofcrates > 0 && this.cratecooldown === this.finishcooldown) {
            if (this.jumped === 0) {
                crates.push(new Crate(this.position.x, this.sides.bottom, "friendly"));
                this.velocity.y = -10
                this.cratecooldown = this.maxcooldown
                this.amountofcrates--
            }
        }
        //runaway
        if (this.target !== flag1 && this.target !== flag2 && enemies.length > 0 && this.runaway === true && this.position.x + this.runawaydistance > this.target.position.x && this.position.x - this.runawaydistance < this.target.position.x) {
            if (this.position.x < this.target.position.x) {
                this.direction = this.directions2
                this.velocity.x = -this.sprintspeed
                this.mode = this.mode3
            } else if (this.position.x > this.target.position.x) {
                this.direction = this.directions1
                this.velocity.x = this.sprintspeed
                this.mode = this.mode3
            }
        } 
        //shooting
        else if (this.target !== flag1 && this.target !== flag2 && this.ammoamount > 0 && this.ammoamount > 0 && enemies.length > 0 && this.gunpoint > this.target.position.y && this.gunpoint < this.target.position.y + this.target.height && Math.random() <= this.shootchance) {
            this.mode = this.mode4
            this.velocity.x = 0
            if (this.target.position.x > this.position.x) {
                this.direction = this.directions1
            } else if (this.target.position.x < this.position.x ) {
                this.direction = this.directions2
            }
            this.maxframe = 3
        } 
        //running
        else if (enemies.length > 0 && this.target.position.x - this.sprintrange > this.position.x && Math.random() <= this.sprintchance && this.runaway === false) {
            this.direction = this.directions1
            this.velocity.x = this.sprintspeed
            this.mode = this.mode3
        } else if (enemies.length > 0 && this.target.position.x + this.sprintrange < this.position.x && Math.random() <= this.sprintchance && this.runaway === false) {
            this.direction = this.directions2
            this.velocity.x = -this.sprintspeed
            this.mode = this.mode3
        } 
        //walking
        else if (enemies.length > 0 && this.target.position.x > this.position.x && Math.random() <= this.walkchance && this.runaway === false) {
            this.direction = this.directions1
            this.velocity.x = this.walkspeed
            this.mode = this.mode2
        } else if (enemies.length > 0 && this.target.position.x < this.position.x && Math.random() <= this.walkchance && this.runaway === false) {
            this.direction = this.directions2
            this.velocity.x = -this.walkspeed
            this.mode = this.mode2
        }
        
        // jumping
        if ((enemies.length > 0 && this.gunpoint > this.target.position.y + this.target.height) && this.jumped > 0 && Math.abs(this.velocity.y) <= 1 && Math.random() <= this.jumpchance && this.runaway === false) {
            this.velocity.y = this.jumpheight
            this.isjumping = true
            this.jumped--
        }

        //landing
        if (this.position.y + this.height >= canvas.height && this.isjumping === false) {
            this.position.y = canvas.height - this.height;
            this.velocity.y = 0;
            this.jumped = this.maxjump
        } else if (this.onCrate && this.isjumping === false) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += this.gravity
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.sides.bottom = this.position.y + this.height;
        //delete when dead
        if (this.HP <= 0) {
            this.markedForDeletion = true
            while (this.ammoamount >= 10) {
                this.ammoamount -= 10
                ammos.push(new Ammo(this.position.x - 64 + Math.random() * 256, this.position.y));
            }
        }
        if (this.target > enemies.length) {
            // this.target = Math.ceil(Math.random() * (enemies.length - 1))
            console.log("6767685785857868")
        }
        
    }

}