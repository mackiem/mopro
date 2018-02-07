var test = function() {
  var path = [];

  that = {};
  has_elements = function() {
    return (path.length > 0);
  };
  inc = function () {
    path = [3];
    if (has_elements()) {
      path.push(2);
    }
  };
  that.inc = inc;
  return that;
};

var test1 = new test();
console.log(test1.inc());
