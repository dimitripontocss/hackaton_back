import jwt from "jsonwebtoken";

export async function jtwAuth(req,res,next){
    try{
        const key = process.env.JWT_SECRET;
        const { authorization } = req.headers;
		const token = authorization?.replace("Bearer ", "");
        const sessionID = jwt.verify(token, key);
        //Pass to the controllers the sessionID
        res.locals.sessionID = sessionID;
        next();
    }catch(error){
        console.log(error);
		return res.sendStatus(500);
    }
}