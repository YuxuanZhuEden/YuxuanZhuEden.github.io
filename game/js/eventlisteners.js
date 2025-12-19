window.addEventListener('keydown', (event) => {
    // console.log(event.key)
    switch (event.key) {
        //up
        case 'ArrowUp':
            keys.uparrow.pressed = true
            break
        //left
        case 'ArrowLeft':
            keys.leftarrow.pressed = true
            break
        //right
        case 'ArrowRight':
            keys.rightarrow.pressed = true
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
        case 'Escape':
            if (!inventory) inventory = true
            else inventory = false

            break
        case '2':
            hotbar.item = hotbar.item2


            break
        case '1':
            hotbar.item = hotbar.item1


            break
        // case 'b':
        //     enemies.push(new Enemy(Math.random() * 1000, 0));

        //     break
        // case 'g':
        //     helpers.push(new Helper(Math.random() * 1000, 0));

        //     break
        // case 'h':
        //     player.HP += 100

        //     break
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //up
        case 'ArrowUp':
            keys.uparrow.pressed = false

            break
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
        // case 'Escape':
        //     keys.ESC.pressed = false

        //     break
    }

})