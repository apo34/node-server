import * as JWT from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { Document, Model, model, Schema } from 'mongoose';

interface IToken {
  access: string;
  token: string;
}

interface IUser {
  password?: string;
  email?: string;
  tokens?: IToken[];
}

interface IUserModel extends IUser, Document {
  generateAuthToken: (this: IUserModel) => Promise<string>;
}

const UserSchema: Schema = new Schema({
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
    validate: {
      validator: (value: string) => {
        // tslint:disable-next-line:max-line-length
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
      },
      message: '{VALUE} is not a valid email!'
    },
    trim: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

UserSchema.pre('save', function (this: IUser, next) {
  console.log('pre save hook');
  next();
});

UserSchema.methods.generateAuthToken = function (this: IUserModel) {
  const access = 'auth';
  const token = JWT.sign({
    _id: this._id.toHexString(),
    access
  }, 'abc');

  const tokens = this.tokens || [];
  tokens.concat([{ access, token }]);
  this.tokens = tokens;

  return this.save().then(() => {
    return token;
  });
};

export const User: Model<IUserModel> = model('User', UserSchema);
