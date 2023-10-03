const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // read file.env and save it into NODE_ENV
const app = require("./app");
//  console.log(process.env)
const DB = process.env.DATABASE;

// try {
//   mongoose.connect(DB);
//   console.log("db connected");
// } catch (e) {
//   console.log(e);
// }

mongoose.connect(DB).then(() => console.log("db connected"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on  port ${port}`);
});
