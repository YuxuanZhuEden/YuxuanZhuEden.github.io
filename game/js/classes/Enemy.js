//player
class Enemy {
    constructor(x, y) {
        this.frame = 0
        this.directions1 = "left"
        this.directions2 = "right"
        this.direction = this.directions1
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
    }
    draw() {
        c.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
        c.fillStyle = 'red'
        c.fillRect(this.position.x + 50, this.position.y + 10, this.HP, 5)

    }
    update() {
        if (player.position.x > this.position.x) this.direction = this.directions1
        if (player.position.x < this.position.x) this.direction = this.directions2
        if (this.direction === this.directions1) {
            if (this.mode === this.mode1) {
                this.image = document.getElementById('Idle')
            } else if (this.mode === this.mode4) {
                this.image = document.getElementById('Shoot')
                if (this.frame === 2 && this.changeframe === 0) {
                    projectiles.push(new Projectile(this.position.x + 86, this.position.y + 76, bulletspeed, "hostile"))
                }
            }
        } else if (this.direction === this.directions2) {
            if (this.mode === this.mode1) {
                this.image = document.getElementById('Idleleft')
            } else if (this.mode === this.mode4) {
                this.image = document.getElementById('Shootleft')
                if (this.frame === 1 && this.changeframe === 0) {
                    projectiles.push(new Projectile(this.position.x + 86, this.position.y + 76, -bulletspeed, "hostile"))
                }
            }
        }
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
        if (this.position.y + 76 > player.position.y && this.position.y + 76 < player.position.y + player.height) {
            this.mode = this.mode4
            this.maxframe = 3
        } else {
            this.mode = this.mode1
            this.maxframe = 6
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height >= canvas.height && this.velocity.y > 0) {
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height;
        } else if (this.position.y + this.height === canvas.height && this.velocity.y === 0) {
            this.position.y = canvas.height - this.height;
        } else {
            this.velocity.y += this.gravity
        }
        this.sides.bottom = this.position.y + this.height;
        // console.log(this.mode)
        if (this.HP <= 0) {
            this.markedForDeletion = true
        }
    }

}