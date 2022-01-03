import pkg from 'mongoose';

const { connect, connection } = pkg;

const uri = process.env.URI_DB;
const db = connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

connection.on('connected', () => {
  console.log("Database connection successful")
})

process.on('SIGINT', async () => {
  connection.close();
  console.log('Connection DB closed');
  process.exit(1)
})

export default db
