import User from '../models/User.js';
import Book from '../models/Book.js';

export const resolvers: any = {
  Query: {
    me: async (_:unknown, __:unknown, context: { user?: {_id: string}}) => {
      if(context.user && context.user._id) {
        return User.findOne({ _id: context.user._id });
      }
      throw new Error('Not authenticated');
  },
  Mutation: {

  },
}
};

export default resolvers;
