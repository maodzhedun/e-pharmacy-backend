import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, default: 'Clayton Santos' },
  },
  { timestamps: true, versionKey: false },
);

// 🆕 Hide password in all JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
