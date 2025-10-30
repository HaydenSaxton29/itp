function setup() {
  createCanvas(400, 400);

}

function draw() {
  background(220);
  
  let tileHeight = 100; 
  let tileWidth = 40;
  
  for (let y = 0; y < height; y += tileHeight) {
    for (let x = 0; x < width; x += tileWidth) {
      drawObject(x, y, tileHeight * tileWidth);
    }
  }
}

function drawObject(x, y, s) {
  push(); 
  translate(x, y);
  scale(0.5)
 
  //head
  ellipse(40, 40, 80, 80);
  
  //eyes
  ellipse(30, 40, 20, 20);
  ellipse(50, 40, 20, 20);
  
  //mouth
  line(30, 60, 50, 60);
  
  //body
  rect(30, 80, 20, 80);
 
  //arms
  rect(0, 90, 30, 20);
  rect(50, 90, 30, 20);
  
  //legs
  rect(0, 160, 30, 40);
  rect(50, 160, 30, 40);
  
  pop(); 
}