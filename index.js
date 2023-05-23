// //IMPORTS FROM PACKAGES

// const express = require("express");
// const mongoose = require("mongoose");
// const admin = require("./middleweres/admin");
// const adminRouter = require("./routes/admin");

// //IMPORTS FROM OTHER FILES
// const authRouter = require("./routes/auth");
// const productRouter = require("./routes/product");
// const userRouter = require("./routes/user");

// //INIT
// const PORT = process.env.PORT || 3000;
// // const PORT = 3000;
// const app = express();
// const DB =
//   "mongodb+srv://Gemona:X.Individu@cluster0.cz0cqgw.mongodb.net/?retryWrites=true&w=majority";

// //MiddleWare
// app.use(express.json());
// app.use(userRouter);
// app.use(authRouter);
// app.use(adminRouter);
// app.use(productRouter);

// //Connections
// mongoose
//   .connect(DB)
//   .then(() => {
//     console.log("Connection Succesfull");
//   })
//   .catch((e) => {
//     console.log("failed because of: " + e);
//   });

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`"Connected at port: ${PORT} period "`);
// });

// module.exports = admin;

//IMPORTS FROM PACKAGES

const express = require("express");
const mongoose = require("mongoose");
const admin = require("./middleweres/admin");
const paustackAuth = require("./middleweres/paystack");

require("dotenv").config();
const adminRouter = require("./routes/admin");

//IMPORTS FROM OTHER FILES
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const paystackAuth = require("./middleweres/paystack");

//INIT
const PORT = process.env.PORT || 3000;
// const PORT = 3000;
const app = express();
const DB =
  "mongodb+srv://Gemona:X.Individu@cluster0.cz0cqgw.mongodb.net/?retryWrites=true&w=majority";

//MiddleWare
app.use(express.json());
app.use(userRouter);
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);

//Connections
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Succesfull");
  })
  .catch((e) => {
    console.log("failed because of: " + e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`"Connected at port: ${PORT} period "`);
});

module.exports = admin;
module.exports = paystackAuth;
