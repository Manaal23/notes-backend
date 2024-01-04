const genToken = require("../Helper");
const User = require("../Models/user");
const bcrypt = require("bcryptjs");

class AuthServices {
  async signUp(req, res) {
    try {
      let { firstname, lastname, email, password } = req.body;

      const isExist = (await User.find({ email })).length;

      if (isExist) {
        return {
            error: true,
            message: "Already a member.",
          }
      }

      password = await bcrypt.hash(password, 8);
      const data = await User.create({
        firstname,
        lastname,
        email,
        password,
      });

      return {
        error: false,
        message: "Sucessfully created",
      }
    } catch (err) {
      console.log(err, "signup error");
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const data = await User.findOne({ email });

      if (!data) {
        return {
          error: true,
          message: "User does not exist.",
        };
      }

      if (!(await bcrypt.compare(password, data.password)))
        return {
          error: true,
          message: "Incorrect password.",
        }

      let token = genToken(data);

      return {
        error: false,
        message: "Login successful",
        token,
      }
    } catch (err) {
      console.log(err, "**********error login");
    }
  }
}

module.exports = new AuthServices();
