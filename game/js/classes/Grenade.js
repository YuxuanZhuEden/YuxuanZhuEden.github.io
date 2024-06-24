class Grenade {
    constructor(x, y, speed, type) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 7
        this.height = 7
        this.speed = speed
        this.image = document.getElementById('Projectile')
        this.type = type
        this.markedForDeletion = false
        this.fall = -Math.random() - 5
        this.changeframe = 0
        this.maxchangeframe = 5 - 1
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.position.x += this.speed
        this.position.y += this.fall
        this.fall += 0.3
        enemies.forEach(enemy => {
            if (checkCollision(enemy, this)) {
                enemy.HP -= 1
                this.markedForDeletion = true
            }
        })

        if (this.position.y < canvas.height) {
            // this.
        }

    }

}
