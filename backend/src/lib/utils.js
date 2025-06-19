import jwt from "jsonwebtoken"

export const generateTokens = async (id, res) =>{

    if(!id) return res.status(400).
    json({message:"id not found"});

    const token = jwt.sign({id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    res.cookie("jwt", token, {
        expiresIn: "7*24*60*60*1000", //ms
        httpOnly: true, //prevent cross site scripting attacks
        secure: process.env.NODE !== 'devlopment',
        sameSite: "strict" //prevent cross site request forgering
    })

    return token
}

