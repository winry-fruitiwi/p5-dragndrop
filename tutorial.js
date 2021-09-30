/*
@author
@date 2021-09-29

Exploring drag and drop with code from
    https://editor.p5js.org/enickles/sketches/H1n19TObz

version comments
    vertex constructor
    create 100 vertices and draw them with .show()
    mousePressed, mouseReleased, contains
    create offset vector whenever mouse clicks the vertex in pressed()
    retrieve x in show() to update our vertex's position while dragging
    mouseMoved, hovering flag


🐞: vertices don't highlight on mouseover when dragging

 */
let font
let vertices = []



function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)

    // now let's get our points out!
    for (let i = 0; i < 100; i++) {
        vertices.push(new Vertex(random(width), random(height), random(10, 25)))
    }

}

function draw() {
    background(209, 80, 30)
    for (let i = 0; i < 100; i++) {
        vertices[i].show(mouseX, mouseY)
    }

}


// if we press our mouse, check all Vertices on the canvas with our current
// (mouseX, mouseY) to see if they've been pressed.
// TODO if there are lots of objects on screen, we can use a quadtree to
//  reduce the number of checks, but since this is O(n) time, it's likely
//  unnecessary.
function mousePressed() { // bug: doesn't coordinate with mouseMoved at all!
    let numPressed = 0;
    for (let vertex of vertices) {
        // oh no... have I been clicked? /scared
        if (vertex.contains(mouseX, mouseY)) {
            // I've been clicked and I'm about to flip my face! - Egloo :D » D:
            // console.log("I've been clicked!!")
            vertex.pressed(mouseX, mouseY)
            numPressed++
        }
    }
    console.log(numPressed)
}


// call all our Vertices and make sure they know nothing's clicking them
function mouseReleased() {
    for (let vertex of vertices) {
        // now we can all get back to relaxing without that bully of a mouse!
        vertex.notPressed()
    }
}


function mouseMoved() {
    /*
      we can check if we're mousing over any rectangle here
      on mouseMoved(), check contains foreach r in rectangles
        if contains:
            set hover to true
        else set hover to false

      in show(), fill transparent if hover is true
     */

    for (let vertex of vertices) {
        if (vertex.contains(mouseX, mouseY)) {
            vertex.hovering = true
        }
        else {
            vertex.hovering = false
        }
        // just so you know, there's this crazy !! operator. Check it out:
        // it simplifies my if-else statement like this! One-line stuff!
        // vertex.hovering = !!vertex.contains(mouseX, mouseY);
        // please re-search this stuff. Info needed.
    }

}

/*
 This circle handles drag and drop. Whenever the mouse clicks within our
  area, an offset vector is created. It points from the center of our vertex
  to our mouseX, mouseY point.

  When dragging, we use this offset to calculate how the vertex's show
   method displays it.
 */
class Vertex {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r

        // offsets help us calculate where to display our vertex while
        // we're dragging it, since our mouse coordinates constantly update.
        // we want the difference vector between the center of our circle and
        // and the point where our mouse clicked to start dragging
        this.offsetX = 0
        this.offsetY = 0
        this.dragging = false

        this.hovering = false
    }

    // (x, y) refers to pointer_x and pointer_y, the coordinates of the
    // mouse dragging; this method will be called as show(mouseX, mouseY)
    show(x, y) {
        fill(100, 20)
        stroke(255)

        // have I been clicked? /scared
        if (this.dragging) {
            // we need an offset so we can display where we
            // really were earlier and where the mouse really is. So, we
            // can't absolutely set this.x to x, we have to have a modifier
            // to help us detect where we were originally.
            // see comment where the offsets are for explanation

            this.x = x - this.offsetX
            this.y = y - this.offsetY
        }

        if (this.hovering) {
            fill(100, 10)
        }

        circle(this.x, this.y, this.r*2)
    }

    // this is called on every Vertex on the canvas. we want to check if the
    // mouse is within our vertex, and if so, update our offsets. the offset
    // is the vector from the origin to the point where the mouse clicked.
    pressed(x, y) {
        this.offsetY = y - this.y
        this.offsetX = x - this.x
        this.dragging = true;
    }

    // this should be called for every Vertex on the canvas whenever the
    // mouseReleased() event fires. we set our dragging flag to false :)
    notPressed(x, y) {
        this.dragging = false
    }
    // a simple "does our Vertex area contain the point where the mouse
    // clicked" boolean function
    contains(x, y) {
        // don't forget the this dots!
        let d = dist(x, y, this.x, this.y)
        return d < this.r
    }
}
