class Template {
  constructor(path) {
    this.path = path;
    this.vertices = this.letterOutline();
    this.options = {
      friction: 0.4,
      restitution: 0.3,
    };
  }

  letterOutline() {
    var points = {};
    var uniquePointsStr = "";

    for (var j = 0; j < this.path.length; j++) {
      var pointKey = `x${this.path[j].x}y${this.path[j].y}`;

      if (!points[pointKey]) {
        points[pointKey] = true;
        uniquePointsStr += `${this.path[j].x * fontScale} ${
          this.path[j].y * fontScale
        } `;
      }
    }

    return Vertices.fromPath(uniquePointsStr);
  }
}
