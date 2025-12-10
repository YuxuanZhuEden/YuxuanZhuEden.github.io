class Projectile {
    constructor(x, y, speed, type) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 3
        this.height = 1.5
        this.speed = speed
        this.image = document.getElementById('Projectile')
        this.type = type
        this.markedForDeletion = false
        this.fall = -Math.random() - 1
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.position.x += this.speed
        this.position.y += this.fall
        if (this.type === "friendly") {
            this.fall += 0.05
        } else if (this.type === "hostile") {
            this.fall += 0.1
        }
        crates.forEach(crate => {
            if (checkCollision(crate, this)) {
                if (this.type === "hostile") {
                    crate.HP -= 10
                    this.markedForDeletion = true
                }
            }
        })
        if (this.type === "friendly") {
            enemies.forEach(enemy => {
                if (checkCollision(enemy, this)) {
                    enemy.HP -= 100
                    this.markedForDeletion = true
                }
            })

        } else if (this.type === "hostile") {
            if (checkCollision(player, this)) {
                player.HP -= 20
                this.markedForDeletion = true
            }
            helpers.forEach(helper => {
                if (checkCollision(helper, this)) {
                    helper.HP -= 100 / 3
                    this.markedForDeletion = true
                }
            })
        }
        if (this.position.x >= canvas.width && this.speed > 0) this.markedForDeletion = true
        if (this.position.x <= 0 && this.speed < 0) this.markedForDeletion = true
    }
}