
import 'dotenv/config'
import express from "express";
import helmet from "helmet";
import cors from 'cors';
import bcrypt from "bcrypt";
import passport from "passport";
import { initializePassport } from "./passport-config.js";
import flash from 'express-flash';
import session from 'express-session'
import bodyParser from 'body-parser';

const PORT = 8000;
const app = express();

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

const users = [];
const sistemUserNames = []

app.use(bodyParser.json())

app.use(helmet());

var corsOptions = {
  origin: `${process.env.FRONT_URL}`,
  optionsSuccessStatus: 200,
};
app.options('*', cors(corsOptions))

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the Server');
});

app.post('/login', passport.authenticate('local', {
  successMessage: 'SUCCESFULL LOGIN',
  failureMessage: 'LOGIN WRONG CREDENTIALS',
  failureFlash: true,
}));

app.post('/register', async (req, res) => {
  try {
    console.log('REGISTER ENDPOINT')
    const [email, password, name] = atob(req.headers.authorization.replace('Bearer ', '')).split(':')
    const hashPassword = await bcrypt.hash(password, 10);
    if (sistemUserNames.includes(email)) {
      throw new Error('user name al ready taken!')
    }
    sistemUserNames.push(email);
    users.push({
      id: Date.now().toString(),
      email,
      password: hashPassword,
      name,
    })
    console.log('REGISTER ROUTE: ', users)
    res.send('SUCCESFUL REGISTER')
  } catch (e) {
    console.log('THERE HAS BEEN AN ERROR IN REGISTER: ', e)
    res.status(400)
    res.send(`THERE HAS BEEN AN ERROR: ${e.message}`)
  }
});

app.listen(PORT, () => {
  console.log(`SERVER LISTENING IN PORT: ${PORT}`);
});