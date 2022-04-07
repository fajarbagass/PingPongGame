let userPaddle = document.getElementById('user-paddle');
let compPaddle = document.getElementById('comp-paddle');
let ball = document.getElementById('ball');
let textStart = document.getElementById('text-start');
let textComp = document.getElementById('text-comp');
let textUser = document.getElementById('text-user');

// posisi paddle user
userPaddle.style.marginLeft = '30px';
userPaddle.style.marginTop = '232px';
// posisi paddle comp
compPaddle.style.marginLeft = '1048px';
compPaddle.style.marginTop = '232px';
// posisi ball
ball.style.marginLeft = '534px';
ball.style.marginTop = '262px';
// posisi text Start Game
textStart.style.marginTop = '152px';
// posisi Computer Point
textComp.style.marginTop = '246px';
textComp.style.marginLeft = '523px';
// posisi text User Point
textUser.style.marginTop = '246px';
textUser.style.marginRight = '534px';

let W_Pressed = false;
let S_Pressed = false;

let ID;

let Vx = -1;
let Vy = -1;
// mencari nilai akar
let V = Math.sqrt(Math.sqrt(Math.pow(Vx,2)+Math.pow(Vy,2)));

// input audio start game
const audio = new Audio('audio/start-game.mp3');
audio.muted = false;

// keyboard control user paddle
document.addEventListener('keydown', (e)=>{
    if(e.keyCode=='87'){
        W_Pressed = true;
    }else if(e.keyCode=='83'){
        S_Pressed = true;
    }
})

document.addEventListener('keyup', (e)=>{
    if(e.keyCode=='87'){
        W_Pressed = false;
    }else if(e.keyCode=='83'){
        S_Pressed = false;
    }
})

// function reset
function reset(){ 
    clearInterval(ID);
    Vx = -1;
    Vy = -1;
    V = Math.sqrt(Math.sqrt(Math.pow(Vx,2)+Math.pow(Vy,2)));
    ball.style.marginLeft = '534px';
    ball.style.marginTop = '262px';
    gameLoop();
}

// fungsi pantul bola pada paddle
function collisionDetected(paddle){
    ball.top = marginTop(ball);
    ball.bottom = marginTop(ball)+10;
    ball.left = marginLeft(ball);
    ball.right = marginLeft(ball)+20;
    ball.centerX = marginLeft(ball)+10;
    ball.centerY = marginTop(ball)+10;
    
    paddle.top = marginTop(paddle)-20;
    paddle.bottom = marginTop(paddle)+72;
    paddle.left = marginLeft(paddle)-10;
    paddle.right = marginLeft(paddle)+10;
    paddle.centerX = marginLeft(paddle)+5;
    paddle.centerY = marginTop(paddle)+36;

    let type = (marginLeft(paddle) == 30) ? 'user' : 'comp';
    let boolean = false;

    if(type=='user' && Vx<0){
        boolean = true;
    }else if(type='comp' && Vx>0){
        boolean = true;
    }

    return ball.left < paddle.right && ball.top < paddle.bottom && ball.right > paddle.left && ball.bottom > paddle.top && boolean;
}

//function gameLoop
function gameLoop(){
    audio.play();
    textStart.textContent = "Start Game";
    setTimeout(() => {
        textStart.textContent = "";
        textComp.textContent = '';
        textUser.textContent = '';
        
        ID = setInterval(() => {
            // penambahan score comp
            if(marginLeft(ball)<0){
                document.querySelector('#comp-score').innerHTML = Number(document.querySelector('#comp-score').innerHTML)+1;
                reset();
                audio.muted = true;
                new Audio('audio/point-comp.mp3').play();
                textStart.textContent = "";
                textComp.textContent = "computer point";
                return;
            }

            // penambahan score user
            if((marginLeft(ball)+20) > 1088){
                document.querySelector('#user-score').innerHTML = Number(document.querySelector('#user-score').innerHTML)+1;
                reset();
                audio.muted = true;
                new Audio('audio/point-user.mp3').play();
                textStart.textContent = "";
                textUser.textContent = "user point";
                return;
            }
            
            // pantulan bola batas atas dan bawah
            if(marginTop(ball)<0 || (marginTop(ball)+40) > 544){
                Vy = -Vy;
            }

            // pantulan bola pada paddle
            let paddle = (marginLeft(ball)+10<544) ? userPaddle : compPaddle; 

            if(collisionDetected(paddle)){
                new Audio('audio/paddle-hit.mp3').play();
                let angle;
                let type = (marginLeft(paddle)==30) ? 'user' : 'comp';
                if(ball.centerY<paddle.centerY){
                    angle = (type=='user' ? -Math.PI/4 : (-3*Math.PI)/4);
                }else if(ball.centerY>paddle.centerY){
                    angle = (type=='user' ? Math.PI/4 : (3*Math.PI)/4);
                }else if(ball.centerY==paddle.centerY){
                    angle = (type=='user' ? 0 : Math.PI);
                }
                V += 0.5;
                Vx = V * Math.cos(angle);
                Vy = V * Math.sin(angle);
            }

            // paddle comp level
            let compLevel = 0.15;
            compPaddle.style.marginTop = `${marginTop(compPaddle)+((ball.centerY - (marginTop(compPaddle)+36))) * compLevel}px`;

            // pergerakan bola
            ball.style.marginLeft = `${marginLeft(ball)+Vx}px`;
            ball.style.marginTop = `${marginTop(ball)+Vy}px`;
            
            // pergerakan paddle user
            if(W_Pressed && marginTop(userPaddle)>0){
                userPaddle.style.marginTop = `${marginTop(userPaddle)-2}px`; // key w                
            }else if(S_Pressed && marginTop(userPaddle)<472){
                userPaddle.style.marginTop = `${marginTop(userPaddle)+2}px`; // key s          
            }

            // paddle comp up down tidak keluar container
            if(marginTop(compPaddle)<0){
                compPaddle.style.marginTop = '0px';
            }else if(marginTop(compPaddle)>472){
                compPaddle.style.marginTop = '472px';
            }
        }, 5);
    }, 1000);
}

function marginTop(elem){
    return Number(elem.style.marginTop.split('p')[0])
}

function marginLeft(elem){
    return Number(elem.style.marginLeft.split('p')[0])
}

// run game
gameLoop();