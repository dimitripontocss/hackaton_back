import joi from 'joi';
import { db } from '../databases/mongo.js';
import { stripHtml } from "string-strip-html";

const signupSchema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email().required(),
    password:joi.string().pattern(/(?=.*?[A-Z])/).pattern(/(?=.*?[a-z])/).pattern(/(?=.*?[0-9])/).pattern(/(?=.*?[#?!@$%^&*-])/).min(8).required(),
});

async function generateErrorSignUp(object){
    const {error} = signupSchema.validate(object,{abortEarly:false});
        if (error) {
            const errorMessages=error.details.map(item=>item.message);
            let message='';
            for(const err of errorMessages){
                if((/\"name\" is required/).test(err)){
                    message+='Name field is required!\n';
                }else if(err.includes('"name" is not allowed to be empty')){
                    message+='Name field is not allowed to be empty!\n';
                }else if(err.includes('"name" length must be at least 3 characters long')){
                    message+='Name length must be at least 3 characters long!\n';
                }else if((/\"email\" is required/).test(err)){
                    message+='Email field is required!\n';
                }else if(err.includes('"email" is not allowed to be empty')){
                    message+='Email field is not allowed to be empty\n';
                }else if((/\"password\" is required/).test(err)){
                    message+='Password field is required!\n';
                }else if(err.includes('"password" is not allowed to be empty')){
                    message+='Password field is not allowed to be empty!\n';
                }else if((/\"email" must be a valid email/).test(err)){
                    message+='Email must be a valid email!\n';
                }else if(err.includes("/(?=.*?[A-Z])/")){
                    message+='Password must contain at least 1 capital character!\n';
                }else if(err.includes("/(?=.*?[a-z])/")){
                    message+='Password must contain at least 1 lower case character!\n';
                }else if(err.includes("/(?=.*?[0-9])/")){
                    message+='Password must contain at least 1 number!\n';
                }else if(err.includes('/(?=.*?[#?!@$%^&*-])/')){
                    message+='Password must contain at least 1 special character!\n';
                }else if(err.includes('"password" length must be at least 8 characters long')){
                    message+='Password must contain at least 8 characters long\n';
                }else{
                    message+=err+'\n';
                }
            };
            return message;
        }
}

async function signupValidation(req, res, next) {
    try {
        const body = req.body;

        for(const key of Object.keys(body) ){
            body[key]=stripHtml(body[key]).result.trim();
        };

        const errorMessages= await generateErrorSignUp(body);
        console.log(errorMessages);
        if(errorMessages) return res.status(422).send(errorMessages); 

        const searchEmail = await db.users.findOne({ email: body.email });
        if (searchEmail) {
            return res.status(409).send('Email already registered!');
        }

        next();
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export default signupValidation;
