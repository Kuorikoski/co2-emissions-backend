import express from 'express';
import server from './schema';

const app = express();
const port = process.env.PORT || 4000;

server.applyMiddleware({ app });

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});

export default app;
