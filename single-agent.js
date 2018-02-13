
function mydata() {
  this.agents = [];
  this.goals = [];
  this.some_custom_thing = [];
}


var start_locs_desca =
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


var agents_desca =
  [
    {
      "name" : "me",
      "goals" : [ "Chauncey"],
      "start_loc" : "Bus Stop",
      "nums" : 1
    },
    {
      "name" : "me",
      "goals" : ["Lawson", "Chauncey"],
      "start_loc" : "Train Stop",
      "nums" : 0
    },
  ];

var goals_desca =
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

};

var neighbor = {
};

var waypoint = {
  "goal" : function(spec) {
    var agent = spec.agent;
    var path_vec = createVector(0, 0);
    if (agent.path.length > 0) {
      path_vec = p5.Vector.sub(grid.get_pos(agent.path[0]), agent.pos);
    }
    var constant = 3;
    path_vec.normalize();
    return path_vec.mult(constant);
  }
};
