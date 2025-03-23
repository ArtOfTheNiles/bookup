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
    user: async(_:unknown, userId: { userId: string }) => {
      return User.findOne({ _id: userId.userId });
    }
  },
  Mutation: {
    login: async (_:unknown, { email, password }: { email: string, password: string }) => {
      
    },
    addUser: async (_:unknown, { username, email, password }: { username: string, email: string, password: string }) => {
      
    },
    saveBook: async (_:unknown, bookData: typeof Book, context: { user?: {_id: string}}) => {
      if (!context.user) {
        throw new Error('You must be logged in to complete this action');
      }
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }catch (error) {
        throw new Error('Error saving book: ' + error);
      }
    },
    removeBook: async (_:unknown, bookId: string, context: { user?: {_id: string}}) => {
      if (!context.user) {
        throw new Error('You must be logged in to complete this action');
      }
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }catch (error) {
        throw new Error('Error removing book: ' + error);
      }
  }
}
};

export default resolvers;
