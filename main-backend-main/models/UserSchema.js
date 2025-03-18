const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
// const AutoIncrementID = require("./AutoIncrement");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        trim: true,
        maxlength: 50
      },
      email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please provide a valid email'
        ]
      },
      password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
      },
      role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
      },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPasswords = async function (password) {
  return await bycrypt.compare(password, this.password);
};

// UserSchema.plugin(AutoIncrementID, 'User');


UserSchema.methods.addToken = async function (token) {
  this.tokens = this.tokens || [];
  this.tokens.push({ token });
  await this.save();
};

UserSchema.methods.removeToken = async function (token) {
  this.tokens = this.tokens.filter((t) => t.token !== token);
  await this.save();
};

module.exports = mongoose.model("User", UserSchema);
