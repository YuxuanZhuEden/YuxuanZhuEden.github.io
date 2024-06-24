class Hotbar {
    constructor() {
        this.x = canvas.width - 75
        this.y = 5
        this.crateamount = 10
        this.item2 = "Crate"
        this.item1 = 'sniperrifle'
        this.item = this.item1
        this.image = document.getElementById('hotbar')
    }
    draw() {
        c.drawImage(this.image, this.x, this.y)
        c.drawImage(document.getElementById(this.item), canvas.width - 65, 15, 50, 50)
        if (this.item === this.item2) {
            c.fillStyle = 'green'
            c.fillText(this.crateamount, this.x + 45, this.y + 75)
        }
        if (this.crateamount <= 0) this.item = this.item1
    }
    update() {

    }
}