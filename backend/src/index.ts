import express from 'express';
import bodyParser from 'body-parser';
import verifySignatureRoute from './routes/verifySignature';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT } from './constants';
import {logger} from './services';


const app = express();
const port = PORT;

dotenv.config();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.use('/verify-signature', verifySignatureRoute);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const server = app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});

export { server };
export default app;
