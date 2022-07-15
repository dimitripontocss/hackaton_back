import { loginSchema } from '../schemas/authSchemas.js';
import bcrypt from 'bcrypt';
import { db } from '../databases/mongo.js';
import { stripHtml } from "string-strip-html";

async function generateErrorLogin(object){
    const {error} = loginSchema.validate(object);
        if (error) {
            const errorMessages=error.details.map(item=>item.message);
            let message='';
            errorMessages.forEach(err=>{
                if((/\"email\" is required/).test(err)){
                    message+='Email field is required!\n';
                }else if((/\"password\" is required/).test(err)){
                    message+='Password field is required!\n';
                }
            });
            return message;
            
        }
}

async function loginValidation(req, res, next) {
    try {
        const body = req.body;
        for (const key of Object.keys(body) ){
            body[key]= stripHtml(body[key]).result.trim();
        };
        const errorMessages= await generateErrorLogin(body);
        if(errorMessages) return res.status(422).send(errorMessages);        
        const user = await db.users.findOne({ email: body.email });
        if (!user) {
            return res.status(401).send('Invalid email or password.');
        }
        const hashCheck = await bcrypt.compare(body.password, user.passwordHash);
        if (!hashCheck) {
            return res.status(401).send('Invalid email or password.');
        }
        res.locals.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export default loginValidation;
