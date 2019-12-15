const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    match: /^https?:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-]){1,}?$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(e){
        return validator.isEmail(e);
      },
      message: (props) => `'${props.value}' E-mail`
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
  .then((user) => {
    if(!user) {
      return Promise.reject(new Error('Неверные e-mail или пароль'));
    }
    return bcryptjs.compare(password, user.password)
      .then((matched) => {
        if(!matched) {
          return Promise.reject(new Error('Неверные e-mail или пароль'));
        }
        return user;
      });
  });
};

module.exports = mongoose.model('user', userSchema);