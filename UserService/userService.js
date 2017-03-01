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
    var body = {
        "email" : "seshasaisrivatsav@gmail.com",
        "resAddress" : {
            "addLine1" : "40 Newport Pkwy",
            "addLine2" : "apt 3302",
            "zip" : "07310",
            "city" : "Jersey City",
            "state" : "New Jersey",
            "country" : "United States of America"
        },
        "offAddress" : {
            "addLine1" : "245 5th Avenue",
            "addLine2" : "1502",
            "zip" : "10016",
            "city" : "New York City",
            "state" : "New York",
            "country" : "United States of America"
        },
        "resPhone" : 6174479680,
        "offPhone" : 6178978907,
        "govtID" : {
            "dob": 692496052,
            "docId": "afefbsgb",
            "lName": "kuchibhotla",
            //"mName" : "",
            "fName": "Sesha Sai Srivatsav",
            "type": "DL"
        },

        "citizenship" : "India",
        "dob" : 692496052,
        "lName": "kuchibhotla",
        //"mName" : "",
        "fName": "Sesha Sai Srivatsav",
        "ssn" : 1221221231,



        }



    };
    body = JSON.parse(event.body);

    var params = {
        TableName : TABLE_NAME,
        Item: {
            "userId" : Id,
            "contactInfo" :

        }
    };

    dynamo.putItem(params, function(err, data) {
        if (err){
            callback(err,null);
        }
        else {
            const response = {
                statusCode: 200,
                body: "Row added"
            };
            callback(null, response);
        }
    });
};
