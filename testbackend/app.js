const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = 8000;



 
//MongoDB connection 
mongoose.connect('mongodb://localhost:27017/test');

const Cat = mongoose.model('Cat', {name: String});

const kitty = new Cat({name: 'ZZ'});
kitty.save().then(()=>console.log('DB CONNECTED'));


app.get("/", (req, res) => {
  return res.send("Home page");
});


//////////////////////////////////////
const admin = (req, res) => {
  return res.send("admin dashboard");
}

const isAdmin = (req, res, next)=>{
  console.log("isAdmin is running");
  next();
}

const isloggedIn = (req, res, next)=>{
  console.log("isLoggedIn is running");
  next();
}
app.get("/admin", isloggedIn ,isAdmin, admin);

///////////////////////////////////////
app.get("/login", (req, res) => {
  return res.send("You are visiting login route");
});

app.get("/signup", (req, res) => {
  return res.send("You are visiting signup route");
});

app.listen(port, () => {
  console.log("Server is up and running...");
});

// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
