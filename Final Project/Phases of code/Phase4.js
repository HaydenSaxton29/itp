
let synth;
let reverb;
let reverbWet = 0.3;
let steps = [];
let currentStep = 0;
let isPlaying = false;
let bpm = 120;
let lastStepTime = 0;
let activeKnob = null; // Track which knob is being dragged
let reverbKnobActive = false;

function setup() {
  createCanvas(1200, 400);
  
  // Initialize reverb
  reverb = new Tone.Reverb({
    decay: 2.5,
    wet: reverbWet
  }).toDestination();
  
  // Initialize Tone.js synth
  synth = new Tone.MonoSynth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.5 },
    filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 1, baseFrequency: 200, octaves: 4 }
  }).connect(reverb);
  
  
  
  
  // Initialize 16 steps
  for (let i = 0; i < 16; i++) {
    steps.push({
      active: true,
      pitch: 36, // MIDI note (C4)
      decay: 0.2,
      x: 50 + i * 70,
      y: 80
    });
  }
}

function draw() {
  background(6, 4, 3);
  
  // Title
  fill(200, 135, 86);
  textSize(20);
  textAlign(LEFT);
  text("16-Step Monosynth Sequencer", 20, 30);
  
  // BPM display
  textSize(14);
  text("BPM: " + bpm, 20, 55);
  
  // Play/Stop button
  fill(isPlaying ? 200 : 254, 239, 197);
  rect(950, 20, 80, 30, 5);
  fill(0);
  textAlign(CENTER);
  text(isPlaying ? "STOP" : "PLAY", 990, 42);
  
  // Clear button
  fill(254, 239, 197);
  rect(1050, 20, 80, 30, 5);
  fill(0);
  text("CLEAR", 1090, 42);
  
  // Randomize button
  fill(254, 239, 197);
  rect(850, 20, 80, 30, 5);
  fill(0);
  text("RANDOM", 890, 42);
  
  // Reverb wet knob
  drawKnob(750, 12, 40, reverbWet, 0, 1, "REV");
  fill(200, 135, 86);
  textSize(10);
  textAlign(CENTER);
  text("WET", 770, 70);
  
  // Handle sequencer timing
  if (isPlaying) {
    let stepInterval = (60000 / bpm) / 4; // 16th notes
    if (millis() - lastStepTime >= stepInterval) {
      playStep(currentStep);
      currentStep = (currentStep + 1) % 16;
      lastStepTime = millis();
    }
  }
  
  // Draw steps and controls
  for (let i = 0; i < 16; i++) {
    let s = steps[i];
    
    // Step button
    if (i === currentStep && isPlaying) {
      fill(104, 121, 210);
    } else if (s.active) {
      fill(38, 180, 32);
    } else {
      fill(254, 82, 60);
    }
    rect(s.x, s.y, 50, 50, 5);
    
    // Step number
    fill(255);
    textSize(12);
    textAlign(CENTER);
    text(i + 1, s.x + 25, s.y + 30);
    
    // Pitch knob
    drawKnob(s.x + 0, s.y + 100, 60, s.pitch, 50, 84, "P");
    
    // Decay knob
    drawKnob(s.x + 0, s.y + 200, 60, s.decay, 0.1, 2.0, "D");
  }
  
  // Labels
  textAlign(LEFT);
  textSize(14);
  fill(231, 141, 60);
  text("PITCH", 20, 170);
  text("DECAY", 20, 270);
}

function drawKnob(x, y, size, value, minVal, maxVal, label) {
  // Knob background
  fill(34, 28, 30);
  circle(x + size/2, y + size/2, size);
  
  // Knob indicator
  let angle = map(value, minVal, maxVal, -135, 135);
  let rad = radians(angle);
  let x2 = x + size/2 + cos(rad) * (size/2 - 5);
  let y2 = y + size/2 + sin(rad) * (size/2 - 5);
  
  stroke(211, 135, 78);
  strokeWeight(3);
  line(x + size/2, y + size/2, x2, y2);
  noStroke();
  
  // Label
  fill(150);
  textSize(10);
  textAlign(CENTER);
  text(label, x + size/2, y + size + 15);
}

function mousePressed() {
  // Play/Stop button
  if (mouseX > 950 && mouseX < 1030 && mouseY > 20 && mouseY < 50) {
    isPlaying = !isPlaying;
    if (isPlaying) {
      Tone.start();
      currentStep = 0;
      lastStepTime = millis();
    }
    return;
  }
  
  // Clear button
  if (mouseX > 1050 && mouseX < 1130 && mouseY > 20 && mouseY < 50) {
    for (let s of steps) {
      s.active = false;
    }
    return;
  }
  
  // Randomize button
  if (mouseX > 850 && mouseX < 930 && mouseY > 20 && mouseY < 50) {
    for (let s of steps) {
      s.pitch = floor(random(36, 85)); // Random pitch
      s.decay = random(0.1, 2.0); // Random decay
    }
    return;
  }
  
  // Reverb wet knob
  if (dist(mouseX, mouseY, 770, 32) < 20) {
    reverbKnobActive = true;
    return;
  }
  
  // Check for knob clicks first
  for (let i = 0; i < 16; i++) {
    let s = steps[i];
    
    // Pitch knob
    let pitchX = s.x + 15;
    let pitchY = s.y + 100;
    if (dist(mouseX, mouseY, pitchX + 15, pitchY + 15) < 15) {
      activeKnob = { step: i, type: 'pitch' };
      return;
    }
    
    // Decay knob
    let decayX = s.x + 10;
    let decayY = s.y + 200;
    if (dist(mouseX, mouseY, decayX + 15, decayY + 15) < 15) {
      activeKnob = { step: i, type: 'decay' };
      return;
    }
  }
  
  // Step buttons (only if no knob was clicked)
  for (let i = 0; i < 16; i++) {
    let s = steps[i];
    if (mouseX > s.x && mouseX < s.x + 50 && mouseY > s.y && mouseY < s.y + 50) {
      s.active = !s.active;
    }
  }
}

function mouseDragged() {
  if (reverbKnobActive) {
    let delta = -(mouseY - pmouseY);
    reverbWet = constrain(reverbWet + delta * 0.01, 0, 1);
    reverb.wet.value = reverbWet;
  } else if (activeKnob) {
    let s = steps[activeKnob.step];
    let delta = -(mouseY - pmouseY);
    
    if (activeKnob.type === 'pitch') {
      s.pitch = constrain(s.pitch + delta * 0.5, 36, 84);
    } else if (activeKnob.type === 'decay') {
      s.decay = constrain(s.decay + delta * 0.01, 0.1, 2.0);
    }
  }
}

function mouseReleased() {
  activeKnob = null;
  reverbKnobActive = false;
}

function playStep(stepIndex) {
  let s = steps[stepIndex];
  if (s.active) {
    let freq = Tone.Frequency(s.pitch, "midi").toFrequency();
    synth.filterEnvelope.decay = s.decay;
    synth.triggerAttackRelease(freq, "16n");
  }
}

function keyPressed() {
  // Spacebar to play/stop
  if (key === ' ') {
    isPlaying = !isPlaying;
    if (isPlaying) {
      Tone.start();
      currentStep = 0;
      lastStepTime = millis();
    }
  }
  
  // Arrow keys to adjust BPM
  if (keyCode === UP_ARROW) {
    bpm = min(bpm + 5, 240);
  } else if (keyCode === DOWN_ARROW) {
    bpm = max(bpm - 5, 40);
  }
}