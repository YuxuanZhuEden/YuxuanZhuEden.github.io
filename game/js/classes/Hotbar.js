class Hotbar {
    constructor() {
        this.x = canvas.width - 75
        this.y = 5
        this.crateamount = 10
        this.bombamount = 5
        this.ammoamount = 50
        this.item2 = 'Crate'
        this.item1 = 'sniperrifle'
        this.item3 = 'bomb'
        this.item = this.item1
        this.image = document.getElementById('hotbar')
    }
    draw() {
        c.font = "30px serif"
        c.drawImage(this.image, this.x, this.y)
        c.drawImage(document.getElementById(this.item), canvas.width - 65, 15, 50, 50)
        if (this.item === this.item1) {
            c.drawImage(this.image, this.x, this.y + 75)
            c.drawImage(document.getElementById('ammo'), canvas.width - 67.5, 90, 50, 50)
        }
        if (this.item === this.item2) {
            c.fillStyle = 'green'
            c.fillText(this.crateamount, this.x + 45, this.y + 75)
        } else if (this.item === this.item3) {
            c.fillStyle = 'green'
            c.fillText(this.bombamount, this.x + 45, this.y + 75)
        } else if (this.item === this.item1) {
            c.fillStyle = 'green'
            c.fillText(this.ammoamount, this.x + 45, this.y + 150)
        }
        // if (this.crateamount <= 0) this.item = this.item1
    }
    update() {

    }
}