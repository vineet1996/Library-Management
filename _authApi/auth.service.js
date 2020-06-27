const https = require('https')
const db = require('../_helpers/db');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../_helpers/dbconfig.json');
const moment = require('moment');
const { update } = require('../models/user.model');
module.exports = {
    authentication,
    getById,
    createUser,
    createAdmin,
    UserDetailsService,
    updateUserDetailsService,
    userPasswordReset,
    updateMembership
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
            if(!user.isadmin) userWithoutPassword.membership = user.membershipdays
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
    let checkUsername = await User.findOne({username: userData.username});
    if(checkUsername) {
        return {success: false, msg: "User already exists"};
    }
    if(userData.name && userData.email && userData.mobile && userData.gender && userData.membershipdays && userData.readinghours && userData.username && userData.password) {
        let newUser = new User({
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            gender: userData.gender,
            membershipdays: userData.membershipdays,
            readinghours: userData.readinghours,
            username: userData.username,
            referencedate: moment().format(),
        })
        newUser.password = bcrypt.hashSync(userData.password, 10);
        newUser.save();
        return {success: true};
    }
    return {success: false, msg: "Field missing"};
}

async function createAdmin(adminData) {
    let checkUsername = await User.findOne({username: adminData.username});
    if(checkUsername) {
        return {success: false, msg: "User already exists"};
    }
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

async function UserDetailsService(data) {
    let userDets = await User.findOne({_id: data.id});
    return userDets;
}

async function updateUserDetailsService(data) {
    let updateDets = await User.updateOne({_id: data._id}, {$set: data});
    return UserDetailsService({id: data._id});
}

async function userPasswordReset(data) {
    let newPass = bcrypt.hashSync(data.newPassword, 10);
    let updateDets = await User.updateOne({_id: data._id}, {$set: {password: newPass}});
    return UserDetailsService({id: data._id});
}

async function updateMembership(data) {
    let userDets = await User.findOne({_id: data.id});
    let referenceDate = moment(new Date(userDets.referencedate));
    let currentDate = moment();
    let check = currentDate.diff(referenceDate, 'days');
    if(check > 0) {
        let updateUser = await User.findOneAndUpdate({_id: data.id}, {$set: {referencedate: referenceDate.add(check,'days')}, $inc: {membershipdays: -check}});
        return {success: true, user: updateUser}
    }
    else return {success: false, user: userDets};
}
