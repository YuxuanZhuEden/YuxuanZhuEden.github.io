class Hotbar {
    constructor() {
        this.x
        this.y = 10
        this.item1 = 'sniperrifle'
        this.item = this.item1
        this.image = document.getElementById('hotbar')
    }
    draw() {
        c.drawImage(this.image, canvas.width - 75, 5)
        c.drawImage(document.getElementById(this.item), canvas.width - 75, 5, 70, 70)
    }
    update() {

    }
}