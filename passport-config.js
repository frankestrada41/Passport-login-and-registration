import { Strategy } from "passport-local";
import bcrypt from "bcrypt";

export function initializePassport(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: 'user is not registered' });
    };

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'incorrect password' })
      }
    } catch (e) {
      console.log(e)
      return done(e)
    }
  };

  passport.use(new Strategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    done(null, getUserById(id))
  })
}