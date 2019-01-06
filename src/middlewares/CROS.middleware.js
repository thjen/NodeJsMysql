allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin, Accept, Authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
}
module.exports = allowCrossDomain;