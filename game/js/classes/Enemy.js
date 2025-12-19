//player
class Enemy {
    constructor(x, y) {
        this.frame = 0
        this.directions1 = "left"
        this.directions2 = "right"
        this.jumped = 0
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
        this.HP = 100
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

    }
    draw() {
        c.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
        c.fillStyle = 'red'
        c.fillRect(this.position.x + 50, this.position.y + 10, this.HP, 5)

    }
    update() {
        this.isjumping = false
        this.onCrate = false
        this.gunpoint = this.position.y + 76
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
        //mode changeing
        if (this.gunpoint > player.position.y && this.gunpoint < player.position.y + player.height && Math.random() <= this.shootchance && player.mode !== player.mode7 && player.mode !== player.mode8) {
            this.mode = this.mode4
            this.velocity.x = 0
            this.maxframe = 3
        } else if (player.position.x - this.sprintrange > this.position.x && Math.random() <= this.sprintchance) {
            this.direction = this.directions1
            this.velocity.x = this.sprintspeed
            this.mode = this.mode3
        } else if (player.position.x + this.sprintrange < this.position.x && Math.random() <= this.sprintchance) {
            this.direction = this.directions2
            this.velocity.x = -this.sprintspeed
            this.mode = this.mode3
        } else if (player.position.x > this.position.x && Math.random() <= this.walkchance) {
            this.direction = this.directions1
            this.velocity.x = this.walkspeed
            this.mode = this.mode2
        } else if (player.position.x < this.position.x && Math.random() <= this.walkchance) {
            this.direction = this.directions2
            this.velocity.x = -this.walkspeed
            this.mode = this.mode2
        } 
        // else {
        //     this.velocity.x = 0
        //     this.mode = this.mode1
        //     this.maxframe = 6
        // }
        
        // jumping
        if ((this.gunpoint > player.position.y + player.height) && this.jumped > 0 && Math.abs(this.velocity.y) <= 1 && Math.random() <= this.jumpchance) {
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
            hotbar.crateamount += 1
        }
        
    }

}