class Boundary {
  constructor(x, y, w, h, label) {
    let options = {
      friction: 0.3,
      restitution: 0,
      isStatic: true,
      label: label,
    };
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    Composite.add(world, this.body);
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    fill(0);
    noStroke();
    rect(0, 0, this.w, 2 * this.h);
    pop();
  }
}
