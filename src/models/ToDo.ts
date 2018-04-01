import { Document, Model, model, Schema } from 'mongoose';

interface ITodo {
  text?: string;
  completed?: boolean;
  completedAt?: number;
}

interface ITodoModel extends ITodo, Document { }

const TodoSchema: Schema = new Schema({
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  text: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  }
}, {
  timestamps: true
});

TodoSchema.pre('save', function (this: ITodo, next) {
  // console.log('pre save hook');
  next();
});

export const Todo: Model<ITodoModel> = model('Todo', TodoSchema);
