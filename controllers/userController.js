const { UserModel } = require("../models/userModel");
const bcrypt = require("bcryptjs");

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

async function createUser(req, res) {
    const { username, email, password, role } = req.body;
    
    const usernameExists = await UserModel.findOne({ username });
    const EmailExists = await UserModel.findOne({ email });
    if (usernameExists || EmailExists) {
        if (usernameExists && EmailExists) res.status(400).send({ message: "Username and Email is already exists" });
        else if (usernameExists) res.status(400).send({ message: "Username is already exists" });
        else res.status(400).send({ message: "Email is already exists" });
    } else {
        if ( !username || !email || !password ) res.status(400).send({ message: "Bad request" })
        else {
            if (!validateEmail(email)) res.status(400).send({ message: "email: Please fill a valid email address" })
            else {
                let userRole = 'user';
                // if (role) {
                //     const { userId } = req.user;
                //     let user = await UserModel.findById(userId)
                //     if (user.role !== userRole) userRole = role;
                // }
                
                const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
                
                const newUser = new UserModel({
                    username,
                    email,
                    role: userRole,
                    password: hashedPassword
                })
                try {
                    await newUser.save();
                    res.status(200).send({
                        message: 'User has been created'
                    })
                } catch (error) {
                    throw error.message;
                }
            }
        }
    }
}

async function getMe(req, res) {
    try {
        const { userId } = req.user;
        const user = await UserModel.findById(userId);
        res.send(user);
    } catch (err) {
        throw err.message;
    }
}

module.exports = {
    createUser,
    getMe
}