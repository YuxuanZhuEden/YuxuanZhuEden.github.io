class Grenade {
    constructor(x, y, speed) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 7
        this.height = 7
        this.speed = speed
        
        this.image = document.getElementById('grenade')
        this.type = type
        this.markedForDeletion = false
        this.fall = -Math.random() - 5
        this.frame = 0
        this.maxframe
        this.changeframe = 0
        this.maxchangeframe = 5 - 1
        this.mode1 = "flying"
        this.mode2 = "exploding"
        this.mode = this.mode1
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.position.x += this.speed
        this.position.y += this.fall
        if (this.position.y <= canvas.height) {
            this.mode = this.mode2
            this.width = 100
            this.height = 100
            enemies.forEach(enemy => {
                checkcolision(enemy, this)
            })
        } else {
            this.fall += 0.3
        }
    }
}
