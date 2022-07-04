const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const cookieParser = require("cookie-parser");
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");

const UserRoute = require("./Routes/UserRoute");

//Middlewares (IF AND ONLY IF) when using POSTMAN API
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const URI =
  "mongodb+srv://admin:admin@mms-inventory.3ns1mcd.mongodb.net/?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: URI,
  collection: "session",
});

//Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://zcmc.vercel.app",
      "http://localhost:3000",
      "https://zcmc.netlify.app",
    ],
    methods: ["PUT", "DELETE", "GET", "POST", "*"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  session({
    key: "userId",
    secret: "This is a cookie secret ID",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
  })
);

app.use("/api/auth/", UserRoute);

app.get("/", (req, res) => {
  res.send("sds");
});

//Asynchronous connection to database
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});
