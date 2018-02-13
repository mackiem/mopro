
function mydata() {
  this.agents = [];
  this.goals = [];
  this.some_custom_thing = [];
}

var start_locs_desc =
{
  "Bus Stop" : {
    "name" : "Bus Stop",
    "x" : 0,
    "y" : 0
  },
  "Train Stop" : {
    "name" : "Train Stop",
    "x" : 10,
    "y" : 3
  },

};


var agents_desc =
  [
    {
      "name" : "me",
      "goals" : [ "Chauncey"],
      "start_loc" : "Bus Stop",
      "nums" : 1
    },
    {
      "name" : "me",
      "goals" : ["Lawson", "Starbucks"],
      "start_loc" : "Train Stop",
      "nums" : 1
    },
  ];

var goals_desc =
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
  // "separation" : function(spec) {
  //   var pos = createVector(spec.agent.pos.x, spec.agent.pos.y);
  //   return pos.sub(spec.other.pos);
  // }
};

var waypoint = {
  // "separation" : function(spec) {
  //   var constant = 0.1;
  //   var vel = createVector(spec.v.x, spec.v.y);
  //   return vel.mult(constant);
  // },
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
