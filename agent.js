
Agent = function (spec) {
  //var sx, sy, len, dt, radius;
  //p5.Vector pos;
  var that, sx, sy, len, radius, pos, grid, id, gpos, data;
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
  //this.goals = spec.goals;
  //path = [];
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
  that.path = [];
  that.goals = spec.goals;
  that.radius = spec.radius;
  that.pos = pos;
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
    if (that.path.length > 0) {
      var epsilon = 5;
      var gpos = grid.get_gpos(pos);
      if (pos.dist(grid.get_pos(that.path[0])) < epsilon) {
        return true;
      }
    }
    return false;
  };
  that.has_reached_waypoint = has_reached_waypoint;

  path_exists = function() {
    var v = that.path.length > 0;
    return v;
  };
  that.path_exists = path_exists;

  get_path_vector = function() {
    var path_vec = createVector(0, 0);
    if (that.path.length > 0) {
      path_vec = p5.Vector.sub(grid.get_pos(that.path[0]), pos);
    }
    return path_vec;
  };
  that.get_path_vector = get_path_vector;

  that.set_path = function(path) {
    that.path = path;
  };

  update_path = function() {
    var those = this;
    if (!(that.is_finished())) {
      if (!(that.path_exists())) {
          var from = grid.get_gpos(pos);
          //grid.is_valid_gpos(from)
          that.path = grid.find_path(from, that.goals[0].pos);

          if (!(that.path_exists())) {
            // we're at a place, where we can't reach the next goals
            // so disregard next goal?
            that.goals.shift();
          }
      } else {
        if (that.has_reached_waypoint()) {
          that.path.shift();
          if (!(that.path_exists())) {
            that.goals.shift();
          }
        }
      }
    }
  };

  that.update_path = update_path;

  is_finished = function() {
    return (that.goals.length == 0);
  };
  that.is_finished = is_finished;

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
      var gpos = grid.get_gpos(pos);
      if (gpos.y > (grid.rows - 1)) {
          console.log(gpos);
      }

      grid.update_pos(prev, pos, that);
    } else {
      pos = prev;
    }

    // if (prev.dist(pos) > 1e-6)
    //   console.log(pos);
  };

  // function
  function valid(pos) {
    return grid.is_valid(pos);
  }


  that.display = function() {
    push();


    translate(pos.x, pos.y);
    translate(0.5 * grid.len, 0.5 * grid.len);
    fill('#000000');
    if (that.goals.length > 0) {
        text("to : " + that.goals[0].name, sx, 0.5 * grid.len + sy);
    }
    //text("(" + Math.round(pos.x) + "," + Math.round(pos.y) + ")", sx, sy + 10);
    text("goals : " + that.goals.length, sx, sy);
    //rotate(x);
    fill('#FF0000');
    rotate(vel.heading() - PI/2.0);
    translate(-2 *sx , -2 * sy + 0.5 * grid.len);


    //translate(sx, sy);
    //translate(sx, sy);
    var tx = sx + len * Math.cos(rad(60));
    var ty = sy + len * Math.sin(rad(60));
     triangle(sx, sy, tx, ty, sx + len, sy);
     ellipse(tx, ty, len * 0.3, len * 0.3);
     noFill();
     stroke('#FF0000');
     ellipse((sx + tx + sx + len) / 3, (sy + ty + sy) / 3, radius, radius);
    //ellipse (sx + grid.len * 0.5, sy + grid.len * 0.5, grid.len *0.5, grid.len *0.5);
    fill("#000000");
    var mul = 10;
    //line(sx, sy, sx + vel.x * mul, sy + vel.y * mul);

    pop();
  };

  grid.place(pos, that);
  return that;
};
