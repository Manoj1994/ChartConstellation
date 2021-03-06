function attr(elem, attr) {
  for(key in attr) {
    var value = attr[key];
    if(value === null) {
      elem.removeAttribute(key);
    } else {
      elem.setAttribute(key, value);
    }
  }
}

function style(elem, style) {
  for(key in style) {
    var value = style[key];
    if(value === null) {
      delete elem.style.removeProperty(key);
    } else {
      elem.style.setProperty(key, value);
    }
  }
}

function appendSVG(parent, name) {
  return parent.appendChild(document.createElementNS("http://www.w3.org/2000/svg", name));
}

function removeAllChilds(parent) {
  while(parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function start() {
  var bubbles = new BubbleSet();
  var rectanglesA = [];
  var rectanglesB = [];
  var main = document.getElementById("main");
  var items = appendSVG(main, "g");
  var pathA = appendSVG(main, "path");
  var pathB = appendSVG(main, "path");
  var debug = appendSVG(main, "g");
  bubbles.debug(false);
  var debugFor = pathA;

  function update() {
    updateOutline(rectanglesA, rectanglesB, "crimson", pathA);
    updateOutline(rectanglesB, rectanglesA, "cornflowerblue", pathB);
  }

  function updateOutline(rectangles, otherRectangles, color, path) {
    var pad = 5;
    var list = bubbles.createOutline(
      BubbleSet.addPadding(rectangles, pad),
      BubbleSet.addPadding(otherRectangles, pad),
      null /* lines */
    );
    // rectangles need to have the form { x: 0, y: 0, width: 0, height: 0 }
    // lines need to have the form { x1: 0, x2: 0, y1: 0, y2: 0 }
    // lines can be null to infer lines between rectangles automatically
    var outline = new PointPath(list).transform([
      new ShapeSimplifier(0.0),
      new BSplineShapeGenerator(),
      new ShapeSimplifier(0.0),
    ]);
    // outline is a path that can be used for the attribute d of a path element
    attr(path, {
      "d": outline,
      "opacity": 0.5,
      "fill": color,
      "stroke": "black",
    });
    if(bubbles.debug() && path === debugFor) {
      removeAllChilds(debug);
      bubbles.debugPotentialArea().forEach(function(r) {
        var rect = appendSVG(debug, "rect");
        attr(rect, {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height
        });
        var color = r.value === r.threshold ? "0, 0, 0" : r.value > 0 ? "150, 20, 20" : "20, 20, 150";
        style(rect, {
          "fill": "rgb(" + color + ")",
          "opacity": r.value === r.threshold ? 0.5 : Math.min(255, Math.abs(r.value * 40)) / 255.0
        });
      });
    }
  };

  function addRect(rectangles, color, cx, cy) {
    var width = 40;
    var height = 30;
    var x = cx - width * 0.5;
    var y = cy - height * 0.5;
    var elem = appendSVG(items, "rect");
    attr(elem, {
      x: x,
      y: y,
      width: width,
      height: height,
    });
    style(elem, {
      "stroke": "black",
      "stroke-width": 1,
      "fill": color,
    });
    rectangles.push({
      x: x,
      y: y,
      width: width,
      height: height,
      elem: elem,
    });
    update();
  }

  main.onclick = function(e) {
    addRect(rectanglesA, "cornflowerblue", e.offsetX, e.offsetY);
  };
  var oldX = Number.NaN;
  var oldY = Number.NaN;
  main.oncontextmenu = function(e) {
    if(oldX === e.offsetX && oldY === e.offsetY) return;
    oldX = e.offsetX;
    oldY = e.offsetY;
    addRect(rectanglesB, "crimson", e.offsetX, e.offsetY);
    e.preventDefault();
  };
}
