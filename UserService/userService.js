/**
 * Created by sesha on 3/1/17.
 */


'use strict';

var AWS = require("aws-sdk");
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const hat = require('hat');
//var dynamoPromise = require('./utils/dynamoPromise');

//var docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE;

// LAMBDA TO CREATE A USER --
module.exports.createUser = function(event, context, callback) {
    var Id = hat();
    var newUser = JSON.parse(event.body);
    var finalUser = createNewUser(newUser);

    var params = {
        TableName : TABLE_NAME,
        Item : finalUser
    };

    // return dynamoPromise
    //     .put(params)
    //     .then(
    //         function (data) {
    //             console.log("success");
    //             const response = {
    //                 statusCode: 200,
    //                 body: "User successfully created",
    //                 headers: {
    //                     "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
    //                 }
    //             };
    //             console.log(response);
    //
    //             return response;
    //     })
    //     .catch(function (err) {
    //         console.log("Error");
    //         return err;
    //     });


    dynamo.putItem(params, function(err, data) {
        if (err){
            callback(err,null);
        }
        else {
            const response = {
                statusCode: 200,
                body: "User successfully created",
                headers: {
                    "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
                }
            };
            callback(null, response);
        }
    });


    function createNewUser(newUser) {

        // ID generation
        var Id = hat();


        // Mandatory fields below
        var finalUser = {
            "userId" : Id,
            "contactInfo" : {
                "activeEmail" : newUser.email,
                "emails": [
                    newUser.email
                ]
            },
            "persInfo" : {
                "dob": newUser.dob,
                "fName": newUser.fName,
                "lName" : newUser.lName
            }
        };


        // checks for non mandatory fields
        // Needed info on "citizenship"

        // 1. Addresses (office and personal)
        var addresses = [];
        if(newUser.resAddress){
            var resAddress = newUser.resAddress;
            resAddress.type = "R";
        }
        if(newUser.offAddress){
            var offAddress = newUser.offAddress;
            offAddress.type = "O";
        }
        addresses.push(resAddress, offAddress);
        finalUser.contactInfo.addresses = addresses;


        // 2. Phones
        var phones = [];
        if(newUser.resPhone){
            var residence = {};
            residence.number = newUser.resPhone;
            residence.type = "R";
        }
        if(newUser.offPhone){
            var office = {};
            office.number = newUser.offPhone;
            office.type = "O";
        }
        phones.push(residence, office);
        finalUser.contactInfo.phones = phones;

        // 3. SSN
        if (newUser.ssn){
            finalUser.persInfo.ssn = newUser.ssn;
        }

        // 4. middlename
        if(newUser.mName){
            finalUser.persInfo.mName = newUser.mName;
        }


        // 5. govtId
        if(newUser.govtID){
            finalUser.governmentId = newUser.govtId;
        }

        // 6. timeStamp
        var date = new  Date().getTime();
        finalUser.timestamps = {
            insertTs: date
        };



        return finalUser;
    }
};
