//player
class Helper {
    constructor() {
        this.frame = 0
        this.direction = player.direction
        this.number = Math.random() * 1000
        this.position = {
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
        this.mode = player.mode
        this.changeframe = 0
        this.maxchangeframe = 5 - 1
        this.image = document.getElementById('Idle')
        this.markedForDeletion = false
    }
    draw() {
        c.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
        c.fillStyle = 'red'
        c.fillRect(this.position.x + 50, this.position.y - 10, this.HP, 5)

    }
    update() {
        this.direction = player.direction
        this.mode = player.mode
        if (this.direction === "right") {
            this.position.x = player.position.x - 50 - this.number
        } else if (this.direction === "left") {
            this.position.x = player.position.x + 50 + this.number
        }
        this.position.y = player.position.y
        if (this.mode === 'Shoot' && this.frame === 2 && this.changeframe === 0) {
            projectiles.push(new Projectile(this.position.x + 86, this.position.y + 76, 25, "friendly"))
        } else if (this.mode === 'Shootleft' && this.frame === 1 && this.changeframe === 0) {
            projectiles.push(new Projectile(this.position.x + 40, this.position.y + 76, -25, "friendly"))
        } else if (this.mode === 'Shoot2' && this.frame === 3 && this.changeframe === 0) {
            projectiles.push(new Projectile(this.position.x + 90, this.position.y + 87, 25, "friendly"))
        } else if (this.mode === 'Shoot2left' && this.frame === 2 && this.changeframe === 0) {
            projectiles.push(new Projectile(this.position.x + 36, this.position.y + 87, -25, "friendly"))
        }
        if (this.direction === "right") {
            if (this.mode === "Idle") {
                this.maxframe = 6
                this.image = document.getElementById('Idle')
            } else if (this.mode === "Shoot") {
                this.maxframe = 3
                this.image = document.getElementById('Shoot')
            } else if (this.mode === "Walk") {
                this.maxframe = 7
                this.image = document.getElementById('Walk')
            } else if (this.mode === "Run") {
                this.maxframe = 5
                this.image = document.getElementById('Run')
            } else if (this.mode === "Shoot2") {
                this.maxframe = 3
                this.image = document.getElementById('Shoot2')
            } else {
                this.maxframe = 0
                this.image = document.getElementById('Kneel')
            }
        } else if (this.direction === "left") {
            if (this.mode === "Idleleft") {
                this.maxframe = 6
                this.image = document.getElementById('Idleleft')
            } else if (this.mode === "Shootleft") {
                this.maxframe = 3
                this.image = document.getElementById('Shootleft')
            } else if (this.mode === "Walkleft") {
                this.maxframe = 7
                this.image = document.getElementById('Walkleft')
            } else if (this.mode === "Runleft") {
                this.maxframe = 5
                this.image = document.getElementById('Runleft')
            } else if (this.mode === "Shoot2left") {
                this.maxframe = 3
                this.image = document.getElementById('Shoot2left')
            } else {
                this.maxframe = 0
                this.image = document.getElementById('Kneelleft')
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
        this.sides.bottom = this.position.y + this.height;
        // console.log(this.mode)
        if (this.HP <= 0) {
            this.markedForDeletion = true
        }
    }

}