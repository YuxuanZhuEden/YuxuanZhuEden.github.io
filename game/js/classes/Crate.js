class Crate {
    constructor(x, y) {
        this.width = 50
        this.height = 50
        this.position = {
            x: x,
            y: y,
        }
        this.image = document.getElementById("Crate")
        this.HP = 1000
        this.markedForDeletion = false
    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x - 25, this.position.y - 20, this.HP / 10, 5)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (this.HP <= 0) {
            this.markedForDeletion = true
        }
    }
}