const express = require("express");
const { default: mongoose } = require("mongoose");
const User = require("./src/user"); // Import the User model
const publishEmailJob = require("./src/emailPublisher");


const app = express();
const port = 4000;

app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, })
  .then(() => console.log("MongoDB connected")) 
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/test", async(req, res) => {
  res.send('test1225');
});

app.get("/", async(req, res) => {
  const users = await User.find();
  publishEmailJob() // Call the email job publisher
  res.send(users);
});
app.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.send(user);
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
