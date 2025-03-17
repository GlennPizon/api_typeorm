import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import dotenv from 'dotenv'
import { initialize } from "./data-source";
import express from 'express'
import router from '../src/controllers/users.controller'



dotenv.config(); 

const app = express();
const PORT = process.env.APP_PORT


start();

// Initialize the database
async function start() {
    await initialize();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use( '/', router);
    app.get('/users', router);
    app.post('/register', router);
    app.put('/users/:id', router);
    app.delete('/users/:id', router);

    app.listen(PORT, () =>
      console.log(`Server running on port http://localhost:${PORT}`))
  }


  
