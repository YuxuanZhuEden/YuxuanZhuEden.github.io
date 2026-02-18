class Ammo {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y,
        }
        this.width = 69
        this.height = 67
        this.image = document.getElementById('ammo')
        this.fall = 5
        this.markedForDeletion = false
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
    update() {
        if (this.position.y + this.height >= canvas.height) {
            this.position.y = canvas.height - this.height
        } else {
            this.position.y += this.fall
        }
        crates.forEach(crate => {
            if (crate.position.x < this.position.x + this.width &&
                crate.position.x + crate.width > this.position.x &&
                crate.position.y <= this.position.y + this.height + 10 && 
                crate.position.y >= this.position.y + this.height - 10) {
                this.position.y = crate.position.y - this.height
            }
        })
        if (checkCollision(player, this)) {
            this.markedForDeletion = true
            hotbar.ammoamount += 1
        }
    }
}
