import express from 'express';
import bodyParser from 'body-parser';
import { ItemService } from './services/user';
import itemRoutes from './routes/user';
import mysql from 'mysql';

const app = express();
const port = process.env.PORT || 8080;

;

app.use(bodyParser.json());
app.use('/api', itemRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
