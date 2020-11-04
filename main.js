var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");


//=====Flying enemies====
const flyingEnemyMinW = 20;
const flyingEnemyMaxW = 300;
const flyingEnemyMaxH = 270;
const flyingEnemyMinH = 20;
var flyingEnemySpeed = 5;
//=====Main chacracter===
const originPikaW = 50;
const originPikaH = 50;
const originPikaX = 100;
var originPikaY = myCanvas.height - originPikaH - 1;
const gravity = 0.5;
const inertia = 0.95
const maxVelY = 20;
//=====Normal Enemies===
const enemyMaxW = 80;
const enemyMinW = 20;
const enemyMaxH = 80;
const enemyMinH = 30;
const minDistance = 250;
const maxDistance = 600;
const maxEnemyNum = 4;
var enemySpeed = 5;
//======Other===========
var keys=[];
var blockJumpKey = false;
var frameNo = 0;
var score = 0;
var avaCount = 1;
var isControl = true;
var isDead = false;
var highScore = 0;
//528x94
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

document.addEventListener("keydown", function(e) {
    if(isControl)
        keys[e.keyCode] = (blockJumpKey && (e.keyCode == 32 || e.keyCode == 38))? false: true;
    });
document.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

function mainCharacter() {
    this.coordX = originPikaX,
    this.coordY = originPikaY,
    this.width = originPikaW,
    this.height = originPikaH,
    this.isJump = false,
    this.isDuck = false,
    this.isOnGround = true,
    this.velY = 0,
    this.avatar = new Image(originPikaW, originPikaH),
    this.draw = function(stt){
        ctx.beginPath();
        ctx.rect(this.coordX, this.coordY,this.width, this.height);
        
        if(this.isDuck)
        {
            ctx.fillStyle = "blue";
        }else
            ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
      
        // switch (stt) {
        //     case 1:
        //         this.avatar.src = "image/pika1.jpg";
        //         break;
        //     case 2:
        //         this.avatar.src = "image/pika2.jpg";
        //         break;
        //     case 3:
        //         this.avatar.src = "image/pika3.jpg";
        //         break;
        //     case 4:
        //         this.avatar.src = "image/pika4.jpg";
        //         break;
        //     default:
        //         break;
        // } 
    
        // ctx.drawImage(this.avatar, this.coordX, this.coordY,this.avatar.width,this.avatar.height);
        // this.avatar.src="image/2x-trex.png";
        // ctx.drawImage(this.avatar,(stt)*87.2,0, 87, 94, this.coordX, this.coordY, this.height*528/5/94, this.height);
        
    }

    this.move = function(){
        if(!isDead)
        {
            if(keys[32] || keys[38])
            {
                this.isJump = true;
                this.isOnGround = false;
                if(!blockJumpKey)
                    this.velY =-maxVelY;
                blockJumpKey = true;
            }
            if(this.isJump)
            {
                this.velY += gravity  
                this.velY *= inertia;
                this.coordY += this.velY;
                if(this.coordY >= originPikaY)
                {
                    this.isJump = false;
                    this.isOnGround = true;
                    blockJumpKey = false
                    this.coordY = originPikaY;
                }
            }
            if(keys[40])
            {
                this.isDuck = true;
            }
            else
                this.isDuck = false;
            if(this.isDuck){
                this.height = originPikaH/2;
                if(this.coordY < originPikaY+originPikaH/2)
                {
                    this.coordY += originPikaH/2;
                }
            }
            else{
                if(this.coordY >= originPikaY+originPikaH/2)
                    this.coordY -= originPikaH/2;
                this.height = originPikaH;
            }
        }
    }
}

function flyEnemy(){
    this.width = getRndInteger(flyingEnemyMinW, flyingEnemyMaxW);
    this.height = getRndInteger(flyingEnemyMinH, flyingEnemyMaxH);
    this.coordX = myCanvas.width;
    this.coordY = getRndInteger(0, myCanvas.height - this.height - 30);
    this.image = new Image();
    this.draw = function(){
        // switch (Math.floor(avaCount)) {
        //     case 1:
        //         this.image.src = "image/bird1.jpg";
        //         break;
        //     case 2:
        //         this.image.src = "image/bird2.jpg";
        //         break;
        //     case 3:
        //         this.image.src = "image/bird3.jpg";
        //         break;
        //     case 4:
        //         this.image.src = "image/bird4.jpg";
        //         break;
        //     default:
        //         break;
        // }
        // this.image.width = this.width;
        // this.image.width = this.height;
        // ctx.drawImage(this.image,this.coordX, this.coordY, this.width, this.height);
        ctx.beginPath();
        ctx.rect(this.coordX, this.coordY, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
      

    } 
   this.move = function(){
        this.coordX -= flyingEnemySpeed;
    }
}

function enemy() {
    this.coordX = myCanvas.width;
    this.width = getRndInteger(enemyMinW, enemyMaxW);
    this.height = getRndInteger(enemyMinH, enemyMaxH);
    this.coordY = myCanvas.height - this.height;
    this.draw  = function(){
                ctx.beginPath();
                ctx.rect(this.coordX, this.coordY, this.width, this.height);
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.closePath();
    }
    this.move = function() {
        this.coordX -= enemySpeed;
    }
}
var main = new mainCharacter();
var enemies = [];

function initEnemy() {
    for(var i = 0; i < maxEnemyNum; i++)
    {
        enemies[i] = new enemy();
        if(i == maxEnemyNum - 1){
            enemies[i] = new flyEnemy();
        }
        if(i != 0)
        {
            enemies[i].coordX = enemies[i-1].coordX + enemies[i-1].width + getRndInteger(minDistance, maxDistance);
        }
    }
    
}

function enemiesRun() {
    for(var i = 0; i < enemies.length;  i++){
        enemies[i].move();
        enemies[i].draw();
      
        if(enemies[i].coordX + enemies[i].width <= 0)
        {
            if(i != maxEnemyNum-1)
                enemies[i] = new enemy();
            else
                enemies[i] = new flyEnemy();
            enemies[i].coordX = enemies[(i == 0)? enemies.length - 1: i-1].coordX + enemies[(i == 0)? enemies.length - 1: i-1].width + getRndInteger(minDistance, maxDistance) ;
            if(enemies[i].coordX < myCanvas.width){
                enemies[i].coordX = myCanvas.width
            }
        }
    }
    
}

function isOver() {
    var mainTL = {
        x: main.coordX,
        y: main.coordY,
    }
    var mainBL = {
        x: main.coordX,
        y: main.coordY + main.height,       
    }
    var mainTR = {
        x: main.coordX + main.width,
        y: main.coordY,
    }
    var mainBR = {
        x: main.coordX + main.width,
        y: main.coordY + main.height,
    }
   
    var mainCo = [mainTR, mainBR, mainTL, mainBL];
    for(var i = 0 ; i < enemies.length; i++ )
    {

        for(var j = 0 ; j < 4 ; j ++){
            if(mainCo[j].x <= enemies[i].coordX + enemies[i].width && mainCo[j].x >= enemies[i].coordX  &&
               mainCo[j].y <= enemies[i].coordY + enemies[i].height  && mainCo[j].y >= enemies[i].coordY )
               return true;
        }
      
    }
    return false;

}

function displayScore(){
    document.getElementById("score").innerHTML ="Score: " +  Math.floor(score);
    document.getElementById("high-score").innerHTML = "High score: " + Math.floor(highScore);
}

function displayGameOver(){
    ctx.font = "50px Consolas";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", 330, myCanvas.height/2 - 30);
    document.getElementById("re-btn").style.display = "block";
}

function initEverthing(){
    document.getElementById('re-btn').style.display = "none";
    main = new mainCharacter();
    initEnemy();
    score = 0;
    blockJumpKey = false;
    frameNo = 0;
    score = 0;
    avaCount = 1;
    enemySpeed = 5; 
    flyingEnemySpeed = 5;
    isDead = false;
    isControl = true;
}


var isMenu = true;
function runGame(){
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    main.move();
    enemiesRun();
    
    main.draw(Math.floor(avaCount));
    requestAnimationFrame(runGame);
    
    if(isOver()){
        isDead = true;
    }
    if(isDead){
        main.draw(5)
        displayGameOver();
        isControl = false;
        enemySpeed = 0;
        flyingEnemySpeed = 0;
    }
    else{
        enemySpeed += 1*0.001;
        flyingEnemySpeed += 1*0.001;
        frameNo++;
        score +=0.1 + frameNo*0.00002;
        if(highScore < score)
            highScore = score;
        displayScore();
        avaCount += 0.1;
        if(avaCount>4)
            avaCount = Math.floor(avaCount)%4 + 1;
    }
    
   
}
initEverthing();
runGame();
