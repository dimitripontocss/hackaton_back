import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../databases/mongo.js';
import { stripHtml } from "string-strip-html";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export async function login(_req, res) {
    try {
        const user = res.locals.user;
        await db.sessions.deleteMany({ userId: user._id });
        await db.sessions.insertOne({ userId: user._id });
        const session = await db.sessions.findOne({ userId: user._id });
        const token = jwt.sign(
            { sessionId: session._id },
            JWT_SECRET,
            { expiresIn: 60 * 60 * 24 * 30 }
        );

        return res.status(200).send({
            username: user.name,
            token
        });

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function signup(req, res) {
    try {
        const body = req.body;
        for(const key of Object.keys(body) ){
            body[key]=stripHtml(body[key]).result.trim();
        };

        const passwordHash = await bcrypt.hash(body.password, 10);
        await db.users.insertOne({
            name: body.name,
            email: body.email,
            passwordHash,
        });
        return res.sendStatus(201);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

