import express from 'express';
import authRoute from './src/routes/authRoute';

const app = express();
app.use('/auth', authRoute);

app.listen(3001, () => {
  console.log('Test server on 3001');
});
