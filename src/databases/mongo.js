import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect()
    const db = mongoClient.db(process.env.DATABASE) 
    console.log("Mongo conected")
} catch (e) {
    console.log("Not conected to mongo error:", e)
}

export default db;