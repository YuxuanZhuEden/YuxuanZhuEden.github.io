class Deadperson {
    constructor(x, y, direction) {
        this.position = {
            x: x,
            y: y,
        }
        this.velocity = {
            y: 0,
        }
        this.width = 128
        this.height = 128
        this.gravity = 1
        this.direction = direction
        if (this.direction === "left") {
            this.image = document.getElementById('Deadleft')
        } else {
            this.image = document.getElementById('Dead')
        }
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
    update() {
        this.position.y += this.velocity.y
        if (this.position.y + this.height >= canvas.height) {
            this.position.y = canvas.height - this.height
            this.velocity.y = 0
        } else {
            this.velocity.y += this.gravity
        }
    }
}
