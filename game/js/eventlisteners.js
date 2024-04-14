 window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //up
        case 'ArrowUp':
            if (player.velocity.y === 0) player.velocity.y = -20
            
            break
        //left
        case 'ArrowLeft':
            keys.a.pressed = true
                
            break
        //right
        case 'ArrowRight':
            keys.d.pressed = true
                
                break
    }
 })
 window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //left
        case 'ArrowLeft':
            keys.a.pressed = false
                
            break
        //right
        case 'ArrowRight':
            keys.d.pressed = false
                
                break
    }
 })