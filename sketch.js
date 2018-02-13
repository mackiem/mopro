var x = 0;
var img;
function rad(deg) {
  return deg * Math.PI/180.0;
}


var agents = [];
var grid;

function preload() {
  img = loadImage(!img_name ? "x-map.bmp" : img_name);
}

var Sim = {
  dt : 0.3
};


function setup() {
  createCanvas(600, 400);

  // for (var goal in window.goals_json) {
  //   console.log(window.goals_json[goal]);
  // }

  //drawingContext.shadowOffsetX = 5;
  //drawingContext.shadowOffsetY = -5;
  //drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = "black";
  background(200);
  //ellipse(width/2, height/2, 50, 50);
  line(15, 25, 70, 90);
  //console.log(Math.cos(rad(180)))
  //console.log(20+20 * Math.cos(rad(60)));
  var len = 10;
  var s_x = 0;
  var s_y = 0;

  grid = new Grid({width: width, height : height, len : width / img.width, data : mydata});
  grid.populate(img);
  grid.find_path(createVector(4, 3), createVector(25, 5));

  if (!goals_desc["draw_in_grid"]) {
    goals_desc["draw_in_grid"] = function(spec) {
      var x = spec.x;
      var y = spec.y;
      var len = spec.len;
      var key = spec.key;
      var frac = 0.25;
      fill('#FFFF00');
      triangle((x + frac) * len, (y + frac) * len, (x+1 - frac) * len, (y + frac) * len, (x + 0.5) * len, (y+1 - frac) * len);
      fill('#000000');
      text(key, x * len, y * len);
    };
  }
   if (!start_locs_desc["draw_in_grid"]) {
     start_locs_desc["draw_in_grid"] = function(spec) {
       var x = spec.x;
       var y = spec.y;
       var len = spec.len;
       var key = spec.key;
       var frac = 0.25;
       fill('#FFFFFF');
       rect((x + frac) * len, (y + frac) * len,  2 * frac * len, 2 * frac * len);
       fill('#000000');
       text(key, x * len, y * len);
     };
   }
  grid.populate_json("goalie", goals_desc);
  grid.populate_json("start_loc", start_locs_desc);

  var num = agents_desc.length;
  var idx = 0;
  for (var id = 0; id < num; ++id) {
    var a_num = agents_desc[id].nums;
    for (var n = 0; n < a_num; ++n) {
      var start = start_locs_desc[agents_desc[id].start_loc];
      var agoal_keys = agents_desc[id].goals;
      var agoals = [];
      for (var k = 0; k < agoal_keys.length; ++k) {
        var g = goals_desc[agoal_keys[k]];
        if (g) {
          agoals.push({name : g.name, pos : createVector(g.x, g.y)});
        }
      }
      var orig_start_pos = createVector(start.x, start.y).mult(grid.len)
        .add(createVector(random(-grid.len, grid.len), random(-grid.len, grid.len)));
      orig_start_pos =  grid.is_valid(orig_start_pos) ? orig_start_pos : createVector(start.x, start.y).mult(grid.len);
      agents.push(new Agent(
        {start_pos : orig_start_pos,
          len : len,
          radius : grid.len,
          "grid" : grid,
          "id" : idx++,
          "goals" : agoals
        }
      )
    );
  }

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

      var neighbor_vecs = {};

      if (neighbor) {
        var offset = Math.ceil(agent.radius / grid.len);
        grid_cells = [];
        for (var l in neighbor) {
          neighbor_vecs[l] = createVector(0, 0);
        }
        for (var x_off = -offset; x_off <= offset; ++x_off) {
          for (var y_off = -offset; y_off <= offset; ++y_off) {
            var center = grid.get_gpos(agent.pos);
            center.add(createVector(x_off, y_off));
            if (grid.is_valid_gpos(center)) {
              var cell_data = grid.data[center.x][center.y];
              for (var i = 0; i < cell_data.agents.length; ++i) {
                if (agent.id != cell_data.agents[i]) {
                  for (l in neighbor) {
                    neighbor_vecs[l].add(neighbor[l]({agent : agent, other : cell_data.agents[i]}));
                  }
                }
              }

            }
          }
        }
      }

      if (waypoint) {

        var curr_v = createVector(0, 0);
        for (var k in waypoint) {
          var neighbor_v = (neighbor_vecs[k]) ? neighbor_vecs[k] : createVector(0, 0);
          var v = waypoint[k]({agent : agent, v : neighbor_v});
          curr_v.add(v);
        }
        agent.move(curr_v);
      }
      agent.update_path();
      //agent.move(createVector(0, 1, 0));
      agent.display();
    }
    //image(img, 10, 10);
}

function GPos(spec) {
  this.x = spec.pos.x;
  this.y = spec.pos.y;
}
