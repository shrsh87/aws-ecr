const express = require('express');
const os = require('os');
const mariadb = require('mysql');
const app = express();
const port = 80;

app.use(express.json());

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE
} = process.env;                                                                 

// db configuration
const client = mariadb.createPool({
  host     : `${DB_HOST}`,
  port     : 3306,
  user     : `${DB_USER}`,
  password : `${DB_PASSWORD}`,
  database : `${DB_DATABASE}`,
  connectionLimit: 20
});

console.log(`Running query to MariaDB server: ` + `${DB_HOST}`);

// basic endpoint
app.get('/', (req, res) => {
  res.send('Application started successfully: ' + os.hostname() + '\n');
})

// health check endpoint
app.get('/health', (req, res) => {
  client.query('SELECT NOW()', (err, results) => {
    res.status(200).json({ Database_is_up_and_running: results[0] });
  });
})

// get user by id
app.get('/users', (req, res) => {
  const { col1 } = req.body
  //console.log('Get user col1 = ' + col1);
  client.query('SELECT * FROM tab1 WHERE col1 = ?', [col1], function(err, results) {
    res.status(200).json({ Info: results[0] });
  });
})

// save new user
app.post('/users', (req, res) => {
  //console.log('Saving new user');
  const { col1, col2, col3, col4 } = req.body
  //console.log('Post user col1 = ' + col1, col2, col3, col4);
  client.query('INSERT INTO tab1 VALUES (?, ?, ?, ?)', [col1, col2, col3, col4], function(err, results) {
    res.status(200).json({ affectedRows: results.affectedRows });
  });
})

// update user by id
app.put('/users', (req, res) => {
  const { col2, col3, col4, col1 } = req.body
  //console.log('Update user col1 = ' + col1);
  client.query('UPDATE tab1 SET col2 = ?, col3 = ?, col4 = ? WHERE col1 = ?', [col2, col3, col4, col1], function(err, results) {
    res.status(200).json({ affectedRows: results.affectedRows });
  });
})

// delete user by id
app.delete('/users', (req, res) => {
  const { col1 } = req.body
  //console.log('Delete user col1 = ' + col1);
  client.query('DELETE FROM tab1 WHERE col1 = ?', [col1], function(err, results) {
    res.status(200).json({ affectedRows: results.affectedRows });
  });
})

app.listen(port, () => {
    console.log(`Application listening on port ${port}`)
});
