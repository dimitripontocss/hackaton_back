import joi from 'joi';

const newNoteSchema = joi.object({
    title: joi.string().required(),
    content: joi.string().required()
});

export default newNoteSchema;