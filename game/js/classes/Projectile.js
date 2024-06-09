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
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.position.x += this.speed
        if (this.type === "friendly") {
            enemies.forEach(enemy => {
                if (checkCollision(enemy, this)) {
                    enemy.HP -= 30
                    this.markedForDeletion = true
                }
            })

        } else if (this.type === "hostile") {
            if (checkCollision(player, this)) {
                player.HP -= 30
                this.markedForDeletion = true
            }
            helpers.forEach(helper => {
                if (checkCollision(helper, this)) {
                    helper.HP -= 30
                    this.markedForDeletion = true
                }
            })
        }
    }
}