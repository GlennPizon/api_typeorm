import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

let dbName = "mysql_crud";
dotenv.config();
let connection;
const host = process.env.DB_HOST;
const port = parseInt(process.env.DB_PORT);
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Loay4321*'; FLUSH PRIVILEGES;


export const initialize = async () => {
    try {
      // Create the connection object here
      connection = await mysql.createConnection(connectOptions);
      
      // Check if db exists
      await createDB(dbName);
      //initialize typeorm
  
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (err) {
      console.error(`Error connecting to database:`);
      throw err;
    } finally{
        if(connection){
            connection.end();
        }
    }
  };


  async function checkDatabaseExists(dbName: string): Promise<boolean> {
    try {
      const [rows] = await connection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`
      );
      return (rows as any).length > 0;
    } catch (err) {
      console.error(`Error checking database existence:`, err);
      return false;
    }
  }


const connectOptions = {
    host: host,
    port: port,
    user: user,
    password: password
}



async function createDB(dbName: string){
    const dbExists = await checkDatabaseExists(dbName);
    if(!dbExists){
        connection.query(`CREATE DATABASE ${dbName}`);
        console.log(`Database ${dbName} created successfully`);
        
    }

    else{
        console.log(`Database ${dbName} already exists`);
    }
    
}

export const AppDataSource = new DataSource({
    type: "mysql",
    host: host,
    port: port,
    username: user,
    password: password,
    database: dbName,
    //synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})


