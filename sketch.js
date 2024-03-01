let Engine, Composite, World, Vertices, Body, Bodies, Runner, Events;
let font;
var fontScale = 3;
var fontSize;
var letterSpacing = fontSize * 4;
let grounds = [];
let bounds;
let engine, world, runner;
let titleStartingX = 0;
let wordX = [];
let titleStartingY;
var titleTxtWidth = 0;
var splitTxt;
var collidedLetters = new Set();

var fps = 30;

var letterTemplates = {};
var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&,";
let txt = ["DESIGNER", "CREATIVE TECHNOLOGIST", "VISUAL STORYTELLER"];
// var letters = "abcdefghijklmnoqprstuvwxyz&";
// let txt = "designer & creative developer";
var totalChars = 1;
var instructionText = "scroll";
var script = [];
var startSketch = false;
var showText = true;

window.addEventListener("message", (event) => {
  if (
    event.origin === "http://localhost:3000" ||
    "https://soumyakarwa.github.io/new-portfolio/"
  ) {
    if (event.data === "startSketch") {
      Runner.run(runner, engine);
      showText = false;
    }
  }
});

function preload() {
  (Engine = Matter.Engine),
    (Composite = Matter.Composite),
    (Vertices = Matter.Vertices),
    (Runner = Matter.Runner),
    (Bodies = Matter.Bodies),
    (Body = Matter.Body),
    (Events = Matter.Events);
  font = loadFont("./assets/fonts/Geist/Geist-Regular.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);
  textHelper();
  engine = Engine.create();
  engine.positionIterations = 10;
  world = engine.world;
  runner = Runner.create();
  createTitle();
  createBoundary();
  world.gravity.y = 2;
}

function textHelper() {
  let rootStyle = getComputedStyle(document.documentElement);
  fontSize = rootStyle.getPropertyValue("--font-size");
  textFont(font);
  textSize(fontSize * fontScale);
  txt.forEach((word, i) => {
    wordX[i] = width / 2 - textWidth(word) / 2 + textWidth(word[0]) / 3;
  });
  titleStartingX = wordX[0];
  titleStartingY = 2 * fontSize;
}

function createTitle() {
  [...letters].forEach((letter) => {
    letterTemplates[letter] = new Template(
      font.textToPoints(letter, 0, 0, fontSize, {
        sampleFactor: 20,
        simplifyThreshold: 0,
      })
    );
  });
  var space = 0;
  txt.forEach((word) => {
    [...word].forEach((char) => {
      if (char === " ") {
        titleStartingX += 25;
        return;
      }
      script.push(
        new Letter(
          world,
          titleStartingX,
          titleStartingY,
          letterTemplates[`${char}`],
          totalChars
        )
      );
      totalChars++;
      titleStartingX += textWidth(char);
    });
    space++;
    titleStartingX = wordX[space];
    titleStartingY += fontScale * fontSize;
  });
}

function createBoundary() {
  grounds.push(new Boundary(0, height / 2, 10, height, "barrier"));
  grounds.push(new Boundary(width, height / 2, 10, height, "barrier"));
  grounds.push(new Boundary(width / 2, height, width, 10, "barrier"));

  Composite.add(world, grounds);
}

function applyAirResistance() {
  let airDensity = 0.000000005; // Adjust this value to control the effect of air resistance

  Composite.allBodies(world).forEach((body) => {
    let velocity = body.velocity;
    let speed = Matter.Vector.magnitude(velocity);
    let dragCoefficient = random(0, airDensity) * speed * speed; // Calculate the drag force magnitude

    // Calculate the drag force vector
    let dragForce = Matter.Vector.mult(velocity, -dragCoefficient);

    Body.applyForce(body, body.position, dragForce);
  });
}

function checkCollision() {
  Events.on(engine, "collisionStart", function (event) {
    var pairs = event.pairs;

    pairs.forEach(function (pair) {
      var bodyA = pair.bodyA;
      var bodyB = pair.bodyB;

      if (bodyA.label === "barrier" && bodyB.label === "letter") {
        adjustBodyProperties(bodyB);
      } else if (bodyB.label === "barrier" && bodyA.label === "letter") {
        adjustBodyProperties(bodyA);
      }

      var letterID =
        pair.bodyA.label === "letter" ? pair.bodyA.id : pair.bodyB.id;
      var barrierBody =
        pair.bodyA.label === "barrier" ? pair.bodyA : pair.bodyB;

      collidedLetters.add(letterID);
      if (collidedLetters.size === totalChars - 1) {
        barrierBody.restitution = 0;
        barrierBody.friction = 1;
      }
    });
  });
}

function adjustBodyProperties(body) {
  body.restitution = 0.1;
  body.friction = 0.9;
  Body.setVelocity(body, { x: 0, y: 0 });
  Body.setAngularVelocity(body, 0);
}

function draw() {
  background(255);
  applyAirResistance();
  script.forEach((char) => {
    char.show();
  });
  // grounds.forEach((g) => {
  //   g.show();
  // });
  grounds[2].show();
  checkCollision();
  yoffset = sin(frameCount * 0.15) * 5;

  // textSize(fontSize * fontScale);
  // text(txt, width / 2 - textWidth(txt) / 2, 200);

  if (showText) {
    textSize(12);
    text(
      instructionText,
      width / 2 - textWidth(instructionText) / 2,
      height - 150 + yoffset
    );
  }
  textSize(fontScale * fontSize);
  // ellipse(width / 2 - textWidth(splitTxt[0]) / 2, 100, 5, 5);
  // ellipse(width / 2 - textWidth(splitTxt[1]) / 2, 200, 5, 5);
  // ellipse(width / 2 - textWidth(splitTxt[2]) / 2, 300, 5, 5);
  // ellipse(width / 2 - textWidth(splitTxt[3]) / 2, 400, 5, 5);
  fill(0);
}
