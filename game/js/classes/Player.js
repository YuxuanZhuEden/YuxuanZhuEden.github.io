//player
class Player {
    constructor() {
        //pos
        this.position = {
            x: 100,
            y: 100,
        }

        this.velocity = {
            x: 0,
            y: 0,
        }
        this.width = 100
        this.height = 100
        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1
        this.HP = 300
    }
    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.fillStyle = 'red'
        c.fillRect(60, 5, this.HP, 25)
        c.font = "30px serif"
        c.fillText("HP", 10, 30)

    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height >= canvas.height && this.velocity.y > 0){
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height;
        } else if (this.position.y + this.height === canvas.height && this.velocity.y === 0) { 
            this.position.y = canvas.height - this.height;
        } else {
            this.velocity.y += this.gravity
        }
        this.sides.bottom = this.position.y + this.height;
    }
    
}