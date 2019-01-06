const jwt = require('jsonwebtoken');

const getEmail = (req, res) => {
  let originReqToken = req.headers.authorization;
  if (originReqToken) {
    const token = originReqToken.slice(7, originReqToken.length);
    if (!token) return res.send({message: 'No token provided'});
    email = '';
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.send({
          message: 'Error',
        });
      }
      email = decoded.email;
    });
    return email;
  }
}

module.exports.verifyToken = (req, res, next) => {
  req.email = getEmail(req, res);
  next();
}

/**TODO: validate **/
const validateEmail = (req, res) => {
  const email = req.body.email;
  if (email.length > 17) {
    const emailregex = /^([a-z]|[0-9]|(\_?))+@gmail\.com$/g;
    const testEmail = emailregex.test(email);
    if (!testEmail) {
      return res.json({
        message: 'Email cannot contain bold words and special characters other than characters _'
      });
    } else {
      return email;
    }
  } else {
    return res.json({
      message: 'Email must contain more than eight characters without @gmail.com  '
    });
  }
}
const validateUsername = (req, res) => {
  const username = req.body.username;
  if (username.length > 5) {
    return username;
  } else {
    return res.json({
      message: 'Username must contain more than five characters'
    });
  }
}
const validatePassword = (req, res) => {
  const password = req.body.password;
  if (password.length > 7) {
    const passwordregex = /^([a-z]|[0-9]|(\_?))+$/g;
    const testPassword = passwordregex.test(password);
    if (testPassword) {
      return password;
    } else {
      return res.json({
        message: 'Password cannot contain bold words and special characters other than characters _ and more than eight characters'
      });
    }
  } else {
    return res.json({
      message: 'Password must contain more than five characters'
    });
  }
}

module.exports.validateRegister = (req, res, next) => {
  if (validateEmail(req, res)) {
    req.email = validateEmail(req, res);
    if (validateUsername(req, res)) {
      req.username = validateUsername(req, res);
      if (validatePassword(req, res)) {
        req.password = validatePassword(req, res);
        next();
      }
    }
  }
}

module.exports.validateResetPassword = (req, res, next) => {
  req.email = validateEmail(req, res);
  next();
}

module.exports.validateChangePassword = (req, res, next) => {
  if (getEmail(req, res)) {
    req.email = getEmail(req, res);
    req.password = validatePassword(req, res);
    next();
  }
}