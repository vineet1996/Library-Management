const https = require('https')
const db = require('../_helpers/db');
const Issue = db.Issue;
const moment = require('moment');
var mongoose = require('mongoose');
const { Book } = require('../_helpers/db');

module.exports = {
    newReqIssue,
    requestList,
    approvalRequest,
    userrequestList,
    deleteRequest,
    getUserDataIssue,
    userReturnBook,
    deleteOldIssuedBook,
    adminAllOldData
};

// To get all request calls to admin of issue and acceptance of books from db.
async function requestList() {
    let allReq = await Issue.aggregate([
        { $match: { $or: [{pending: true}, {returnrequest: true}]  } },
        {
            $set: {
                // Setting string to mongo Object id for comparing below lookup query.
                userId: { $toObjectId: "$userId" },
                bookId: { $toObjectId: "$bookId" },
            },
        },
        // Set user details of particular issue.
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }

        },
        // Set book details of particular issue.
        {
            $lookup: {
                from: 'books',
                localField: 'bookId',
                foreignField: '_id',
                as: 'book'
            }

        },
        // As there will be single object, unwind will give just object instead of array of object.
        { '$unwind': '$user' }, 
        { '$unwind': '$book' },
        
    ]).sort( { _id: -1 } );
    return allReq;
}

// Save new book issue request to db.
async function newReqIssue(data) {
    let reqIssue = new Issue({
        userId: data.userId,
        bookId: data.bookId,
        takehome: data.takeHome,
        requesttime: moment().format()
    })
    let newReq = await reqIssue.save(); // Saving new issue request.
    let toUser = await userrequestList({id:reqIssue.userId}); // Getting updated request list of users.
    let toAdmin = await requestList(); // Getting updated request list of admin. 
    return {toUser: toUser, toAdmin: toAdmin} ;
}


/// Make changes in the db after admin approval of the user request.
async function approvalRequest(data) {
    let issueDets = data.issueDets;
    if(data.approval){
        if(data.returnreq) { // Updating db according to return or issue of the book by admin
            let apprData = await Issue.updateOne({_id: issueDets._id}, {$set: {returnrequest: false, returntime: moment().format()}});
            let updateretBook = await Book.updateOne({_id: issueDets.book._id}, {$inc: {stock: 1}});
        }
        else {
            let apprData = await Issue.updateOne({_id: issueDets._id}, {$set: {pending: false, approval: data.approval, issuedtime: moment().format()}});
            let updateBook = await Book.updateOne({_id: issueDets.book._id}, {$inc: {stock: -1}});
        }
        
    } 
    let toAdmin = await requestList(); // Sending admin updated request list.
    let toUserReqList = await userrequestList({id: issueDets.userId}); // Sending user his/her updated req list.
    let toUserIssuedList = await getUserDataIssue({id: issueDets.userId}); // Sending user his updated history data
    return {toAdmin, toUserReqList, toUserIssuedList};
}  

// Particular user's request list of issue and returning request of books from db.
async function userrequestList(user) {
    let allReq = await Issue.aggregate([
        { $match: {userId:user.id,  $or: [{pending: true}, {returnrequest: true}] } },
        {
            $set: {
                bookId: { $toObjectId: "$bookId" },
            },
        },
        {
            $lookup: {
                from: 'books',
                localField: 'bookId',
                foreignField: '_id',
                as: 'book'
            }

        },
        { '$unwind': '$book' },
    ]).sort( { _id: -1 } );
    return allReq;
}

// User deleting the book issue request from db.
async function deleteRequest(data) {
    issueDets = data.issueDets;
    user = data.user;
    let deleteReq = await Issue.remove({_id: issueDets._id});
    let toUser = await userrequestList(user);
    let toAdmin = await requestList()
    return {toUser: toUser, toAdmin: toAdmin} ;
}

// Getting user's history records on book issued from db.
async function getUserDataIssue(data) {
    let allIssuedList = await Issue.aggregate([
        { $match: {userId:data.id, pending: false, } },
        {
            $set: {
                bookId: { $toObjectId: "$bookId" },
            },
        },
        {
            $lookup: {
                from: 'books',
                localField: 'bookId',
                foreignField: '_id',
                as: 'book'
            }

        },
        { '$unwind': '$book' },
    ]).sort( { _id: -1 } );
    return allIssuedList
}

// Updating return status on user returing book request to db.
async function userReturnBook(issue) {
    let returnUpdate = await Issue.updateOne({_id: issue._id}, {$set: {returnrequest: true}});
    let toUser = await userrequestList({id:issue.userId}); // getting updated request list of users.
    let toAdmin = await requestList(); // getting updated request list of admin. 
    return {toAdmin, toUser};
}


// User deleting his/her old records from db.
async function deleteOldIssuedBook(issue) {
    let deleteIssue = await Issue.remove({_id: issue._id});
    return getUserDataIssue({id: issue.userId});
}


// Getting all users book issue history data to admin user from db.
async function adminAllOldData() {
    let allReq = await Issue.aggregate([
        { $match: { pending: false } },
        {
            $set: {
                userId: { $toObjectId: "$userId" },
                bookId: { $toObjectId: "$bookId" },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }

        },
        {
            $lookup: {
                from: 'books',
                localField: 'bookId',
                foreignField: '_id',
                as: 'book'
            }

        },
        { '$unwind': '$user' },
        { '$unwind': '$book' },
    ]).sort( { _id: -1 } );
    return allReq;
}