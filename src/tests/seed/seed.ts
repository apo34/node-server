import JWT from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import { config } from '../../config';
import { IUser, Todo, User } from './../../models';

export const testTodos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Third test todo'
  }
];

const UserOneId = new ObjectID();
const UserOneAuthToken = {
  access: 'auth',
  token: JWT.sign({
    _id: UserOneId.toHexString(),
    access: 'auth'
  }, config.JWTsecret)
};

const UserTwoId = new ObjectID();

export const testUsers = [
  {
    _id: UserOneId,
    email: 'userOne@test.com',
    password: 'userOnePass',
    tokens: [UserOneAuthToken]
  },
  {
    _id: UserTwoId,
    email: 'userTwo@test.com',
    password: 'userTwoPass'
  }
];

export const populateTodos = (done: MochaDone) => {
  Todo.remove({})
    .then(() => Todo.insertMany(testTodos))
    .then(() => done());
};

export const populateUsers = (done: MochaDone) => {
  User.remove({})
    .then(() => {
      const savedUsers$: Array<Promise<IUser>> = [];
      testUsers.forEach((user) =>
        savedUsers$.push(new User(user).save())
      );
      return Promise.all(savedUsers$);
    })
    .then(() => done());
};
