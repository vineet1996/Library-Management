const https = require('https')
const db = require('../_helpers/db');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../_helpers/dbconfig.json');

module.exports = {
    authentication,
    getById,
    createUser,
    createAdmin
};


async function authentication(data) {
    const user = await User.findOne({ username: data.username});
    if(user) {
        if (user && bcrypt.compareSync(data.password, user.password)) {
            const token = jwt.sign({ sub: user.id }, config.secret, {expiresIn: 86400});
            const userWithoutPassword = {
                id: user._id,
                username: user.username,
                isadmin: user.isadmin,
                token
            }
            return {success: true, user: userWithoutPassword} 
        }
        else return {success: false, err: 'pwdwrg'}
    }
    else return {success: false, err: 'nouser'}
    
}

async function getById(id) {
    return User.findById(id).select('-hash');  
}

async function createUser(userData) {
    // check if any field is empty
    if(userData.name && userData.email && userData.mobile && userData.gender && userData.membershipdays && userData.readinghours && userData.username && userData.password) {
        let newUser = new User({
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            gender: userData.gender,
            membershipdays: userData.membershipdays,
            readinghours: userData.readinghours,
            username: userData.username,
        })
        newUser.password = bcrypt.hashSync(userData.password, 10);
        newUser.save();
        return {success: true};
    }
    return {success: false, msg: "Field missing"};
}

async function createAdmin(adminData) {
    // check if any field is empty
    if(adminData.username && adminData.password) {
        let newUser = new User({
            username: adminData.username,
            isadmin: true
        })
        newUser.password = bcrypt.hashSync(adminData.password, 10);
        newUser.save();
        return {success: true};
    }
    return {success: false, msg: "Field missing"};
}
