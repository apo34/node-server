import * as mongoose from 'mongoose';
const mongoDbAdress = process.env.MONGO_URL || 'mongodb://localhost:27017/TodoApp';
export class Db {
  public static connect (): Promise<typeof mongoose> {
    return mongoose.connect(mongoDbAdress);
  }
}
