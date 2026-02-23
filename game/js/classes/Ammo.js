class Ammo {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y,
        }
        this.width = 69
        this.height = 67
        this.image = document.getElementById('ammo')
        this.fall = -Math.round(Math.random() * 10)
        this.markedForDeletion = false
        this.movement = -25 + Math.round(Math.random() * 50)
        this.startcountdown = 10000
        this.countdown = this.startcountdown + Math.ceil(Math.random()) * 100
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
    update() {
        //counting down
        if (this.countdown > 0) {
            this.countdown --
        } else {
            this.markedForDeletion = true
        }
        //changing position
        this.position.y += this.fall
        this.position.x += this.movement
        //slowing down
        if (this.movement !== 0) {
            if (this.movement < 0) {
                this.movement += 0.25
            } else if (this.movement > 0) {
                this.movement -= 0.25
            }
        }
        //bouncing
        if (this.position.y + this.height >= canvas.height) {
            this.position.y = canvas.height - this.height
            if (Math.abs(this.fall) > 1) {
                this.fall = -this.fall / 5
            } else {
                this.fall = 0
            }
        } else {
            this.fall += 0.5
        }
        // falling on to crates
        crates.forEach(crate => {
            if (crate.position.x < this.position.x + this.width &&
                crate.position.x + crate.width > this.position.x &&
                crate.position.y <= this.position.y + this.height + 10 && 
                crate.position.y >= this.position.y + this.height - 10) {
                this.position.y = crate.position.y - this.height
                this.fall = 0
            }
        })
        //picked up by player
        if (checkCollision(player, this) && player.mode !== "Dying") {
            this.markedForDeletion = true
            hotbar.ammoamount ++
        }
        //picked up by enemy
        enemies.forEach(enemy => {
            if (checkCollision(enemy, this)) {
                enemy.ammoamount += 10
                this.markedForDeletion = true
            }
        });
        //picked up by helpers
        helpers.forEach(helper => {
            if (checkCollision(helper, this)) {
                helper.ammoamount += 10
                this.markedForDeletion = true
            }
        });
    }
}
