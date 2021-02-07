const canvas = document.getElementById("gameWindow");
const ctx = canvas.getContext("2d");
const color = "#199C77";
var turn = 0;
var turnCount = 0;
var gameOver = false;
var players = [
    {
        player: 1,
        name: 'Player 1',
        token: 'X'
    },
    {
        player: 2,
        name: 'Player 2',
        token: 'O'
    }
];
class Rectangle{
    constructor(x,y,w,h){
        this.width=w;
        this.height=h;
        this.x=x;
        this.y=y;
    }
    contains = function(x,y){
        return x >= this.x && x <= this.x+this.width && y>=this.y && y<=this.y+this.height;
    }
}
var grid = [
    [
        new Rectangle(0, 0, canvas.width/3, canvas.width/3),
        new Rectangle(canvas.width/3, 0, canvas.width/3, canvas.width/3),
        new Rectangle(2*canvas.width/3, 0, canvas.width/3, canvas.width/3)
    ],
    [
        new Rectangle(0, canvas.width/3, canvas.width/3, canvas.width/3),
        new Rectangle(canvas.width/3, canvas.width/3, canvas.width/3, canvas.width/3),
        new Rectangle(2*canvas.width/3, canvas.width/3, canvas.width/3, canvas.width/3)
    ],
    [
        new Rectangle(0, 2*canvas.width/3, canvas.width/3, canvas.width/3),
        new Rectangle(canvas.width/3, 2*canvas.width/3, canvas.width/3, canvas.width/3),
        new Rectangle(2*canvas.width/3, 2*canvas.width/3, canvas.width/3, canvas.width/3)
    ]
];
var board = [
    [
        -1,-1,-1
    ],
    [
        -1,-1,-1
    ],
    [
        -1,-1,-1
    ]
];

const drawBoard = function(){
    let thickness = 5;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(canvas.width/3 - thickness/2, 0, thickness, canvas.height);
    ctx.fillRect(2 * canvas.width/3 - thickness/2, 0, thickness, canvas.height);
    ctx.fillRect(0, canvas.width/3 - thickness/2, canvas.height, thickness);
    ctx.fillRect(0, 2*canvas.width/3 - thickness/2, canvas.height, thickness);
}

const getNames = function(){
    const p1_name = document.getElementById("p1").value;
    if(p1_name) players[0].name = p1_name;
    const p2_name = document.getElementById("p2").value;
    if(p2_name) players[1].name = p2_name;

    //get top div
    const playerDisp = document.getElementById("players");
    document.getElementById("inputs").remove();

    //Player names
    const player_titles = document.createElement("h2");
    player_titles.appendChild(document.createTextNode(players[0].name));
    player_titles.appendChild(document.createTextNode(" vs "));
    player_titles.appendChild(document.createTextNode(players[1].name));
    playerDisp.appendChild(player_titles);

    const turnDisp = document.getElementById("turnDisp");
    const turn = document.createElement("h1");
    turn.setAttribute("id", "turn")
    turnDisp.appendChild(turn);
}

const updateTurn = function(){
    var turnDisp = document.getElementById("turn");
    turnDisp.innerHTML = players[turn].name + "'s turn";
}

const checkWin = function(){
    //Hor
    if(board[0][0] >=0 && board[0][0] === board[0][1] && board[0][1] === board[0][2]){
        return board[0][0];
    }
    else if(board[1][0] >=0 && board[1][0] === board[1][1] && board[1][1] === board[1][2]){
        return board[1][0];
    }
    else if(board[2][0] >=0 && board[2][0] === board[2][1] && board[2][1] === board[2][2]){
        return board[2][0];
    }

    //Ver
    else if(board[0][0] >=0 && board[0][0] === board[1][0] && board[1][0] === board[2][0]){
        return board[0][0];
    }
    else if(board[0][1] >=0 && board[0][1] === board[1][1] && board[1][1] === board[2][1]){
        return board[0][1];
    }
    else if(board[0][2] >=0 && board[0][2] === board[1][2] && board[1][2] === board[2][2]){
        return board[0][2];
    }

    //Diagonal
    else if(board[0][0] >=0 && board[0][0] === board[1][1] && board[1][1] === board[2][2]){
        return board[0][0];
    }
    else if(board[0][2] >=0 && board[0][2] === board[1][1] && board[1][1] === board[2][0]){
        return board[0][2];
    }
    return -1;
};

const playAgain = function(){
    const btn = document.createElement("button");
    btn.innerHTML = "Play Again";
    btn.onclick = function(){
        location.reload();
    }
    btn.setAttribute("class", "btn-primary btn-lg");
    document.getElementById("playAgainBtn").appendChild(btn);
};

const catGame = function(){
    gameOver = true;
    document.getElementById("players").remove();
    document.getElementById("turnDisp").remove();
    var message = document.createElement("h1");
    message.appendChild(document.createTextNode(`Cat Game`));
    document.getElementById("playAgain").appendChild(message);
    playAgain();
};

const showWinner = function(winner){
    gameOver = true;
    document.getElementById("players").remove();
    document.getElementById("turnDisp").remove();
    var message = document.createElement("h1");
    message.appendChild(document.createTextNode(`${players[winner].name} won!`));
    document.getElementById("playAgain").appendChild(message);
    playAgain();
}

const drawToken = function(row, col){
    ctx.font = "40px Verdana";
    var sq = grid[row][col];
    ctx.fillText(players[turn].token, sq.x + sq.width/3, sq.y + sq.height/2);
    board[row][col] = turn;
    turnCount++;
    var winner = checkWin();
    if(winner >= 0){
        showWinner(winner);
        return;
    }
    if(turnCount >= 9){
        catGame();
        return;
    }
    turn ^= 1;
    updateTurn();
}

const click = function(event) {
    if(gameOver) return;
    const frameRect = canvas.getBoundingClientRect();
    let x = event.clientX - frameRect.left;
    let y = event.clientY - frameRect.top;
    for(let r = 0; r < 3; r++){
        let found = false;
        for(let c = 0;c < 3;c++){
            if(grid[r][c].contains(x, y) && board[r][c] < 0){
                drawToken(r, c);
                found = true;
                break;
            }
        }
        if(found)
            break;
    }
}

const play = function(){
    getNames();
    updateTurn();
    canvas.addEventListener("mousedown", function(ev){
        click(ev);
    }, false);
}

window.onload = function(){
    drawBoard();
    document.getElementById("playButton").onclick = play;
    canvas.addEventListener('mousedown', play);
}
