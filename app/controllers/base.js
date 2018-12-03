var base = module.exports = {};


base.index = function(req, res) {
  res.render('homepage');
};

base.about = function(req, res) {
  res.render('about');
};

base.roadmap = function(req, res) {
  res.render('roadmap');
};

base.contact = function(req, res) {
  res.render('Contact');
};

base.privacy = function(req, res) {
  res.render('Privacy', { noScript: true });
};

base.terms = function(req, res) {
  res.render('Terms', { noScript: true });
};
