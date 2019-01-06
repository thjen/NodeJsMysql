const {con} = require('../../utils/connect');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const generator = require('generate-password');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD
  }
});

module.exports.register = (req, res) => {
  const email = req.email,
    username = req.username;
  const password = bcryptjs.hashSync(req.password, 8);
  const sqlQuery = `INSERT INTO user(email, username, password) 
    VALUES(${mysql.escape(email)},${mysql.escape(username)},${mysql.escape(password)})`
  con.query(sqlQuery, (err, result, fields) => {
    if (err) {
      res.json({ 
        message: 'Email has been exists',
      }); 
    }
    res.json({message: 'Success'}); 
  });
}

module.exports.login = (req, res) => {
  const email = req.body.email,
    password = req.body.password;
  const sqlQuery = `SELECT password, email 
                    FROM user 
                    WHERE email = ${mysql.escape(email)}`;
  con.query(sqlQuery, (err, result, fields) => {
    if (err) {
      res.json({
        message: 'Error'
      });
      return;
    }
    if (result.length > 0) {
      const passwordIsValid = bcryptjs.compareSync(password, result[0].password);
      if (passwordIsValid) {
        const token = jwt.sign({email: result[0].email}, process.env.SECRET_KEY, {
          expiresIn: 86400,
        });
        res.json({
          token: token
        });
      } else {
        res.json({
          message: 'Password incorrect'
        });
      }
    } else {
      res.json({
        message: 'Email is not exists'
      });
    }
  });
}

module.exports.me = (req, res) => {
  if (req.email) {
    const query = `SELECT * FROM user WHERE email = ${mysql.escape(req.email)}`;
    con.query(query, (err, result, fields) => {
      if (err) {
        res.json({
          message: 'Email is not exists'
        });
        return;
      }
      res.json({
        data: result,
      });
    });
  } else {
    res.send({message: 'No token provided'});
  }
}

module.exports.changePassword = (req, res) => {
  if (req.email) {
    const oldpassword = req.body.oldpassword;
    const getpassword = `SELECT password FROM user WHERE email = '${req.email}'`;
    con.query(getpassword, (err, result, fields) => {
      if (err) {
        res.json({
          message: err
        });
      }
      if (result.length > 0) {
        const passwordIsValid = bcryptjs.compareSync(oldpassword, result[0].password);
        if (passwordIsValid) {
          const newpassword = bcryptjs.hashSync(req.password, 8);
          const updatepassword = `UPDATE user 
                                  SET password = ${mysql.escape(newpassword)} 
                                  WHERE email = ${mysql.escape(req.email)}`;
          con.query(updatepassword, (err, result, fields) => {
            if (err) res.json({message: 'Error'});
            res.json({message: 'Success'});
          });
        } else {  
          res.json({
            message: 'Password is not match'
          });
        }
      }
    });
  } else {
    res.send({message: 'No token provided'});
  }
}

module.exports.resetPassword = (req, res) => {
  const email = req.email;
  const password = generator.generate({
    length: 8,
    numbers: true,
    symbols: false,
    uppercase: false,
    excludeSimilarCharacters: false,
    exclude: false,
    strict: false,
  });
  const options = {
    from: process.env.MAILER_EMAIL,
    to: email,
    subject: 'This is your password',
    text: password
  }
  transporter.sendMail(options, (err, info) => {
    if (err) {
      res.json({message: 'Error'})
      return;
    }
    const hassPass = bcryptjs.hashSync(password, 8);
    const queryUpdatePassword = `UPDATE user 
                                SET password = ${mysql.escape(hassPass)}
                                WHERE email = ${mysql.escape(email)}`;
    con.query(queryUpdatePassword, (err, result, fields) => {
      if (err) {
        res.json({message: 'Error'})
      }
      res.json({
        message: 'Success',
      });
    });
  });
}