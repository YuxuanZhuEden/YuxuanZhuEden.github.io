class Crate {
    constructor(x) {
        this.width = 68
        this.height = 67
        this.x = x
        this.y = canvas.height -= this.width
        this.image = document.getElementById("Crate")
    }
    draw() {
        c.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}