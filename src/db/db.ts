import * as mongoose from 'mongoose';

export class Db {
  public static connect (): Promise<boolean> {
    return mongoose.connect(this._determineDbAdress())
      .then(() => true)
      .catch((reason) => {
        console.log('Could not connect to db!');
        console.log('Reason:', reason.message);
        return false;
      });
  }

  private static _determineDbAdress (): string {
    switch (process.env.NODE_ENV) {
      case 'production':
        return process.env.MONGO_URL as string;
      case 'development':
        return 'mongodb://localhost:27017/TodoApp';
      case 'test':
        return 'mongodb://localhost:27017/TestDb';
      default:
        console.log(`UNSUPPORTED ENVIRONMENT ${process.env.NODE_ENV}, USING LOCAL`);
        return 'mongodb://localhost:27017/TodoApp';
    }
  }
}
