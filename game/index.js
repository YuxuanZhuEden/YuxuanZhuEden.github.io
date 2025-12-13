
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 2000
canvas.height = 1000
const maxnextround = 500
var nextround = 0
var loadingnextround = false
var inventory = false
const player = new Player()
const hotbar = new Hotbar()
const bulletspeed = 25
const grenadespeed = 5
let gameover = false
var round = 1
var projectiles = []
var enemies = [];
enemies.push(new Enemy(Math.random() * 1000, 0));
enemies.push(new Enemy(Math.random() * 1000, 0));
enemies.push(new Enemy(Math.random() * 1000, 0));
enemies.push(new Enemy(Math.random() * 1000, 0));
enemies.push(new Enemy(Math.random() * 1000, 0));
var helpers = [];
// helpers.push(new Helper(Math.random() * 1000, 0));
// helpers.push(new Helper(Math.random() * 1000, 0));
// helpers.push(new Helper(Math.random() * 1000, 0));
// helpers.push(new Helper(Math.random() * 1000, 0));
// helpers.push(new Helper(Math.random() * 1000, 0));
// helpers.push(new Helper(Math.random() * 1000, 0));
// helpers.push(new Helper(Math.random() * 1000, 0));
// helpers.push(new Helper(Math.random() * 1000, 0));
// helpers.push(new Helper(Math.random() * 1000, 0));
// helpers.push(new Helper(Math.random() * 1000, 0));

var crates = [];
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
    // if (gameover === false) {
    window.requestAnimationFrame(animate)
// }
    // console.log(enemies.length)
    // console.log("round", round)
    // console.log("loading=", loadingnextround)
    // console.log("nextround=", nextround)
    if (!inventory) {

        c.fillStyle = 'white'
        c.fillRect(0, 0, canvas.width, canvas.height)
    } else {
        c.drawImage(document.getElementById('inventory'), 200, 0, 176 * 6.11, canvas.height)

    }
    // crates.forEach(crate => {
    //     console.log(crate.position.x, crate.position.y)
    // });
    if (player.HP <= 0) {
        gameover = true
    }
    hotbar.draw()
    if (!inventory) {
        if (enemies.length === 0) {
            loadingnextround = true
        }
        if (loadingnextround === true) {
            nextround++
            c.font = "30px serif"
            c.fillStyle = '#ff0000'
            // console.log("*** filltext test")
            c.fillText("LOADING...", 740, 400)
        }
        if (nextround >= maxnextround) {
            round++
            nextround = 0
            hotbar.crateamount += 10
            loadingnextround = false
            for (let i = 0; i < round * 10; i++) {
                enemies.push(new Enemy(Math.random() * 800, 0));
            }
            // helpers.push(new Helper(Math.random() * 100, 0));
            // helpers.push(new Helper(Math.random() * 100, 0));
            // helpers.push(new Helper(Math.random() * 100, 0));
            // helpers.push(new Helper(Math.random() * 100, 0));
            // helpers.push(new Helper(Math.random() * 100, 0));
        }

        if (keys.space.pressed === true && keys.downarrow.pressed === true && player.reload === player.maxreload) {
            player.mode = player.mode5
        } else if (keys.space.pressed === true && keys.downarrow.pressed === false && player.reload === player.maxreload) {
            player.mode = player.mode2
        } else if (keys.downarrow.pressed === true) {
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
        player.update()
        player.draw()

        projectiles.forEach(projectile => {
            projectile.draw();
            projectile.update();
        })
        projectiles = projectiles.filter(projectile => !projectile.markedForDeletion)
        enemies.forEach(enemy => {
            enemy.draw();
            enemy.update();
        })
        enemies = enemies.filter(enemy => !enemy.markedForDeletion)
        helpers.forEach(enemy => {
            enemy.draw();
            enemy.update();
        })
        helpers = helpers.filter(helper => !helper.markedForDeletion)

        crates.forEach(crate => {
            crate.draw();
            crate.update();
        })
        crates = crates.filter(crate => !crate.markedForDeletion)
    }
}
    animate()