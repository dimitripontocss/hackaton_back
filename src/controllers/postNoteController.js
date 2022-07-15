import { db } from '../databases/mongo.js';
import { ObjectId } from 'mongodb'
import dayjs from 'dayjs';

import newNoteSchema from '../schemas/noteSchema.js';

export async function postNote(req,res){
    const {sessionId} = res.locals.sessionID;
    const newNote = req.body;
    
    const { error } = newNoteSchema.validate(newNote);
    if(error){
        return res.sendStatus(422);
    }
    const possibleSession = await db.sessions.findOne({ _id: new ObjectId(sessionId) });
    if(!possibleSession){
        return res.sendStatus(401);
    }
    const titleExist = await db.notes.find({ title: newNote.title });
    if(titleExist.title){
        return res.status(409).send("Title already used! Try a new one or update other note");
    }

    const date = dayjs().format('DD/MM:HH:mm');
    await db.notes.insertOne({ 
        title: newNote.title,
        content: newNote.content,
        userId: possibleSession.userId,
        date: date
    });
    res.sendStatus(201);
}