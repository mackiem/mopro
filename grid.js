//function Grid(length, data) {
function Grid(spec) {
  var that, len, rows, cols, data, pf_grid, path;
  var draw_funcs = [];
  that = {};
  cols = (function() {
      return ceil(spec.width/spec.len);
  })();

  len = spec.len;
  rows = ceil(spec.height/spec.len);

  path = [];

  data = new Array(cols);
  for (var i = 0; i < cols; ++i) {
    data[i] = new Array(rows).fill(null).map(() => new spec.data());
    //console.log(this.data[i])
  }

  that.len = len;

  that.populate = function (img) {
    var x, y;
    var matrix = [];
    for (y = 0; y < rows; y += 1) {
      matrix[y] = [];
      for (x = 0; x < cols; x += 1) {
        //console.log(data[x][y])
        var px = img.get(x, y);
        for (var v in px) {
          //console.log(red(px));
        }
        data[x][y].occupied = false;
        if (red(px) < 60) {
            data[x][y].occupied = true;
        }
        matrix[y][x] = (data[x][y].occupied) ? 0 : 1;
      }
    }
    //console.log(matrix)
    pf_grid = new PF.Grid(matrix);
    //img.save('test.png');
  };

  populate_json = function(json) {
    for (var k in json) {
    //for (var i = 0; i < json.length; ++i) {
      var e = json[k];
      if ((typeof e !== "function") && e.x !== undefined && e.y !== undefined) {
        var x = e.x;
        var y = e.y;
        if (data[x][y].goalie) {
          data[x][y].goalie.push(k);
        } else {
          data[x][y].goalie = [k];
        }
      }
    }
    for (k in json) {
      if (k === "draw_in_grid" && (typeof json[k] === "function")) {
          draw_funcs.goalie = json[k];
      }
    }

  };
  that.populate_json = populate_json;

  that.find_path = function(from, to) {
    var grid_clone = pf_grid.clone();
    var finder = new PF.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true
    });
    var path = finder.findPath(from.x, from.y, to.x, to.y, pf_grid);
    pf_grid = grid_clone;
    var path_return = [];
    for (var i = 0; i < path.length; i += 1) {
      var loc = path[i];
      path_return[i] = createVector(loc[0], loc[1]);
      //data[loc[0]][loc[1]].path = true;
    }
    return path_return;

  };

  that.draw = function() {
    strokeWeight(1);
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
          if (data[x][y].goalie) {
            for (var i = 0; i < data[x][y].goalie.length; ++i) {
                draw_funcs.goalie({x: x, y:y, len:len, key:data[x][y].goalie[i]});
            }

          }
          // fill(color(200, 0, 0));
          // if (data[x][y].path) {
          //   rect(x * len, y * len, len, len);
          // }

          // fill(color(200));
          //
          // if (data[x][y].agents.length > 0) {
          //   //console.log(x, y)
          //   ellipse(x * len + len/2, y * len + len/2, len/2, len/2);
          // }
      }
    }

  };

  is_valid = function(pos) {
    if (pos instanceof GPos) {

    }
    var gpos = get_gpos(pos);
    return !(gpos.x < 0 || gpos.y < 0 || gpos.x > cols - 1 || gpos.y > (rows - 1));
  };
  that.is_valid = is_valid;

  get_gpos = function(apos) {
    return createVector(Math.floor(apos.x/len), Math.floor(apos.y/len));
  };
  that.get_gpos = get_gpos;

  get_pos = function(gpos) {
    return createVector(gpos.x * len, gpos.y * len);
  };
  that.get_pos = get_pos;

  // that.is_valid = function(gpos) {
  //   return (gpos.x >= 0 && gpos.x < cols && gpos.y >= 0 && gpos  .x < rows);
  // };

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
