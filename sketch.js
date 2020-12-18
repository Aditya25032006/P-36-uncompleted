//Create variables here
var dog,DogImg;
var happyDog;
var database;
var foodS;
var foodStock;
var lastFed;
var changeState;
var readState;

var bedroomImg , gardenImg , washrommImg ;

function preload()
{
  //load images here
  DogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");

  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washrommImg = loadImage("images/Wash Room.png");

}

function setup() {
  createCanvas(1100, 500);
  
  database = firebase.database();

  foodObj = new Food(); 

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(850,250,1,1);
  dog.addImage(DogImg)
  dog.scale=0.3;
  
  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food"); 
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })


}

function draw() {  
  background(46,139,87);
  foodObj.display();

  

  fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("Last Feed : "+lastFed%12 + "PM",350,30);
}else if(lastFed==0){
  text("Last Feed : 12 AM",350,30);
} else{
  text("Last Feed : "+lastFed + "AM",350,30);
}

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
  

  

  currentTime=hour();
  if(currentTime ==(lastFed)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();

  }else {
    feed.show();
    addFood.show();
    dog.addImage(DogImg);
  }

textSize(20);
  stroke(4);
  fill("white");
drawSprites();
text("FoodStock :"+foodS,175,100)
}

function writeStock(x) {

  if(x<=0){
    x = 0;
  }else{x=x-1;
  }

  database.ref('/').update({
    Food : x
  })
}


function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}



function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}