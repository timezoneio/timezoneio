var main = module.exports = {};


main.index = function(req, res) {
  res.render('homepage');
};

main.about = function(req, res) {
  res.render('about');
};

main.roadmap = function(req, res) {
  res.render('roadmap');
};

main.contact = function(req, res) {
  res.render('Contact');
};
