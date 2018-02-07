
function mydata() {
  this.agents = [];
  this.goals = [];
  this.some_custom_thing = [];
}

var start_locs =
{
  "Bus Stop" : {
    "name" : "Bus Stop",
    "x" : 6,
    "y" : 3
  },
  "Train Stop" : {
    "name" : "Train Stop",
    "x" : 10,
    "y" : 3
  },
};


var agents_json =
  [
    {
      "name" : "me",
      "goals" : ["Starbucks", "Lawson", "Chauncey"],
      "start_loc" : "Bus Stop"
    },
    // {
    //   "name" : "you",
    //   "goals" : ["Starbucks", "Lawson"],
    //   "start_loc" : "Train Stop"
    // }
  ];

var goals_json =
{
  "Starbucks" : {
    "name" : "Starbucks",
    "x" : 7,
    "y" : 16
  },
  "Lawson" : {
    "name" : "Lawson",
    "x" : 26,
    "y" : 4
  },
  "Chauncey" : {
    "name" : "Chauncey",
    "x" : 27,
    "y" : 18
  },
  "draw_in_grid" : function(spec) {
    var x = spec.x;
    var y = spec.y;
    var len = spec.len;
    var key = spec.key;
    var frac = 0.25;
    fill('#FFFF00');
    triangle((x + frac) * len, (y + frac) * len, (x+1 - frac) * len, (y + frac) * len, (x + 0.5) * len, (y+1 - frac) * len);
    fill('#000000');
    text(key, x * len, y * len);
  }
};

var waypoint = {
  "goal" : function(spec) {
    var agent = spec.agent;
    //var path = agent.path;
    var path_vec = agent.get_path_vector();
    var constant = 3;
    path_vec.normalize();
    return path_vec.mult(constant);
  }
};
