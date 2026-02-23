const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 6000
canvas.height = 3600
const maxnextround = 1000
var nextround = 0
var loadingnextround = false

let gameover = false
var time = 0
var maxtime = 500
var projectiles = [];
var enemies = [];
var helpers = [];
var crates = [];
var grenades = [];
var airdrops = [];
var ammos = [];
var deadpeople = [];
const player = new Player()
const flag1 = new Flag(canvas.width - 512, canvas.height - 512, "friendly")
const flag2 = new Flag(0, canvas.height - 512, "hostile")
const radio = new Radio(0, 0)
const hotbar = new Hotbar()
const bulletspeed = 50
const grenadespeed = 10
// deadpeople.push(new Deadperson(0 ,0 ,"left"))
const keys = {
    uparrow: {
        pressed: false
    },
    rightarrow: {
        pressed: false
    },
    leftarrow: {
        pressed: false
    },
    downarrow: {
        pressed: false
    },
    space: {
        pressed: false
    },
    shift: {
        pressed: false
    },
    ESC: {
        pressed: false
    },
    ONE: {
        pressed: false
    },
    TWO: {
        pressed: false
    }
}
function animate() {
    window.requestAnimationFrame(animate)
    //background
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    //health bar
    c.fillStyle = 'black'
    c.fillRect(109, 8, player.maxHP/2 + 20, 70)
    c.fillStyle = 'pink'
    c.fillRect(120, 19, player.maxHP/2, 50)
    c.fillStyle = 'red'
    c.fillRect(120, 19, player.HP/2, 50)
    c.font = "70px serif"
    c.fillText("HP", 10, 70)
    c.fillStyle = 'black'
    c.fillText("Enemies Left: " + enemies.length, 2150, 70)
    console.log("ammos: ", ammos.length)
    console.log("projectiles: ", projectiles.length)
    console.log("helpers: ", helpers.length)
    console.log("enemies: ", enemies.length)
    console.log("deadpeoples: ", deadpeople.length)
    console.log("crates: ", crates.length)
    if (time > 0) {
        time --
    }
    if (enemies.length === 0 && flag1.mode === "friendly" && flag2.mode === "friendly") {
        loadingnextround = true
    }
    if (loadingnextround === true) {
        nextround++
        c.font = "90px serif"
        c.fillStyle = '#ff0000'
        if (nextround < 750) {
            c.fillText("Enemy Renforcements Dropping Down", 2200, 1300)
        } else if (nextround >= 750) {
            c.fillText("Copy That", 2200, 1300)
        }
    }
    if (time === 0) {
        airdrops.push(new AirDrop(Math.random() * 6000, -500))
        time = maxtime
    }
    if (nextround >= maxnextround) {
        nextround = 0
        loadingnextround = false
        for (let i = 0; i < 1000; i++) {
            enemies.push(new Enemy(Math.random() * 2872, -128));
        }
    }
    if (player.mode !== player.mode7 && player.mode !== player.mode8) {
        if (keys.space.pressed === true && keys.downarrow.pressed === true && player.reload === player.maxreload && hotbar.item === hotbar.item1 && hotbar.ammoamount > 0) {
            player.mode = player.mode5
        } else if (keys.space.pressed === true && keys.downarrow.pressed === false && player.reload === player.maxreload && hotbar.item === hotbar.item1 && hotbar.ammoamount > 0) {
            player.mode = player.mode2
        } else if (keys.downarrow.pressed === true && hotbar.item === hotbar.item1) {
            player.mode = player.mode6
        }
        //sprinting left and right
        else if (keys.rightarrow.pressed && keys.shift.pressed) {
            player.velocity.x = player.sprintspeed
            player.mode = player.mode4
        } else if (keys.leftarrow.pressed && keys.shift.pressed) {
            player.velocity.x = -player.sprintspeed
            player.mode = player.mode4
        } // moveing left and right
        else if (keys.rightarrow.pressed) {
            player.velocity.x = player.walkspeed
            player.mode = player.mode3
        } else if (keys.leftarrow.pressed) {
            player.velocity.x = -player.walkspeed
            player.mode = player.mode3
        } else {
            player.mode = player.mode1
            player.velocity.x = 0
        }
        if (keys.leftarrow.pressed) {
            player.direction = "left"
        } if (keys.rightarrow.pressed) {
            player.direction = "right"
        }
    }
    
    hotbar.draw()
    radio.update()
    radio.draw()
    flag1.update()
    flag1.draw()
    flag2.update()
    flag2.draw()
    player.update()
    player.draw()
    projectiles.forEach(projectile => {
        projectile.update();
        projectile.draw();
    })
    projectiles = projectiles.filter(projectile => !projectile.markedForDeletion)
    projectiles = projectiles.slice(-100, projectiles.length)
    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
    })
    enemies = enemies.filter(enemy => !enemy.markedForDeletion)
    helpers.forEach(helper => {
        helper.update();
        helper.draw();
    })
    helpers = helpers.filter(helper => !helper.markedForDeletion)
    crates.forEach(crate => {
        crate.update();
        crate.draw();
    })
    crates = crates.filter(crate => !crate.markedForDeletion)
    grenades.forEach(grenade => {
        grenade.update();
        grenade.draw();
    })
    grenades = grenades.filter(grenade => !grenade.markedForDeletion)
    airdrops.forEach(box => {
        box.update();
        box.draw();
    })
    airdrops = airdrops.filter(box => !box.markedForDeletion)
    ammos.forEach(ammo => {
        ammo.update();
        ammo.draw();
    })
    ammos = ammos.filter(ammo => !ammo.markedForDeletion)
    ammos = ammos.slice(-100, ammos.length)
    deadpeople.forEach(deadperson => {
        deadperson.update();
        deadperson.draw();
    })
    deadpeople = deadpeople.slice(-100, deadpeople.length)
}
    animate()