import User, { UserDocument } from '../models/User.js';
import Book from '../models/Book.js';
import { authenticateToken, signToken } from '../services/auth.js';

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
      const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
      if(!user) {
        throw new Error("Cannot find requested User");
      }
      const correctPw = await user.isCorrectPassword(args.password);
      if(!correctPw) {
        throw new Error("Incorrect Password"); 
      }
      const token = authenticateToken(user.username, user.password, user.id);
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
        const token = signToken(newUser.username, newUser.password, newUser._id);
        return { token, newUser };
      }catch (error) {
        throw new Error('Error creating User:\n' + error);
      }
    },

    saveBook: async (
      _:unknown, 
      { bookData }: { bookData: typeof Book },
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
