
Agent = function (spec) {
  //var sx, sy, len, dt, radius;
  //p5.Vector pos;
  var that, sx, sy, len, radius, pos, grid, id, gpos, data, goals;
  //var path = [];

  sx = spec.grid.len * 0.3;
  sy = spec.grid.len * 0.3;
  len = spec.len;
  radius = spec.radius;
  pos = spec.start_pos;
  grid = spec.grid;
  vel = createVector(0, 0);

  id = spec.id;
  gpos = grid.get_gpos(pos);
  data = spec.data;
  goals = spec.goals;
  path = [];
  max_speed = spec.max_speed || 2;

  // constructor(px, py, len, radius, grid, id) {
  //   this.sx = 0;
  //   this.sy = 0;
  //   this.len = len;
  //   this.dt = 0.3;
  //   this.radius = radius;
  //   this.pos = createVector(px, py);
  //   this.grid = grid;
  //   this.id = id;
  //   this.grid.place(this.pos, this);
  //   this.gpos = grid.get_gpos(this.pos);
  // }
  that = {};
  that.id = id;
  //that.path = [];

  that.rm_from_grid = function(data) {
    for (var i = 0; i < data.agents.length; ++i) {
      if (data.agents[i].id === id) {
        data.agents.splice(i, 1);
        break;
      }
    }
  };

  that.add_to_grid = function(data) {
    data.agents.push(that);
  };

  has_reached_waypoint = function() {
    if (path.length > 0) {
      var epsilon = 1;
      var gpos = grid.get_gpos(pos);
      if (pos.dist(grid.get_pos(path[0])) < epsilon) {
        return true;
      }
    }
    return false;
  };

  path_exists = function() {
    return (path.length > 0);
  };
  that.path_exists = path_exists;

  get_path_vector = function() {
    var path_vec = createVector(0, 0);
    if (path_exists()) {
      path_vec = p5.Vector.sub(grid.get_pos(path[0]), pos);
    }
    return path_vec;
  };
  that.get_path_vector = get_path_vector;

  update_path = function() {
    var those = this;
    if (!is_finished()) {
      if (!path_exists()) {
          path = grid.find_path(grid.get_gpos(pos), goals[0].pos);
          if (!path_exists()) {
            // we're at a place, where we can't reach the next goals
            // so disregard next goal?
            goals.shift();
          }
      } else {
        if (has_reached_waypoint()) {
          path.shift();
          if (!path_exists()) {
            goals.shift();
          }
        }
      }
    }
  };

  that.update_path = update_path;

  is_finished = function() {
    return (goals.length == 0);
  };

  that.move = function(v) {
    //console.log(v)
    //let prev = Object.assign({}, pos);
    var prev = createVector(pos.x, pos.y);
    var t = p5.Vector.mult(v, Sim.dt);
    if (t.mag() > max_speed) {
      t.normalize();
      t.mult(max_speed);
    }
    pos.add(t);
    vel = t;
    if (valid(pos)) {
      //console.log(grid.get_gpos(pos));
      grid.update_pos(prev, pos, that);
    }

    // if (prev.dist(pos) > 1e-6)
    //   console.log(pos);
  };

  // function
  function valid(pos) {
    return grid.is_valid(pos);
  }

  var x = 0;

  that.display = function() {
    push();
    fill('#FF0000');

    translate(pos.x, pos.y);
    translate(0.5 * grid.len, 0.5 * grid.len);
    if (goals.length > 0) {
        text("to : " + goals[0].name);
    }
    //text("(" + Math.round(pos.x) + "," + Math.round(pos.y) + ")", sx, sy + 10);
    text("goals : " + goals.length, sx, sy);
    //rotate(x);
    rotate(vel.heading() - PI/2.0);
    translate(-2 *sx , -2 * sy + 0.5 * grid.len);

    x+= 0.1;

    //translate(sx, sy);
    //translate(sx, sy);
    var tx = sx + len * Math.cos(rad(60));
    var ty = sy + len * Math.sin(rad(60));
     triangle(sx, sy, tx, ty, sx + len, sy);
     ellipse(tx, ty, len * 0.3, len * 0.3);
    //ellipse(sx + grid.len * 0.5, sy + grid.len * 0.5, grid.len *0.5, grid.len *0.5);
    fill("#000000");
    var mul = 10;
    //line(sx, sy, sx + vel.x * mul, sy + vel.y * mul);

    pop();
  };

  grid.place(pos, that);
  return that;
};
