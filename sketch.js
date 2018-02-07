var x = 0;
var img;
function rad(deg) {
  return deg * Math.PI/180.0;
}


var agents = [];
var grid;
var img_name = "x-map.bmp";

function preload() {
  img = loadImage(img_name);
}

var Sim = {
  dt : 0.3
};


function setup() {
  createCanvas(600, 400);

  for (var goal in window.goals_json) {
    console.log(window.goals_json[goal]);
  }

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

  grid.populate_json(goals_json);

  var num = agents_json.length;
  for (var id = 0; id < num; ++id) {
    var start = start_locs[agents_json[id].start_loc];
    var agoal_keys = agents_json[id].goals;
    var agoals = [];
    for (var k = 0; k < agoal_keys.length; ++k) {
      var g = goals_json[agoal_keys[k]];
      if (g) {
        agoals.push({name : g.name, pos : createVector(g.x, g.y)});
      }
    }
    agents.push(new Agent(
      {start_pos : createVector(start.x, start.y).mult(grid.len),
        len : len,
        radius : 5,
        "grid" : grid,
        "id" : id,
        "goals" : agoals
      }
    )
  );

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

      if (waypoint) {
        var neighbor_v = createVector(0, 0);
        var curr_v = createVector(0, 0);
        for (var k in waypoint) {
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
