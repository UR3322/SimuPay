const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 500.00, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Hash the password whenever it is created or changed.
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never serialize the password hash.
UserSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    balance: this.balance,
  };
};

module.exports = mongoose.model('User', UserSchema);
