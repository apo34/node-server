import * as bcrypt from 'bcryptjs';
import * as JWT from 'jsonwebtoken';
import pick from 'lodash/pick';
import { Document, Model, model, Promise, Schema } from 'mongoose';

import { config } from './../config';

interface IToken {
  access: string;
  token: string;
}

interface IJWTData {
  _id: string;
  access: string;
}

export interface IUserDocument extends Document {
  password: string;
  email: string;
  tokens?: IToken[];
}

interface IUser extends IUserDocument {
  // Custom methods typings
  generateAuthToken: (this: IUser) => Promise<string>;
}

interface IUserModel extends Model<IUser> {
  // Static method typings
  findByToken: (this: IUserModel, token: string) => Promise<IUserDocument>;
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

// Event hooks

UserSchema.pre('save', function (this: IUser, next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.hash(user.password, 10)
      .then((hash) => {
        user.password = hash;
        next();
      });
  } else {
    next();
  }
});

// Stock methods overrides

UserSchema.methods.toJSON = function (this: IUser) {
  const userObject = this.toObject();
  return pick(userObject, ['_id', 'email']);
};

// Custom methods declarations

UserSchema.methods.generateAuthToken = function (this: IUser) {
  const access = 'auth';
  const token = JWT.sign({
    _id: this._id.toHexString(),
    access
  }, config.JWTsecret);

  const tokens = this.tokens || [];
  this.tokens = [...tokens, { access, token }];

  return this.save().then(() => {
    return token;
  });

};

UserSchema.statics.findByToken = function (this: IUserModel, token: string) {
  let decodedToken: IJWTData;
  try {
    decodedToken = JWT.verify(token, config.JWTsecret) as IJWTData;
  } catch (e) {
    return Promise.reject();
  }

  return this.findOne({
    '_id': decodedToken._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

export const User: IUserModel = model<IUser, IUserModel>('User', UserSchema);
