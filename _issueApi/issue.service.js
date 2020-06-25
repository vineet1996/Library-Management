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

async function requestList() {
    let allReq = await Issue.aggregate([
        { $match: { pending: true } },
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
    ]);
    return allReq;
}

async function newReqIssue(data) {
    console.log(data);
    let reqIssue = new Issue({
        userId: data.userId,
        bookId: data.bookId,
        takehome: data.takeHome,
        requesttime: moment().format()
    })
    let newReq = await reqIssue.save();
    let toUser = await userrequestList({id:reqIssue.userId});
    let toAdmin = await getSingleIssueDetails(newReq);
    return {toUser: toUser, toAdmin: toAdmin} ;
}

async function getSingleIssueDetails(data) {
    let issueDets = await Issue.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(data._id) } },
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
    ]);
    return issueDets[0];
}

async function approvalRequest(data) {
    let issueDets = data.issueDets;
    let apprData = await Issue.updateOne({_id: issueDets._id}, {$set: {pending: false, approval: data.approval, issuedtime: moment().format()}})
    if(data.approval){
        let updateBook = await Book.updateOne({_id: issueDets.book._id}, {$inc: {stock: -1}});
    } 
    let toAdmin = await requestList();
    let toUserReqList = await userrequestList({id: issueDets.userId});
    let toUserIssuedList = await getUserDataIssue({id: issueDets.userId});
    return {toAdmin, toUserReqList, toUserIssuedList};
}  

async function userrequestList(user) {
    let allReq = await Issue.aggregate([
        { $match: {userId:user.id, pending: true } },
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
    ]);
    return allReq;
}

async function deleteRequest(data) {
    issueDets = data.issueDets;
    user = data.user;
    let deleteReq = await Issue.remove({_id: issueDets._id});
    let toUser = await userrequestList(user);
    let toAdmin = await requestList()
    return {toUser: toUser, toAdmin: toAdmin} ;
}

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
    ]);
    return allIssuedList
}


async function userReturnBook(issue) {
    let returnUpdate = await Issue.updateOne({_id: issue._id}, {$set: {returntime: moment().format()}});
    let updateBook = await Book.updateOne({_id: issue.book._id}, {$inc: {stock: 1}});
    return getUserDataIssue({id: issue.userId});
}

async function deleteOldIssuedBook(issue) {
    let deleteIssue = await Issue.remove({_id: issue._id});
    return getUserDataIssue({id: issue.userId});
}

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
    ]);
    console.log(allReq)
    return allReq;
}