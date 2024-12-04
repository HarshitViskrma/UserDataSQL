const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require("uuid");


app.use(methodOverride("_method"));
//for passing form data 
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Mysql@Viskrma4'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password()
  ];
}

// Home page route

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", {count});
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  } 
});

// Show page route

app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      if(err) throw err;
      res.render("show.ejs", {users});
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  } 
 
});

//Edit route

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error was found");
  }
});

// Update route

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("password are not correct");
      } else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      } 
    });
  } catch (err) {
    console.log(err);
    res.send("Some error was found");
  }
});

// insert new user

app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let { username, eamil, password } = req.body;
  let  id  = uuidv4();
  let q = `INSERT INTO user (id, username, eamil, password) VALUES ( '${id}', '${username}', '${eamil}', '${password}')`;
  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error was found");
  }
});

// delete existing user

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error was found");
  }
});

app.delete("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let { password: formPass } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Please Enter Valid Password.");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error was found");
  }
});

app.listen("8080", () => {
  console.log(`App start listen at port : 8080`);
});



// try {
//   connection.query(q, [data], (err, result) => {
//     if(err) throw err;
//     console.log(result);
//   })
// } catch (err) {
//   console.log(err);
// }

// connection.end();
