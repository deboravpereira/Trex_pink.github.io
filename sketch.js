
//Estados de jogo
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Personagem trx e chão
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

//Nuvens e obstáculos
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//Pontuação
var score;

//Ícone e sons
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);//<<==
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-50,width,20);//<<==
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  
  gameOver = createSprite(width/2,height/2);//<<==
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(width/2,height/2+40);//<<==
  restart.addImage(restartImg);
  restart.scale = 0.5;
   
  invisibleGround = createSprite(width/2,height-30,width,10);//<<==
  invisibleGround.visible = false;
  
  //criar Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);

  strokeWeight(2);
  stroke("black");
  fill("pink");
  textSize(20)
  text("TREX Corredor", width/20,height/8);
  text("Editado por Débora Pereira", width/20,height/6);

  //exibir pontuação
  textSize(15)
  stroke("black");
  fill("pink");
  text("Pontuação: "+ score, width-150,height/8);//<<==
    
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    
    //Acumulo de pontos
    score = score + Math.round(getFrameRate()/60);
    
    //Som a cada 100 pontos
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //Reconfigurar solo infinito
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    //pular se tela for tocada //<<==
    if(touches.length > 0 && trex.y >= height-170) { //<<===
      trex.velocityY = -12;
      jumpSound.play();
      touches = [];//<<===
      touches.push({x:0,y:0,id:0});//<<===
    }

    //pular quando barra de espaço é pressionada
    if(keyDown("space")&& trex.y >= height-170) { //<<===
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12; IA
        //jumpSound.play(); IA
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //mudar a animação de trex
      trex.changeAnimation("collided", trex_collided);
      
      ground.velocityX = 0;
      trex.velocityY = 0;

      if(touches.length>0 || mousePressedOver(restart)) {//<<==
        touches = [];//<<==
        reset();
      }
        
      //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruídos
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
     
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //impedir que trex caia
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){

  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);

  score = 0;

}


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(width+20,height-60,10,40);//<<==
   obstacle.velocityX = -(6 + score/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir dimensão e tempo de vida ao obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //acrescentar cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escrever código aqui para gerar nuvens
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+10,height/8,40,10);//<<==
    cloud.y = Math.round(random(height/8,height/8+60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir tempo de vida à variável
    cloud.lifetime = width+10/cloud.velocityX;//<<==
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //acrescentar cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}

