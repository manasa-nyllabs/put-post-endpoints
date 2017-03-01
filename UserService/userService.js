/**
 * Created by sesha on 3/1/17.
 */


'use strict';

var AWS = require("aws-sdk");
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const hat = require('hat');

var docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE;

// LAMBDA TO CREATE A USER --
module.exports.createUser = function(event, context, callback) {
    var Id = hat();

    // Expected body from the user
    // var newUser = {
    //     "email" : "seshasaisrivatsav@gmail.com",
    //     "resAddress" : {
    //         "addLine1" : "40 Newport Pkwy",
    //         "addLine2" : "apt 3302",
    //         "zip" : "07310",
    //         "city" : "Jersey City",
    //         "state" : "New Jersey",
    //         "country" : "United States of America"
    //     },
    //     "offAddress" : {
    //         "addLine1" : "245 5th Avenue",
    //         "addLine2" : "1502",
    //         "zip" : "10016",
    //         "city" : "New York City",
    //         "state" : "New York",
    //         "country" : "United States of America"
    //     },
    //     "resPhone" : 6174479680,
    //     "offPhone" : 6178978907,
    //     "govtId" : {
    //         "dob": 692496052,
    //         "docId": "afefbsgb",
    //         "lName": "kuchibhotla",
    //         //"mName" : "",
    //         "fName": "Sesha Sai Srivatsav",
    //         "type": "DL"
    //     },
    //
    //     "citizenship" : "India",
    //     "dob" : 692496052,
    //     "lName": "kuchibhotla",
    //     //"mName" : "",
    //     "fName": "Sesha Sai Srivatsav",
    //     "ssn" : 1221221231
    //    };





    var newUser = JSON.parse(event.body);

    var finalUser = createNewUser(newUser);


    var params = {
        TableName : TABLE_NAME,
        Item : finalUser
    };



    dynamo.putItem(params, function(err, data) {
        if (err){
            callback(err,null);
        }
        else {
            const response = {
                statusCode: 200,
                body: "Row added",
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
        finalUser.timeStamps = {
            insertTs: date
        };



        return finalUser;
    }
};
