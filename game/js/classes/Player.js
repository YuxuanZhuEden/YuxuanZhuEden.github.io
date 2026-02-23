//player
class Player {
    constructor() {
        this.sprintspeed = 10
        this.walkspeed = 4
        this.onCrate = false;
        this.frame = 0
        this.direction1 = "left"
        this.direction2 = "right"
        this.direction = "left"
        this.maxreload = 50
        this.reload = 0
        this.jumped = 0
        this.maxjump = 2
        this.jumpheight = -20
        this.isjumping = false
        this.position = {
            x: 2872,
            y: -128,
        }

        this.velocity = {
            x: 0,
            y: 0,
        }
        this.width = 128;
        this.height = 128;
        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1
        this.maxHP = 4000
        this.HP = this.maxHP
        this.healspeed = 0.1
        this.mode = "Idle"
        this.changeframe = 0
        this.maxchangeframe = 5
        this.mode1 = "Idle";
        this.mode2 = "Shoot";
        this.mode3 = "Walk";
        this.mode4 = "Run";
        this.mode5 = "Shoot2";
        this.mode6 = "Kneel";
        this.mode7 = "Dying";
        this.mode9 = "Grenade"
        this.cratecooldown = 0
        this.finishcooldown = 0
        this.bombcooldown = 0
        this.maxcooldown = 20
        this.maxbombcooldown = 50
    }
    draw() {
        c.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        //cooldowns
        if (this.cratecooldown !== this.finishcooldown) {
            this.cratecooldown--
        }
        if (this.bombcooldown !== this.finishcooldown) {
            this.bombcooldown--
        }
        if (this.reload < this.maxreload) {
            this.reload++
        }
        if (this.mode === "Dying") {
            this.maxchangeframe = 20
        } else {
            this.maxchangeframe = 5
        }
        //dying
        if (this.HP <= 0) {
            this.HP = 0
            this.mode = "Dying"
        } 
        //healing
        if (this.HP < this.maxHP && this.mode !== "Dying" ) {
            this.HP += this.healspeed
        }
        //shooting
        if (hotbar.item === hotbar.item1) {
            if (this.mode === 'Shoot' && this.frame === 2 && this.changeframe === 0) {
                if (this.direction === "left") {
                    projectiles.push(new Projectile(this.position.x + 86, this.position.y + 76, -bulletspeed, "friendly"))
                    this.reload = 0
                } else if (this.direction === "right") {
                    projectiles.push(new Projectile(this.position.x + 40, this.position.y + 76, bulletspeed, "friendly")) 
                    this.reload = 0
                }
                hotbar.ammoamount --
            } else if (this.mode === 'Shoot2' && this.frame === 3 && this.changeframe === 0) {
                if (this.direction === "left") {
                    projectiles.push(new Projectile(this.position.x + 90, this.position.y + 87, -bulletspeed, "friendly"))
                    this.reload = 0
                } else if (this.direction === "right") {
                    projectiles.push(new Projectile(this.position.x + 36, this.position.y + 87, bulletspeed, "friendly"))   
                    this.reload = 0
                }
                hotbar.ammoamount --
            }
        } 
        //climbing with crates
        else if (this.mode !== "Dying" && hotbar.crateamount > 0 && keys.downarrow.pressed === true && hotbar.item === hotbar.item2 && this.cratecooldown === this.finishcooldown) {
            crates.push(new Crate(this.position.x + 39, this.position.y + this.height, "friendly"));
            this.velocity.y = -10
            this.cratecooldown = this.maxcooldown
            hotbar.crateamount --
        } 
        //blocking with crates
        else if (this.mode !== "Dying" && hotbar.crateamount > 0 && keys.space.pressed === true && hotbar.item === hotbar.item2 && this.cratecooldown === this.finishcooldown) {
            if (this.direction === "left") {
                crates.push(new Crate(this.position.x - 50, this.position.y + this.height - 50, "friendly"));
            } else if (this.direction === "right") {
                crates.push(new Crate(this.position.x + this.width, this.position.y + this.height - 50, "friendly"));
            }
            this.cratecooldown = this.maxcooldown
            hotbar.crateamount --
        } 
        //throwing grenades up
        else if (this.mode !== "Dying" && hotbar.bombamount > 0 && keys.downarrow.pressed === true && hotbar.item === hotbar.item3 && this.bombcooldown === this.finishcooldown) {
            grenades.push(new Grenade(this.position.x + 90, this.position.y + 87, 0, Math.random() * 5 - 15));
            this.bombcooldown = this.maxbombcooldown
            hotbar.bombamount --
        } 
        //throwing grenades to the sides
        else if (this.mode !== "Dying" && hotbar.bombamount > 0 && keys.space.pressed === true && hotbar.item === hotbar.item3 && this.bombcooldown === this.finishcooldown) {
            if (this.direction === "left") {
                grenades.push(new Grenade(this.position.x + 90, this.position.y + 87, -grenadespeed, Math.random() * 5 - 10));
            } else if (this.direction === "right") {
                grenades.push(new Grenade(this.position.x + 36, this.position.y + 87, grenadespeed, Math.random() * 5 - 10));
            }
            this.bombcooldown = this.maxbombcooldown
            hotbar.bombamount --
        }
        //setting images
        if (this.direction === "right") {
            if (this.mode === "Shoot" && hotbar.item === hotbar.item1) {
                this.maxframe = 3
                this.image = document.getElementById('Shoot')
            } else if (this.mode === "Walk") {
                this.maxframe = 7
                this.image = document.getElementById('Walk')
            } else if (this.mode === "Run") {
                this.maxframe = 5
                this.image = document.getElementById('Run')
            } else if (this.mode === "Shoot2" && hotbar.item === hotbar.item1) {
                this.maxframe = 3
                this.image = document.getElementById('Shoot2')
            } else if (this.mode === "Kneel" && hotbar.item === hotbar.item1) {
                this.maxframe = 0
                this.image = document.getElementById('Kneel')
            } else if (this.mode === "Dying") {
                this.maxframe = 4
                this.image = document.getElementById('Dying')
            } else {
                this.maxframe = 6
                this.image = document.getElementById('Idle')
            }
        }
        if (this.direction === "left") {
            if (this.mode === "Shoot" && hotbar.item === hotbar.item1) {
                this.maxframe = 3
                this.image = document.getElementById('Shootleft')
            } else if (this.mode === "Walk") {
                this.maxframe = 7
                this.image = document.getElementById('Walkleft')
            } else if (this.mode === "Run") {
                this.maxframe = 5
                this.image = document.getElementById('Runleft')
            } else if (this.mode === "Shoot2" && hotbar.item === hotbar.item1) {
                this.maxframe = 3
                this.image = document.getElementById('Shoot2left')
            } else if (this.mode === "Kneel" && hotbar.item === hotbar.item1) {
                this.maxframe = 0
                this.image = document.getElementById('Kneelleft')
            } else if (this.mode === "Dying") {
                this.maxframe = 4
                this.image = document.getElementById('Dyingleft')
            } else {
                this.maxframe = 6
                this.image = document.getElementById('Idleleft')
            }
        }
        //changing frame
        if (this.changeframe >= this.maxchangeframe) {
            if (this.direction === "right") {
                if (this.frame < this.maxframe) {
                    this.frame++
                } else {
                    //dropping ammo
                    if (this.mode === "Dying") {
                        while (hotbar.ammoamount >= 10) {
                            hotbar.ammoamount--
                            ammos.push(new Ammo(this.position.x - 64 + Math.random() * 256, this.position.y));
                        }
                        //respawning
                        deadpeople.push(new Deadperson(this.position.x, this.position.y, "right"))
                        if (flag1.mode === "friendly") {
                            this.position.x = flag1.position.x
                            this.position.y = flag1.position.y
                            this.mode = "Idle"
                            this.HP = this.maxHP
                        } else if (flag2.mode === "friendly") {
                            this.position.x = flag2.position.x
                            this.position.y = flag2.position.y
                            this.mode = "Idle"
                            this.HP = this.maxHP
                        }
                    } 
                    //jumping from end to front of sprite sheets
                    else {
                        this.frame = 0
                    }
                }
            } else if (this.direction === "left") {
                if (this.frame > 0) {
                    this.frame--
                } else {
                    if (this.mode === "Dying") {
                        //dropping ammo
                        while (hotbar.ammoamount > 0) {
                            hotbar.ammoamount--
                            ammos.push(new Ammo(this.position.x - 64 + Math.random() * 256, this.position.y));
                        }
                        //respawning
                        deadpeople.push(new Deadperson(this.position.x, this.position.y, "left"))
                        if (flag1.mode === "friendly") {
                            this.position.x = flag1.position.x
                            this.position.y = flag1.position.y
                            this.mode = "Idle"
                            this.HP = this.maxHP
                        } else if (flag2.mode === "friendly") {
                            this.position.x = flag2.position.x
                            this.position.y = flag2.position.y
                            this.mode = "Idle"
                            this.HP = this.maxHP
                        }
                    } 
                    //jumping from end to front of sprite sheets
                    else {
                        this.frame = this.maxframe
                    }
                }
            }
            this.changeframe = 0
        } else {
            this.changeframe++
        }
        this.onCrate = false; 
        //jumping on crates
        crates.forEach(crate => {
            if (crate.position.x < this.position.x + this.width &&
                crate.position.x + crate.width > this.position.x &&
                crate.position.y <= this.position.y + this.height + 10 && 
                crate.position.y >= this.position.y + this.height - 10 && this.isjumping === false && this.mode !== "Dying") {
                this.position.y = crate.position.y - this.height
                this.onCrate = true;
                this.jumped = this.maxjump
            }
        })
        this.isjumping = false
        //jumping
        if (keys.uparrow.pressed === true && this.velocity.y === 0 && this.jumped > 0 && this.mode !== "Dying") {
            this.velocity.y = this.jumpheight 
            this.isjumping = true
            this.jumped--
        }
        //on floor
        if (this.position.y + this.height >= canvas.height && this.velocity.y > 0) {
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height;
        } else if (this.position.y + this.height === canvas.height && this.velocity.y === 0) {
            this.position.y = canvas.height - this.height;
            this.jumped = this.maxjump
        } 
        //standing on crate
        else if (this.onCrate && this.isjumping === false) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += this.gravity
        }
        //not alowing movement while shooting and dying
        if (this.mode === "Shoot" || this.mode === "Shoot2" || this.mode === "Dying") {
            this.velocity.x = 0
        } 
        //moving
        this.sides.bottom = this.position.y + this.height;
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

