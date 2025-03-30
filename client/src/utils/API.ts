// import { useMutation, useQuery } from '@apollo/client';

// import { GET_ME } from '../graphql/queries.js';
// import { LOGIN_USER, ADD_USER, SAVE_BOOK, REMOVE_BOOK } from '../graphql/mutations.js';
// import type { User } from '../models/User.js';
// import type { Book } from '../models/Book.js';

// NO NEED in GraphQL API ❌
// route to get logged in user's info (needs the token)
// export const getMe = (token: string) => {
//   return fetch('/api/users/me', {
//     headers: {
//       'Content-Type': 'application/json',
//       authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const createUser = (userData: User) => {
//   const [addUser] = useMutation(ADD_USER);
//   try {
//     const data = addUser({
//       variables: {
//         username: userData.username,
//         email: userData.email,
//         password: userData.password,
//       },
//     });
//     return data;
//   } catch (error) {
//     throw new Error('Failed to create user: ' + error);
//   }
// };

// export const loginUser = (userData: User) => {
//   const [loginUser] = useMutation(LOGIN_USER);
//   try {
//     const data = loginUser({
//       variables: {
//         email: userData.email,
//         password: userData.password,
//       },
//     });
//     return data;
//   } catch (error) {
//     throw new Error('Failed to login user: ' + error);
//   }
// };

// // save book data for a logged in user
// export const saveBook = (bookData: Book, token: string) => {
//   return fetch('/api/users', {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(bookData),
//   });
// };

// // remove saved book data for a logged in user
// export const deleteBook = (bookId: string, token: string) => {
//   return fetch(`/api/users/books/${bookId}`, {
//     method: 'DELETE',
//     headers: {
//       authorization: `Bearer ${token}`,
//     },
//   });
// };

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
