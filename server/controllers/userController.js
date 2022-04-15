const mysql = require('mysql');
const bodyParser = require('body-parser');
// connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});



// View Users
exports.view = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected!
        console.log('Connected as ID' + connection.threadId);

        //User connection
        connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
            // when done with the connection, release it
            connection.release();
            if (!err) {
                res.render('index', {
                    rows
                });
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);



        })
    });
}
// find user by name
exports.find = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected!
        console.log('Connected as ID' + connection.threadId);

        let searchTerm = req.body.search;

        //User connection
        connection.query('SELECT * FROM user WHERE status = "active" && first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            // when done with the connection, release it
            connection.release();
            if (!err) {
                res.render('index', {
                    rows
                });
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);



        });

    });
}
exports.form = (req, res) => {
    res.render('add-user');
}
//add new user
exports.create = (req, res) => {
    //res.render('add-user');
    const {
        first_name,
        last_name,
        email,
        phone_number,
        comments
    } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected!
        console.log('Connected as ID' + connection.threadId);
        let searchTerm = req.body.search;
        //User connection
        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone_number = ?, comments = ?', [first_name, last_name, email, phone_number, comments], (err, rows) => {
            // when done with the connection, release it
            connection.release();
            if (!err) {
                res.render('add-user', {
                    alert: 'User added successfully.'
                });
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    });
}


  
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected!
        console.log('Connected as ID' + connection.threadId);

        // User the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
          if (!err) {
            res.render('edit-user', { rows });
          } else {
            console.log(err);
          }
          console.log('The data from user table: \n', rows);
        });
      })};

//update user
exports.update = (req, res) => {
    const { first_name, last_name, email, phone_number, comments } = req.body;
    // User the connection
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected!
        console.log('Connected as ID' + connection.threadId);
    connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone_number = 1 , comments = ? WHERE id = ?', [first_name, last_name, email, phone_number, comments, req.params.id], (err, rows) => {
  
      if (!err) {
        // User the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
          // When done with the connection, release it
          
          if (!err) {
            res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
          } else {
            console.log(err);
          }
          console.log('The data from user table: \n', rows);
        });
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    })});
  }
  