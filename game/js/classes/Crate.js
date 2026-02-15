class Crate {
    constructor(x, y, type) {
        this.width = 50
        this.height = 50
        this.position = {
            x: x,
            y: y,
        }
        this.image = document.getElementById("Crate")
        this.HP = 100
        this.markedForDeletion = false
        this.type = type
    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x - 25, this.position.y - 20, this.HP, 5)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (this.HP <= 0) {
            this.markedForDeletion = true
        }
    }
}