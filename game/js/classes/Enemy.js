//Enemy
class Enemy {
    constructor(x, y) {
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
        this.maxchangeframe = 5
        this.image = document.getElementById('Idle')
        this.markedForDeletion = false
        this.gunpoint = this.position.y + 76
        this.onCrate = false;
        this.shootchance = 0.1
        this.walkchance = 0.1
        this.sprintchance = 0.1
        this.jumpchance = 0.75
        this.runaway = false
        this.runawaydistance = 750 + Math.random() * 200
        this.amountofcrates = 10
        this.cratecooldown = 0
        this.finishcooldown = 0
        this.maxcooldown = 20
        this.ammoamount = 25
    }
    draw() {
        c.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
        c.fillStyle = 'black'
        c.fillRect(this.position.x + 13, this.position.y + 9, this.maxHP + 2, 7)
        c.fillStyle = 'pink'
        c.fillRect(this.position.x + 14, this.position.y + 10, this.maxHP, 5)
        c.fillStyle = 'red'
        c.fillRect(this.position.x + 14, this.position.y + 10, this.HP, 5)
    }
    update() {
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
            } else if(this.mode === this.mode2) {
                this.image = document.getElementById('Walk')
            } else if (this.mode === this.mode3) {
                this.image = document.getElementById('Run')     
            } else if (this.mode === this.mode4) {
                this.image = document.getElementById('Shoot')
                if (this.frame === 2 && this.changeframe === 0) {
                    projectiles.push(new Projectile(this.position.x + 86, this.position.y + 76, bulletspeed, "hostile"))
                    this.ammoamount --
                }
            } 
        } else if (this.direction === this.directions2) {
            if (this.mode === this.mode1) {
                this.image = document.getElementById('Idleleft')
            } else if(this.mode === this.mode2) {
                this.image = document.getElementById('Walkleft')
            } else if (this.mode === this.mode3) {
                this.image = document.getElementById('Runleft')     
            } else if (this.mode === this.mode4) {
                this.image = document.getElementById('Shootleft')
                if (this.frame === 1 && this.changeframe === 0) {
                    projectiles.push(new Projectile(this.position.x + 86, this.position.y + 76, -bulletspeed, "hostile"))
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
                if (projectile.position.y > this.position.y && projectile.position.y < this.position.y + this.height && projectile.type === "friendly") {
                    if (this.direction === "right") {
                        crates.push(new Crate(this.position.x - 50, this.sides.bottom - 50, "hostile"));
                        crates.push(new Crate(this.position.x - 50, this.sides.bottom - 100, "hostile"));
                    } else if (this.direction === "left") {
                        crates.push(new Crate(this.position.x + this.width, this.sides.bottom - 50, "hostile"));
                        crates.push(new Crate(this.position.x + this.width, this.sides.bottom - 100, "hostile"));
                    }
                    this.cratecooldown = this.maxcooldown
                    this.amountofcrates -= 2
                }
            })
        }
        //place crates to climb
        if (this.amountofcrates > 0 && this.cratecooldown === this.finishcooldown) {
            if (this.jumped === 0) {
                crates.push(new Crate(this.position.x, this.sides.bottom, "hostile"));
                this.cratecooldown = this.maxcooldown
                this.amountofcrates--
            }
        }
        //runaway
        if (this.runaway === true && this.position.x + this.runawaydistance > player.position.x && this.position.x - this.runawaydistance < player.position.x) {
            if (this.position.x < player.position.x) {
                this.direction = this.directions2
                this.velocity.x = -this.sprintspeed
                this.mode = this.mode3
            } else if (this.position.x > player.position.x) {
                this.direction = this.directions1
                this.velocity.x = this.sprintspeed
                this.mode = this.mode3
            }
        } 
        //shooting
        else if (this.gunpoint > player.position.y && this.gunpoint < player.position.y + player.height && Math.random() <= this.shootchance && player.mode !== player.mode7 && player.mode !== player.mode8 && this.ammoamount > 0) {
            this.mode = this.mode4
            this.velocity.x = 0
            if (player.position.x > this.position.x) {
                this.direction = this.directions1
            } else if (player.position.x < this.position.x ) {
                this.direction = this.directions2
            }
            this.maxframe = 3
        } 
        //running
        else if (player.position.x - this.sprintrange > this.position.x && Math.random() <= this.sprintchance && this.runaway === false) {
            this.direction = this.directions1
            this.velocity.x = this.sprintspeed
            this.mode = this.mode3
        } else if (player.position.x + this.sprintrange < this.position.x && Math.random() <= this.sprintchance && this.runaway === false) {
            this.direction = this.directions2
            this.velocity.x = -this.sprintspeed
            this.mode = this.mode3
        } 
        //walking
        else if (player.position.x > this.position.x && Math.random() <= this.walkchance && this.runaway === false) {
            this.direction = this.directions1
            this.velocity.x = this.walkspeed
            this.mode = this.mode2
        } else if (player.position.x < this.position.x && Math.random() <= this.walkchance && this.runaway === false) {
            this.direction = this.directions2
            this.velocity.x = -this.walkspeed
            this.mode = this.mode2
        }
        
        // jumping
        if ((this.gunpoint > player.position.y + player.height) && this.jumped > 0 && Math.abs(this.velocity.y) <= 1 && Math.random() <= this.jumpchance && this.runaway === false) {
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
            while (this.ammoamount > 0) {
                this.ammoamount--
                ammos.push(new Ammo(this.position.x - 64 + Math.random() * 256, this.position.y));
            }
        }
        
    }

}