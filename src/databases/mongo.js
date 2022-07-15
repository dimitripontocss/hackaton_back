import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DATABASE = process.env.DATABASE;

const mongoClient = new MongoClient(MONGO_URI);

export let db;

export async function connectDatabase () {
    try{
        await mongoClient.connect();
        const database = mongoClient.db(DATABASE);
        db={
            users:database.collection('users'),
            sessions:database.collection('sessions'),
            notes:database.collection('notes')
        } 
        console.log("Mongo conected");
    } catch (e) {
    console.log("Not conected to mongo error:", e)
    }
}