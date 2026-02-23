class Flag {
    constructor(x, y, mode) {
        this.position = {
            x: x,
            y: y,
        }
        this.width = 512
        this.height = 512
        this.image = document.getElementById('redflag')
        this.mode = mode
        this.maxenemyspawncooldown = 50
        this.enemyspawncooldown = this.maxenemyspawncooldown
        this.maxhelperspawncooldown = 45
        this.helperspawncooldown = this.maxhelperspawncooldown
        this.finishspawncooldown = 0
        this.maxfriendlysoldiers = 50
        this.friendlysoldiers = helpers.length
        this.maxenemysoldiers = 50
        this.enemysoldiers = enemies.length
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
    update() {
        //checking amount of helpers
        this.friendlysoldiers = helpers.length
        //checking amount of enemies
        this.enemysoldiers = enemies.length
        //cooling down
        if (this.enemyspawncooldown > this.finishspawncooldown) {
            this.enemyspawncooldown --
        } 
        if (this.helperspawncooldown > this.finishspawncooldown) {
            this.helperspawncooldown --
        }
        //switching control
        enemies.forEach(enemy => {
            if (checkCollision(enemy, this) && this.mode === "friendly") {
                this.mode = "hostile"
            }
        })
        if (checkCollision(player, this) && this.mode === "hostile") {
            this.mode = "friendly"
        }
        helpers.forEach(helper => {
            if (checkCollision(helper, this) && this.mode === "hostile") {
                this.mode = "friendly"
            }
        })
        //spawning helpers
        if (this.mode === "friendly") {
            this.image = document.getElementById('redflag')
            if (this.helperspawncooldown === this.finishspawncooldown && this.friendlysoldiers < this.maxfriendlysoldiers) {
                helpers.push(new Helper(this.position.x,this.position.y));
                this.helperspawncooldown = this.maxhelperspawncooldown
                this.friendlysoldiers ++
            }
        }
        //spawning enemies
        if (this.mode === "hostile") {
            this.image = document.getElementById('blueflag')
            if (this.enemyspawncooldown === this.finishspawncooldown && this.enemysoldiers < this.maxenemysoldiers) {
                enemies.push(new Enemy(this.position.x, this.position.y));
                this.enemyspawncooldown = this.maxenemyspawncooldown
                this.enemysoldiers ++ 
            }
        }
    }
}
