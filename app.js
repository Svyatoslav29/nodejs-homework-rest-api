import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import { HttpCode } from './lib/constants';
import contactsRouter from './routes/api/contacts';
import authRouter from './routes/api/users';

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(express.static(process.env.FOLDER_FOR_AVATARS))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/users', authRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' })
})

app.use((err, req, res, next) => {
  const statusCode = err.status || HttpCode.INTERNAL_SERVER_ERROR;
  const status = statusCode === HttpCode.INTERNAL_SERVER_ERROR ? 'fail' : 'error';
  res.status().json({ status: status, code: statusCode, message: err.message })
})

export default app
