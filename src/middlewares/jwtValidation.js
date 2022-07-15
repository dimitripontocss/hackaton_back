import jwt from "jsonwebtoken";

export async function jtwAuth(req,res,next){
    try{
        const key = process.env.JWT_SECRET;
        const { authorization } = req.headers;
        if(!authorization){
            return res.sendStatus(204);
        }
		const token = authorization?.replace("Bearer ", "");
        const sessionID = jwt.verify(token, key);
        //Pass to the controllers the sessionID
        res.locals.sessionID = sessionID;
        next();
    }catch(error){
        console.log(error);
        if(error == "JsonWebTokenError: invalid token"){
            return res.sendStatus(401);
        }
		return res.sendStatus(500);
    }
}