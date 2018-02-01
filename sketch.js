var x = 0

function rad(deg) {
  return deg * Math.PI/180.0;
}

function mydata() {
  this.agents = []
  this.goals = []
  this.some_custom_thing = []
}

var agent;
var grid;

function setup() {
  createCanvas(600, 400)
  //drawingContext.shadowOffsetX = 5;
  //drawingContext.shadowOffsetY = -5;
  //drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = "black";
  background(200);
  //ellipse(width/2, height/2, 50, 50);
  line(15, 25, 70, 90);
  //console.log(Math.cos(rad(180)))
  //console.log(20+20 * Math.cos(rad(60)));
  var len = 100;
  var s_x = 0;
  var s_y = 0;

  grid = new Grid(20, mydata)

  var id = 0;
  agent = new Agent(s_x, s_y, len, 5, grid, id);
  //grid.draw()
  //triangle(20, 20, 50, 30, 40, 40)
}

function draw() {
  // put drawing code here
    //ellipse(x, height/2, 20, 20);
    //x += 1

    background(200);
    grid.draw();
    agent.move(createVector(0, 1, 0));
    agent.display();

}

function Grid(len, data) {
  this.len = len;
  this.cols = ceil(width/len);
  this.rows = ceil(height/len)
  this.data = new Array(this.cols);
  for (var i = 0; i < this.cols; ++i) {
    this.data[i] = new Array(this.rows).fill(null).map(() => new data());
    //console.log(this.data[i])
  }

  // for (var y = 0; y < height; y += this.len) {
  //   for (var x = 0; x < width; x += this.len) {
  //
  //   }
  // }

}

Grid.prototype.draw = function() {
  strokeWeight(4)
  stroke(51)
  for (var y = 0; y < height; y += this.len) {
    line(0, y, width, y)
  }
  for (var x = 0; x < width; x += this.len) {
    line(x, 0, x, height)
  }


  for (var y = 0; y < this.rows; y += 1) {
    for (var x = 0; x < this.cols; x += 1) {
        //console.log(this.data[x][y])
        if (this.data[x][y].agents.length > 0) {
          //console.log(x, y)
          ellipse(x * this.len + this.len/2, y * this.len + this.len/2, this.len/2, this.len/2);
        }
    }
  }
}

Grid.prototype.get_gpos = function(apos) {
  return createVector(Math.floor(apos.x/this.len), Math.floor(apos.y/this.len))
}

Grid.prototype.is_valid = function(gpos) {
  return (gpos.x >= 0 && gpos.x < this.cols && gpos.y >= 0 && gpos.x < this.rows);
}

Grid.prototype.update_pos = function(prev_pos, curr_pos, entity) {

  var prev = this.get_gpos(prev_pos);
  var curr = this.get_gpos(curr_pos);

  if (prev.dist(curr) < 1e-6) return;

  entity.rm_from_grid(this.data[prev.x][prev.y]);
  entity.add_to_grid(this.data[curr.x][curr.y]);

}

Grid.prototype.place = function(pos, entity) {
  var curr = this.get_gpos(pos);
  entity.add_to_grid(this.data[curr.x][curr.y]);
}

// function Agent (n_funcs,waypoint_funcs, grid) {
//     this.grid = grid;
//     this.n_funcs = n_funcs;
//     this.waypoint_funcs = waypoint_funcs;
// }
//
// Agent.prototype.think() {
//
// }

class Agent {
  //var sx, sy, len, dt, radius;
  //p5.Vector pos;

  constructor(sx, sy, len, radius, grid, id) {
    this.sx = sx;
    this.sy = sy;
    this.len = len;
    this.dt = 0.3;
    this.radius = radius;
    this.pos = createVector(0, 0, 0);
    this.grid = grid;
    this.id = id;
    this.grid.place(this.pos, this);
    this.gpos = grid.get_gpos(this.pos);
  }

  rm_from_grid(data) {
    for (var i = 0; i < data.agents.length; ++i) {
      if (data.agents[i].id === this.id) {
        data.agents.splice(i, 1);
        break;
      }
    }
  }

  add_to_grid(data) {
    data.agents.push(this);
  }

  move(v) {
    //console.log(v)
    var prev = Object.assign({}, this.pos);
    this.pos = this.pos.add(v.mult(this.dt));
    this.grid.update_pos(prev, this.pos, this);

    if (prev.dist(this.pos) > 1e-6)
      console.log(this.pos)
  }

  display() {
    push()
    translate(this.pos.x, this.pos.y);
    var tx = this.sx + this.len * Math.cos(rad(60));
    var ty = this.sy + this.len * Math.sin(rad(60));
    triangle(this.sx, this.sy, tx, ty, this.sx + this.len, this.sy);
    ellipse(tx, ty, this.len *.3, this.len *.3)
    pop()
  }
}
