const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");

const User = require("../../models/User.model");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { generateToken } = require("../../util/tokenGenerator");

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { email, username, password, confirmPassword } }
    ) {
      const { errors, valid } = validateRegisterInput(
        email,
        username,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ email });

      if (user) {
        throw new UserInputError("User already exists!", {
          errors: {
            general: "User already exists!",
          },
        });
      }

      try {
        password = await bcrypt.hash(password, 12);
      } catch (err) {
        throw new Error(err);
      }

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      try {
        const res = await newUser.save();

        const token = generateToken(res);

        return {
          ...res._doc,
          id: res._id,
          token,
        };
      } catch (err) {
        throw new Error(err);
      }
    },

    async login(_, { loginInput: { email, password } }) {
      const { errors, valid } = validateLoginInput(email, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError("User not found!", {
          errors: {
            general: "User not found!",
          },
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UserInputError("Wrong credentials!", {
          errors: {
            general: "Wrong credentials!",
          },
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
