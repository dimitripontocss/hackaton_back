import { db } from '../databases/mongo.js';
import { ObjectId } from 'mongodb'

export async function postNote(req,res){
    const {sessionId} = res.locals.sessionID;
    const newNote = req.body;
    const possibleSession = await db.sessions.findOne({ _id: new ObjectId(sessionId) });
    if(!possibleSession){
        return res.sendStatus(401);
    }
    const date = dayjs().format('DD/MM:HH:mm');
    const titleExist = await db.notes.find({ title: newNote.title });
    if(titleExist){
        return res.status(409).send("Title already used! Try a new one or update other note");
    }
    await db.notes.insertOne({ 
        title: newNote.title,
        content: newNote.content,
        date: date
    });
    res.sendStatus(201);
}