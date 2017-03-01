/**
 * Created by sesha on 3/1/17.
 */
'use strict';
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

exports.put = function (params) {
    return new Promise(function (resolve, reject) {
        dynamo.putItem(params, function(err, data){
            if (err)
                return reject(err);
            else {
                //console.info('putting data:', JSON.stringify(data));
                return resolve(data);
            }
        });
    });
};
