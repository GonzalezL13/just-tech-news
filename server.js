const path = require("path");
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const app = express();
const PORT = process.env.PORT || 3001;



app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');




// turn on routes
app.use(routes);

// turn on connection to db and server
//we use the sequelize.sync() method to establish the connection to the database
//"sync" part means that this is Sequelize taking the models and connecting them to associated database tables
//If it doesn't find a table, it'll create it for you!
//sequelize.sync({ force: true }) = DROP TABLE IF EXISTS *DO THIS WHEN UPDATING ROUTES()
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});