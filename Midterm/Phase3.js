function setup() {
  createCanvas(400, 400)   
  
  background(260);
}

function drawObject(x, y, s) {
  push();
  translate(x, y);
  scale(s);

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

  function draw() {
    drawObject(0, 0, 1.5);
    drawObject(120, 0, 1.5);
  }