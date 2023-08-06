import express from 'express';
import config from './constants/config';
import { runSync, testSync } from './routes'
import logger from './logger'

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`ok!`);
});

app.post('/run-sync', (req, res) => {
  console.log({ module })
  const { start, end, test } = req.body;
  runSync(start, end, test);
  res.json({ message: `Sync started for dates ${start} to ${end}, test? ${test}`})
});

const port = process.env.PORT;
app.listen(port, () => {
  logger.debug(`plutus-sync: listening on port ${port}`);
});