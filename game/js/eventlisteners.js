window.addEventListener('keydown', (event) => {
    // console.log(event.key)
    switch (event.key) {
        //up
        case 'ArrowUp':
            if (player.velocity.y === 0) player.velocity.y = -20

            break
        //left
        case 'ArrowLeft':
            keys.leftarrow.pressed = true
            player.direction = player.directions1
            break
        //right
        case 'ArrowRight':
            keys.rightarrow.pressed = true
            player.direction = player.directions2
            break
        case 'ArrowDown':
            keys.downarrow.pressed = true

            break
        case ' ':
            keys.space.pressed = true

            break
        case 'Shift':
            keys.shift.pressed = true

            break
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //left
        case 'ArrowLeft':
            keys.leftarrow.pressed = false

            break
        //right
        case 'ArrowRight':
            keys.rightarrow.pressed = false

            break
        case 'ArrowDown':
            keys.downarrow.pressed = false

            break
        case ' ':
            keys.space.pressed = false

            break
        case 'Shift':
            keys.shift.pressed = false

            break
    }

})