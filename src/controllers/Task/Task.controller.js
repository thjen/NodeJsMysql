const {con} = require('../../utils/connect');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

module.exports.insertTask = (req, res) => {
  const timestamp = req.body.timestamp;
  const note = bcrypt.hashSync(req.body.note, 8);
  const query = `INSERT INTO note(note, timestamp, email)
    VALUES(${mysql.escape(note)}, ${mysql.escape(timestamp)}, ${mysql.escape(req.email)})`;
  con.query(query, (err, result, fields) => {
    if (err) {
      return res.json({
        message: 'Error'
      });
    }
    res.json({
      message: 'Success',
    });
  });
}

module.exports.updateTask = (req, res) => {
  const timestamp = req.body.timestamp,
    id = req.body.id;
  const note = bcrypt.hashSync(req.body.note, 8);
  const query = `UPDATE note
                SET note = ${mysql.escape(note)}, timestamp = ${mysql.escape(timestamp)}
                WHERE id = ${mysql.escape(id)}`;
  con.query(query, (err, result, fields) => {
    if (err) {
      return res.json({
        message: err
      });
    }
    res.json({
      message: 'Success'
    });
  });
}

module.exports.fetchTask = (req, res) => {
  if (req.email) {
    const query = `SELECT note, timestamp FROM note WHERE email = ${mysql.escape(req.email)}`;
    con.query(query, (err, result, fields) => {
      if (err) {
        return res.json({
          message: err
        });
      }
      res.json({
        data: result
      });
    });
  } else {
    res.json({
      message: 'Token is not provided'
    });
  }
}

module.exports.deleteTask = (req, res) => {
  if (req.email) {
    const id = req.query.id;
    const query = `DELETE FROM note WHERE id = ${mysql.escape(id)}`;
    con.query(query, (err, result, fields) => {
      if (err) {
        return res.json({
          message: err
        });
      }
      res.json({
        message: 'Success'
      });
    });
  } else {
    res.json({
      message: 'Token is not provided'
    });
  }
}

module.exports.getTask = (req, res) => {
  if (req.email) {
    const id = req.query.id;
    const query = `SELECT * FROM note WHERE id = ${mysql.escape(id)}`;
    con.query(query, (err, result, fields) => {
      if (err) {
        return res.json({
          message: err
        });
      }
      res.json({
        data: result
      });
    });
  } else {
    res.json({
      message: 'Token is not provided'
    })
  }
}