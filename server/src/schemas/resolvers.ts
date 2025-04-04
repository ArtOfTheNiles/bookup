import User, { UserDocument } from '../models/User.js';
import { signToken } from '../services/auth.js';

interface BookInput {
  authors?: string[];
  description: string;
  bookId: string;
  image?: string;
  link?: string;
  title: string;
}

export const resolvers: any = {

  Query: {

    me: async (
      _:unknown, 
      __:unknown, 
      context: { user?: {_id: string}}
    ) => {
      if(context.user && context.user._id) {
        return User.findOne({ _id: context.user._id });
      }
      throw new Error('Not authenticated');
    },

    user: async(
      _:unknown, 
      userId: { userId: string }
    ) => {
      return User.findOne({ _id: userId.userId });
    }
  },

  Mutation: {

    login: async (
      _:unknown,
      args: UserDocument
    ) => {
      try {

      console.info('Attempting to login with args:', args);

      const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
      if(!user) {
        throw new Error("Cannot find requested User");
      }
      const correctPw = await user.isCorrectPassword(args.password);
      if(!correctPw) {
        throw new Error("Incorrect Password"); 
      }
      console.info('login verified, generating token')
      const token = signToken(user.username, user.email, user._id);
      console.info('Token generated:', token ? 'Success ✅' : 'Failed ❌');
      return { token, user };
      }catch (error) {
        throw new Error('Login Error, please check your credentials:\n' + error);
      }
    },

    addUser: async (
      _:unknown,
      args: { 
        username: string,
        email: string,
        password: string 
      }
    ) => {
      try {
        const newUser = await User.create(args);
        if (!newUser) {
          throw new Error('Something went wrong! Cannot create user');
        }
        const token = signToken(newUser.username, newUser.email, newUser._id);
        return { token, newUser };
      }catch (error) {
        throw new Error('Error creating User:\n' + error);
      }
    },

    saveBook: async (
      _:unknown, 
      { bookData }: { bookData: BookInput },
      context: { user?: {_id: string}}
    ) => {
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

    removeBook: async (
      _:unknown, bookId: string,
      context: { user?: {_id: string}}
    ) => {
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
