var x = 0;
var img;
function rad(deg) {
  return deg * Math.PI/180.0;
}

function mydata() {
  this.agents = [];
  this.goals = [];
  this.some_custom_thing = [];
}

var agents_json =
  [
    {
      "name" : "me",
    "goals" : [0, 1, 2]
  },
  {
    "name" : "you",
  "goals" : [0, 2]
  }

  ];

var agents = [];
var grid;
var img_name = "x-map.bmp";

function preload() {
  img = loadImage(img_name);
}

function setup() {
  createCanvas(600, 400);



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

  grid = new Grid({width: width, height : height, len : width / img.width, data : mydata});
  grid.populate(img);
  grid.find_path(createVector(4, 3), createVector(25, 5));

  var num = 3;
  for (var id = 0; id < num; ++id) {
    agents.push(new Agent(random(width), random(height), len, 5, grid, id));
  }
  // img.write("test.png");


  //grid.draw()
  //triangle(20, 20, 50, 30, 40, 40)
}

function draw() {
  // put drawing code here
    //ellipse(x, height/2, 20, 20);
    //x += 1

    background(200);
    grid.draw();

    for (var id = 0; id < agents.length; ++id) {
      var agent = agents[id];
      agent.move(createVector(0, 0, 0));
      //agent.display();
    }
    //image(img, 10, 10);
}

//function Grid(length, data) {
function Grid(spec) {
  var that, len, rows, cols, data, pf_grid;

  that = {};
  cols = (function() {
      return ceil(spec.width/spec.len);
  })();

  len = spec.len;
  rows = ceil(spec.height/spec.len);


    data = new Array(cols);
    for (var i = 0; i < cols; ++i) {
      data[i] = new Array(rows).fill(null).map(() => new spec.data());
      //console.log(this.data[i])
    }


  that.populate = function (img) {
    var x, y;
    var matrix = [];
    for (y = 0; y < rows; y += 1) {
      matrix[y] = [];
      for (x = 0; x < cols; x += 1) {



        //console.log(data[x][y])
        var px = img.get(x, y);
        for (var v in px) {
          console.log(red(px));
        }
        data[x][y].occupied = false;
        if (red(px) < 60) {
            data[x][y].occupied = true;
        }
        matrix[y][x] = (data[x][y].occupied) ? 0 : 1;
      }
    }
    console.log(matrix)
    pf_grid = new PF.Grid(matrix);
    //img.save('test.png');
  };

  that.find_path = function(from, to) {
    var grid_clone = pf_grid.clone();
    var finder = new PF.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true
    });
    var path = finder.findPath(from.x, from.y, to.x, to.y, pf_grid);
    pf_grid = grid_clone;
    for (var i = 0; i < path.length; i += 1) {
      var loc = path[i];
      data[loc[0]][loc[1]].path = true;
    }
    return path;

  };

  that.draw = function() {
    strokeWeight(4);
    stroke(51);

    var x, y;
    for (y = 0; y < height; y += len) {
      line(0, y, width, y);
    }
    for (x = 0; x < width; x += len) {
      line(x, 0, x, height);
    }


    for (y = 0; y < rows; y += 1) {
      for (x = 0; x < cols; x += 1) {
          //console.log(data[x][y])

          var c = color(88, 188, 67);
          fill(c);
          if (data[x][y].occupied) {
            rect(x * len, y * len, len, len);
          }
          fill(color(200, 0, 0));
          if (data[x][y].path) {
            rect(x * len, y * len, len, len);
          }
          if (x === 4 && y === 3) {
            rect(x * len, y * len, len, len);
          }

          fill(color(200));

          if (data[x][y].agents.length > 0) {
            //console.log(x, y)
            ellipse(x * len + len/2, y * len + len/2, len/2, len/2);
          }
      }
    }

  };

  get_gpos = function(apos) {
    return createVector(Math.floor(apos.x/len), Math.floor(apos.y/len));
  };
  that.get_gpos = get_gpos;

  that.is_valid = function(gpos) {
    return (gpos.x >= 0 && gpos.x < cols && gpos.y >= 0 && gpos.x < rows);
  };

  that.update_pos = function(prev_pos, curr_pos, entity) {

    var prev = get_gpos(prev_pos);
    var curr = get_gpos(curr_pos);

    if (prev.dist(curr) < 1e-6) return;

    entity.rm_from_grid(data[prev.x][prev.y]);
    entity.add_to_grid(data[curr.x][curr.y]);

  };

  that.place = function(pos, entity) {
    var curr = get_gpos(pos);
    entity.add_to_grid(data[curr.x][curr.y]);
  };


  return that;

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

  constructor(px, py, len, radius, grid, id) {
    this.sx = 0;
    this.sy = 0;
    this.len = len;
    this.dt = 0.3;
    this.radius = radius;
    this.pos = createVector(px, py);
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
    //let prev = Object.assign({}, this.pos);
    var prev = createVector(this.pos.x, this.pos.y);
    this.pos = this.pos.add(v.mult(this.dt));
    this.grid.update_pos(prev, this.pos, this);

    if (prev.dist(this.pos) > 1e-6)
      console.log(this.pos);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    var tx = this.sx + this.len * Math.cos(rad(60));
    var ty = this.sy + this.len * Math.sin(rad(60));
    triangle(this.sx, this.sy, tx, ty, this.sx + this.len, this.sy);
    ellipse(tx, ty, this.len * 0.3, this.len * 0.3);
    pop();
  }
}
