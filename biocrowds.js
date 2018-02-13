
var img_name = "blob.bmp";

function mydata() {
  this.agents = [];
  this.goals = [];
  this.some_custom_thing = [];
  this.signs = [];
  this.marker = {time : 0,
     id : -1,
   };
   this.marker.draw_this = function(spec) {
     var x = spec.x;
     var y = spec.y;
     var len = spec.len;

       point(x * len + len/2, y * len + len / 2);
   };
}

var start_locs_desc =
{
  "x" : {
    "name" : "x",
    "x" : 15,
    "y" : 10
  }
};


var start_locs_desca =
{
  "Bus Stop" : {
    "name" : "Bus Stop",
    "x" : 5,
    "y" : 4
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
      "start_loc" : "x",
      "nums" : 10
    },
    {
      "name" : "me",
      "goals" : ["Lawson", "Chauncey"],
      "start_loc" : "Train Stop",
      "nums" : 0
    },
  ];
  var goals_desc =
  {
    "z" : {
      "name" : "Z",
      "x" : 7,
      "y" : 16
    }
  };


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
  "separation" : function(spec) {
    var pos = createVector(spec.agent.pos.x, spec.agent.pos.y);
    return pos.sub(spec.other.pos);
  }
};

var calcF = function(i) {
	var modY = len(displacement[i]);	//distance between goal vector and origin (dont know why origin...)
	var modX = len(goal.pos - a.pos);
	var dot_p = displacement[i].dot(goal.pos - a.pos);
	var F = (1.0 / (1.0 + modY)) * (1.0 + ((dot_p) / (modX * modY)));
  return F;
};

//calculate W
var calcW = function(i)
{
	F = calcF(i);
	denom = 0;
	for (var m in a.markers) {
    denom += calcF(m);
  }
	return F / denom, denom;
}

var adj = {
  "marker" : function(spec) {

  }
};

var waypoint = {
  "separation" : function(spec) {
    var constant = 0.4;
    var vel = createVector(spec.v.x, spec.v.y);
    return vel.mult(constant);
  },
  "goal" : function(spec) {
    var agent = spec.agent;
    //var path = agent.path;
    var path_vec = agent.get_path_vector();
    var constant = 3;
    path_vec.normalize();
    return path_vec.mult(constant);
  }
};
