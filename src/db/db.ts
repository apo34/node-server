import * as mongoose from 'mongoose';

export class Db {
  public static connect (): Promise<typeof mongoose> {
    return mongoose.connect('mongodb://localhost:27017/TodoApp');
  }
}
