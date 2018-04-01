import { Document, Model, model, Schema } from 'mongoose';

interface IUser {
  username?: string;
  password?: string;
  email?: string;
}

interface IUserModel extends IUser, Document { }

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    trim: true
  }
}, {
  timestamps: true
});

UserSchema.pre('save', function (this: IUser, next) {
  // console.log('pre save hook');
  next();
});

export const User: Model<IUserModel> = model('User', UserSchema);
