import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]
  }

  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    me: User
    users: [User]
    user(userId: ID!): User
    book(bookId: ID!): Book
    books: [Book]
  }

  type Mutation {

  }
  
  type Auth {
    
  }
`;

export default typeDefs;
