class Crate {
    constructor(x, y, type) {
        this.width = 50
        this.height = 50
        this.position = {
            x: x,
            y: y,
        }
        this.image = document.getElementById("Crate")
        this.HP = 10000
        this.markedForDeletion = false
        this.type = type
        this.startcountdown = 10000
        this.countdown = this.startcountdown + Math.ceil(Math.random()) * 100
    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x - 25, this.position.y - 20, this.HP / 100, 5)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        //break
        if (this.HP <= 0) {
            this.markedForDeletion = true
        }
        //break over time
        if (this.countdown > 0) {
            this.countdown --
        } else {
            this.markedForDeletion = true
        }
    }
}