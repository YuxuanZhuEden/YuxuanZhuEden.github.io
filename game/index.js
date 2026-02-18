
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 6000
canvas.height = 3600
const maxnextround = 1000
var nextround = 0
var loadingnextround = false
const player = new Player()
const hotbar = new Hotbar()
const bulletspeed = 50
const grenadespeed = 10
let gameover = false
var round = 0
var projectiles = []
var enemies = [];
var helpers = [];
// helpers.push(new Helper(Math.random() * 1000, 0));
var crates = [];
var grenades = [];
var airdrops = [];
airdrops.push(new AirDrop(Math.random() * 6000, -500))
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
    c.fillRect(57, 4, player.maxHP/4 + 5, 30)
    c.fillStyle = 'pink'
    c.fillRect(60, 7, player.maxHP/4, 25)
    c.fillStyle = 'red'
    c.fillRect(60, 7, player.HP/4, 25)
    c.font = "30px serif"
    c.fillText("HP", 10, 30)
    c.fillStyle = 'black'
    c.fillText("Enemies Left: " + enemies.length, 1150, 30)
    // console.log(nextround)

        if (enemies.length === 0 && loadingnextround === false) {
            loadingnextround = true
        }
        if (loadingnextround === true) {
            nextround++
            c.font = "90px serif"
            c.fillStyle = '#ff0000'
            if (nextround < 750) {
                c.fillText("Paratrooper Team "+(round+1)+" Dropping Down", 2200, 1300)
            } else if (nextround >= 750) {
                c.fillText("Copy That", 2200, 1300)
            }
        }
        if (nextround >= maxnextround) {
            round++
            nextround = 0
            if (round%5 === 0) {
                airdrops.push(new AirDrop(Math.random() * 6000, -500))
            }
            loadingnextround = false
            for (let i = 0; i < round * 2; i++) {
                enemies.push(new Enemy(Math.random() * 2872, -128));
            }
            // helpers.push(new Helper(Math.random() * 100, 0));
        }
        if (player.mode !== player.mode7 && player.mode !== player.mode8) {
            if (keys.space.pressed === true && keys.downarrow.pressed === true && player.reload === player.maxreload && hotbar.item === hotbar.item1 && hotbar.ammoamount > 0) {
                player.mode = player.mode5
            } else if (keys.space.pressed === true && keys.downarrow.pressed === false && player.reload === player.maxreload && hotbar.item === hotbar.item1 && hotbar.ammoamount > 0) {
                player.mode = player.mode2
            } else if (keys.downarrow.pressed === true && hotbar.item === hotbar.item1 && hotbar.ammoamount > 0) {
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
        player.update()
        player.draw()
        hotbar.draw()
        projectiles.forEach(projectile => {
            projectile.update();
            projectile.draw();
        })
        projectiles = projectiles.filter(projectile => !projectile.markedForDeletion)
        enemies.forEach(enemy => {
            enemy.update();
            enemy.draw();
        })
        enemies = enemies.filter(enemy => !enemy.markedForDeletion)
        helpers.forEach(enemy => {
            enemy.update();
            enemy.draw();
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
}
    animate()