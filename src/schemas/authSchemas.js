import joi from 'joi';

const loginSchema = joi.object({
    email: joi.required(),
    password: joi.required(),
});

const signupSchema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email().required(),
    password:joi.string().pattern(/(?=.*?[A-Z])/).pattern(/(?=.*?[a-z])/).pattern(/(?=.*?[0-9])/).pattern(/(?=.*?[#?!@$%^&*-])/).min(8).required(),
});

export {loginSchema, signupSchema}