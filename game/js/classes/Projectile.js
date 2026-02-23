class Projectile {
    constructor(x, y, speed, type) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 3
        this.height = 1.5
        this.speed = speed
        this.image = document.getElementById('Projectile')
        this.type = type
        this.markedForDeletion = false
        this.fall = -Math.random() - 1
        this.damage = 55
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        //updating position
        this.position.x += this.speed
        this.position.y += this.fall
        //realistic gravity
        if (this.type === "friendly") {
            this.fall += 0.05
        } else if (this.type === "hostile") {
            this.fall += 0.1
        }
        //hitting crates
        crates.forEach(crate => {
            if (checkCollision(crate, this)) {
                if (this.type === "hostile" && crate.type === "friendly") {
                    crate.HP -= this.damage 
                    this.markedForDeletion = true
                } else if (this.type === "friendly" && crate.type === "hostile") {
                    crate.HP -= this.damage 
                    this.markedForDeletion = true
                }
            }
        })
        //hitting enemies
        if (this.type === "friendly") {
            enemies.forEach(enemy => {
                if (checkCollision(enemy, this)) {
                    enemy.HP -= this.damage
                    this.attackedbyhelper = false
                    this.markedForDeletion = true
                }
            })

        } 
        //hitting the player
        else if (this.type === "hostile") {
            if (checkCollision(player, this) && player.mode !== player.mode7 && player.mode !== player.mode8) {
                player.HP -= this.damage
                this.markedForDeletion = true
            }
            //hitting helpers
            helpers.forEach(helper => {
                if (checkCollision(helper, this)) {
                    helper.HP -= this.damage
                    this.markedForDeletion = true
                }
            })
        }
        //out of sight
        if (this.position.y > canvas.height) this.markedForDeletion = true
    }
}