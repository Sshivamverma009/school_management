import mysql, { escape } from "mysql2"
import dotenv from "dotenv"
dotenv.config();

const dbConnection = () => {

    const response = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    if(response){
      console.log("Database connected successfully!");
      return response;
    }
    else{
      console.log("Database not connected!");
    }
}

const db = dbConnection();

export default db;
