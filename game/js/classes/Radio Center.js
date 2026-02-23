class Radio {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y,
        }
        this.width = 100
        this.height = 100
        this.image = document.getElementById('')
        this.fall = 5
        this.markedForDeletion = false
    }
    draw() {
        // c.drawImage(this.image, this.position.x, this.position.y)
        c.fillRect(this.position.x, this.position.y, this.width, this.he)
    }
    update() {
        if (this.position.y + this.height >= canvas.height) {
            this.position.y = canvas.height - this.height
        } else {
            this.position.y += this.fall
        }
        if (checkCollision(player, this)) {

        }
    }
}
