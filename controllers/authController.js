const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

const { UserModel } = require("../models/userModel");

async function login(req, res) {
    const secret = process.env.SALT;
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!username || !password) res.status(400).send({ message: `Bed request: send me username and password` });

        else if (!user) res.status(400).send({ message: "Login is incorrect" });

        else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) res.status(400).send({ message: "Password is incorrect" });
            else {
                const token = jwt.sign({ userId: user.id, role: user.role }, secret, {
                    expiresIn: "5d",
                });
                /* 
                    jwt.sign -> create token
                    secret -> secret for virify
                    expiresIn: "1d"  -> token live 1 day. 
                */
                res.status(200).send({
                    token: token,
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    login,
};

// 1. Find User by username
// 2. if it exists, compare password with database
// 3. if comparison is successfull, access granted and generate jwt
