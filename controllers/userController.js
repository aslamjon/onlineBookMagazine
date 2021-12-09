const { UserModel } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { logger } = require("../utiles");

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

async function createUser(req, res) {
    try {
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
                    if (role) {
                        const { userId } = req.user;
                        let user = await UserModel.findById(userId)
                        if (user.role !== userRole) userRole = role;
                    }
                    
                    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
                    
                    const newUser = new UserModel({
                        username,
                        email,
                        role: userRole,
                        password: hashedPassword
                    })
                    
                    await newUser.save();
                    res.status(200).send({ message: 'User has been created' });
                }
            }
        }
    } catch (error) {
        logger(`IN CREATE_USER: ${error.message}`, { status: "ERROR", res });
    }
}

async function getMe(req, res) {
    try {
        const { userId } = req.user;
        const user = await UserModel.findById(userId);
        res.send(user);
    } catch (e) {
        logger(`IN GET_ME: ${e.message}`, { status: "ERROR", res });
    }
}

async function updateUser(req, res) {
    try {
        const { userId } = req.user;
        const { firstName, lastName, phoneNumber } = req.body;
        const userExists = UserModel.findById(userId);
        if (!firstName && !lastName && !phoneNumber) res.status.send({ message: "Bad request" });
        else if (!userExists) res.status(404).send({ message: "User not found" });
        else {
            let newUpdate = await UserModel.findOneAndUpdate({ _id: userId }, {
                firstName: firstName || userExists.firstName,
                lastName: lastName || userExists.lastName,
                phoneNumber: phoneNumber || userExists.phoneNumber
            });
            res.send({ message: "User has been updated" })
        }
    } catch (e) {
        logger(`IN UPDATE_USER: ${e.message}`, { status: "ERROR", res });
    }
}

module.exports = {
    createUser,
    getMe,
    updateUser
}