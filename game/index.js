const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1500 //1024
canvas.height = 900 //576
const player = new Player()
const hotbar = new Hotbar()
var round = 1
var projectiles = []
var enemies = [];
enemies.push(new Enemy(Math.random() * 1000, 0));
enemies.push(new Enemy(Math.random() * 1000, 0));
enemies.push(new Enemy(Math.random() * 1000, 0));
enemies.push(new Enemy(Math.random() * 1000, 0));
enemies.push(new Enemy(Math.random() * 1000, 0));
var helpers = [];
helpers.push(new Helper(Math.random() * 1000, 0));
var crates = []
crates.push(new Crate(50));
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
    }
}
function animate() {
    window.requestAnimationFrame(animate)
    if (enemies.length === 0) {
        round++
        for (let i = 0; i < round * 5; i++) {
            enemies.push(new Enemy(Math.random() * 1000, 0));
        }
    }
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    //shooting and kneeling
    if (keys.space.pressed === true && keys.downarrow.pressed === true) {
        player.mode = player.mode5
    } else if (keys.space.pressed === true && keys.downarrow.pressed === false) {
        player.mode = player.mode2
    } else if (keys.downarrow.pressed === true) {
        player.mode = player.mode6
    }
    //sprinting left and right
    else if (keys.rightarrow.pressed && keys.shift.pressed) {
        player.velocity.x = 7
        player.mode = player.mode4
    } else if (keys.leftarrow.pressed && keys.shift.pressed) {
        player.velocity.x = -7
        player.mode = player.mode4
    } // moveing left and right
    else if (keys.rightarrow.pressed) {
        player.velocity.x = 3.5
        player.mode = player.mode3
    } else if (keys.leftarrow.pressed) {
        player.velocity.x = -3.5
        player.mode = player.mode3
    } else {
        player.mode = player.mode1
        player.velocity.x = 0
    }

    player.update()
    player.draw()
    hotbar.draw()

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
    })
}

animate()