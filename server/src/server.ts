import express from 'express';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';


import db from './config/connection.js';
import routes from './routes/index.js';


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const startApolloServer = async () => {

  await server.start();
  await db();

  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1];
      let user = null;
      
      if (token) {
        try {
          // Verify the token
          const secretKey = process.env.JWT_SECRET_KEY || '';
          user = jwt.verify(token, secretKey);
        } catch (error) {
          console.error('Authentication error:', error);
        }
      }
      
      return { user };
    }
  }));
  
  app.use(routes);
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}!`);
    console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
