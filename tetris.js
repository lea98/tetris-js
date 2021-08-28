const cvs = document.getElementById("canvas"); //odaberi canvas element
const ctx = cvs.getContext("2d"); //get context, omogucava gotove metode za crtanje koristeci js-a
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL= 10;
const SQ = 30; //30px puta 30px, squaresize
const EMPTY = "#e3dddd"; // prazan kvadratic



// NACRTAJ KVADRATIC
function drawSquare(x,y,color){ //x i y broj kvadratica

    
    ctx.fillStyle = color; //metoda canvasa, za postavit boju
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ); //1. argument-udaljenost od live strane canvasa, 2.arg-od vrha, 3.-sirina, 4.-visina

    ctx.strokeStyle = "#f4eaea"; //za boju rubova, da "dobijemo kvadratice"
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

// NAPRAVI PLOCU- 10 stupaca, 20 redova

let board = []; //Za napravit plocu- EMPTY-prazan kvadratic bile boje. Board je tipa array, to jest matrica
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = EMPTY;
    }
}

// NACRATJ PLOCU
function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

//TETROMINOS (pieces/oblici)

const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

// RANDOM

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6 floor zaokruzi na nize
    return new Piece( PIECES[r][0],PIECES[r][1]); //1-za dobit Z ili S ili T.., 2-za dobit odgovrajucu boju jer se array sastoji od dva polja

}

let p = randomPiece();

// The Object Piece

function Piece(tetromino,color){
    this.tetromino = tetromino; //cili array npr. Z
    this.color = color;
    
    this.tetrominoN = 0; // pocinjemo od prvog uzorka(nerotiranog, nultog)
    this.activeTetromino = this.tetromino[this.tetrominoN]; //npr Z[0]
    
    // na pocetku su po sredini (3) i jos nisu upali u board (-2)
    this.x = 3;
    this.y = -2;
}

// fill function

Piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we draw only occupied squares
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color); //jer nas this.x i this.y vode na gornji livi kut, triba dodat br reda i stupca
            }
        }
    }
}

// draw a piece to the board

Piece.prototype.draw = function(){ //dodajemo novu metodu u piece konstruktor funkciju
    this.fill(this.color);
}

// undraw a piece-isto ka draw al punimo bilom bojom


Piece.prototype.unDraw = function(){
    this.fill(EMPTY);
}

// move Down the piece

Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
    
}

// move Right the piece
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move Left the piece
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){ //buduca pozicija bi bila-y ostaje isti, x se mice za jedan u livo,tj -1
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate the piece
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length]; //suma po mudulu 4
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){  
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];   //triba updateat activni tetromino
        this.draw();
    }
}

let score = 0;

Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we skip the EMPTY squares, njih necemo lockat na board
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;
        }
    }
    // remove full rows
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != EMPTY);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for( c = 0; c < COL; c++){
                board[0][c] = EMPTY;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();
    
    // update the score
    scoreElement.innerHTML = score;
}

// collision fucntion

Piece.prototype.collision = function(x,y,piece){ //x i y buduce koordinate
    for( r = 0; r < piece.length; r++){ //triba proc kroz sve kvadratice
        for(c = 0; c < piece.length; c++){
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue; //priskace iteraciju u petlji
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            // conditions
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if(newY < 0){
                continue;
            }
            // check if there is a locked piece alrady in place
            if( board[newY][newX] != EMPTY){
                return true;
            }
        }
    }
    return false;
}



// drop the piece every 1sec

let dropStart = Date.now();
let gameOver = false; //postavit na pocetku
function drop(){
    let now = Date.now();
    let delta = now - dropStart; //razlika sadasnjem vremena i vremena kad smo zadnji put spustili piece
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
    if(gameOver)
    {
        alert("GAME OVER! :(\nYOUR SCORE: "+score);
        location.reload();
    }
}



drop();























