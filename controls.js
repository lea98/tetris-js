//REAKCIJA NA KLIK MIŠA(DODIR) ILI NA KEYBOARD ARROW KEYS

document.addEventListener("keydown",CONTROL);




function CONTROLCLICK(event){
    if(event == 'left'){
        p.moveLeft();
        dropStart = Date.now(); //ne zelimo da se spusta doli automaski dok micemo livo desno
    }else if(event == 'up' ){
        p.rotate();
        dropStart = Date.now();
    }else if(event == 'right'){
        p.moveRight();
        dropStart = Date.now();
    }else if(event == 'down'){
        p.moveDown();
    }
}




function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now(); //ne zelimo da se spusta doli automaski dok micemo livo desno
    }else if(event.keyCode == 38 ){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}



//DA SE NE MOZE SCROLLAT SA UP I DOWN DOK SE IGRA
var keys = {};
window.addEventListener("keydown",
    function(e){
        keys[e.keyCode] = true;
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    },
false);
window.addEventListener('keyup',
    function(e){
        keys[e.keyCode] = false;
    },
false);