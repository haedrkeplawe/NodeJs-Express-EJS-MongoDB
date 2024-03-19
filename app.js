require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const PORT = process.env.PORT || 3500;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.locals.isActiveRoute = isActiveRoute;


app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));


mongoose
  .connect(
    "mongodb+srv://alihassanhaedr:c4a@cluster0.ue5ezcc.mongodb.net/2024dfseeung?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
