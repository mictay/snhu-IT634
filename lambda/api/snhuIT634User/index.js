const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
AWS.config.update({region: 'us-east-1'})
var ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

/***********************************************
 */
exports.handler = async (event) => {
    
    try {
        var ret = {};

        var decoded = jwt.decode(event.headers['Authorization']);
        console.log('decoded', decoded);
    
        var username = decoded['cognito:username'];
        const getResult = await doGet(username);
        ret = {'user': getResult['Item']};
        
        const getQueryResults = await doQueryBook(username);
        console.log('getQueryResults', getQueryResults);
        ret['booked'] = getQueryResults['Items'];

    } catch (err) {
        ret = {'error': JSON.stringify(err)};
    }

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(ret),
    };

    return response;
};

/***********************************************
 * USERNAME
 * pk & sk
 */
async function doGet(username) {

    const params = {
        "TableName": "snhu-it634-2",
        "Key": {'pk': 'users', 'sk': username}
    };

    const queryOutput = await ddb.get(params).promise();
    return queryOutput;
}

/***********************************************
 * USERNAME
 * pk & sk
 */
async function doQueryBook(username) {

    const params = {
        "TableName": "snhu-it634-2",
        "KeyConditionExpression": 'pk = :pk',
        "ExpressionAttributeValues": {
            ':pk': 'booked-' + username
        }
    };

    const result = await ddb.query(params).promise();
    return result;
}