const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const User = require("./model/user");
const path = require("path");
const app = express();

// to connect to mongodb you need to call .connect and pass the url of your mongo instance
// in this case your mongo is running on local host
// the /mongooseIntro is the name of the db, if mongoose does not find one with that name
// is going to create one for you
mongoose
  .connect("mongodb://localhost/mongooseIntro")
  .then((x) => {
    console.log(`Connected to Mongo! DB name: ${x.connections?.[0].name}`);
  })
  .catch((e) => console.error(`Mongo Error: ${e}`));

// express.json() and express.urlencoded() return a middleware that lets express
// understand the body object of a post request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// hbs configurations
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
// public
app.use(express.static(path.join(__dirname, "public")));
// partials
hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.get("/", async (req, res) => {
  const users = await User.find({});
  console.log("users", users);
  res.render("index", { users });
});

app.get("/users/:userId", async (req, res) => {
  // we retrieve the userId coming in the route params of the request
  const userId = req.params.userId;
  // we query our DB with mongoose to find the specific user by id
  const user = await User.findById(userId);
  // we send the view user with the user information
  res.render("user", user);
});

app.post("/users", async (req, res) => {
  const user = req.body;
  // create function add a new document in your DB
  const newUser = await User.create(user);

  // if you want to create many documents at once
  // you can use insertMany --> User.insertMany([...documents])

  res.redirect("/");
});

app.post("/users/:userId/delete", async (req, res) => {
  const { userId } = req.params;
  await User.findByIdAndDelete(userId);
  res.redirect("/");
});

app.post("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const { email } = req.body;
  // Option I dont recommend -> User.findOneAndUpdate({_id: userId}, {email})
  // {new: true} is so that User.findByIdAndUpdate return the updated document and not the original
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { email },
    { new: true }
  );
  console.log("updatedUser", updatedUser);
  res.redirect(`/users/${userId}`);
});

app.listen(7000, () => console.log("server running"));
