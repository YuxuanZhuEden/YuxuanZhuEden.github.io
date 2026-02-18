class Grenade {
    constructor(x, y, speed, fall) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 7
        this.height = 7
        this.speed = speed
        this.image = document.getElementById('grenade')
        this.markedForDeletion = false
        this.fall = fall
        this.frame = 0
        this.maxframe = 3
        this.mode1 = "flying"
        this.mode2 = "exploding"
        this.mode = "flying"
        this.gravity = 0.5
    }
    draw() {
        c.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        // console.log(this.mode)
        if (this.mode === "flying") {
        this.position.x += this.speed
        this.position.y += this.fall
        }
        //change frame
            if (this.frame < this.maxframe) {
                this.frame++
            } else {
                if (this.mode === "exploding") {
                    this.markedForDeletion = true
                } else {
                    this.frame = 0
                } 
            } 
            //check for explosion
                //explode against ground
                if (this.position.y + this.height >= canvas.height && this.mode === "flying") {
                    this.mode = "exploding"
                    this.image = document.getElementById('explosion')
                    this.height = 128
                    this.width = 128
                    this.position.y = canvas.height - 7
                    this.position.x -= 60.5
                    this.position.y -= 120
                    this.maxframe = 8
                    this.frame = 1
                }
                if (this.mode === "flying") {
                    this.fall += this.gravity
                }
                //check explosion with crates
                crates.forEach(crate => {
                    if (this.mode === "flying" && checkCollision(crate, this)) {
                        this.mode = "exploding"
                        this.image = document.getElementById('explosion')
                        this.height = 128
                        this.width = 128
                        this.position.x -= 60.5
                        this.position.y -= 121
                        this.maxframe = 8
                        this.frame = 1
                    }
                    if (this.mode === "exploding") {
                        if (checkCollision(crate, this) && crate.type === "hostile") {
                            crate.HP -= 101
                        }
                    }
                })
                //check explosion with enemy
                enemies.forEach(enemy => {
                    if (this.mode === "exploding") {
                        if (checkCollision(enemy, this)) {
                            enemy.HP -= 101
                        }
                    }
                })
    }
}
