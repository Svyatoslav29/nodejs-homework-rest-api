import app from '../app';
import db from '../lib/db';

const PORT = process.env.PORT || 4000

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`)
  })
}).catch(error => {
  console.log(`Server is not running. Error ${error.message}`)
})

