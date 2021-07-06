const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
AWS.config.update({region: 'us-east-1'})
var ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

/***********************************************
 */
exports.handler = async (event) => {
    console.log('snhu-it634-book called');

    try {
        var ret = {};
        var body = '';

        if(!event.headers)
            throw 'Authorization required';

        console.log('snhu-it634-book found headers');

        var decoded = jwt.decode(event.headers['Authorization']);
        console.log('snhu-it634-book decoded', decoded);

        var username = decoded['cognito:username'];
        console.log('snhu-it634-book username', username);
        
        if (event.body) {
            let body = JSON.parse(event.body);
            console.log('snhu-it634-book body', body);

            //const result = await doPut(username, body);
            //console.log('snhu-it634-book doPut.result', result);
        }

        ret = {'status': 'ok'};

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
async function doPut(username, flightdata) {

    const params = {
        "TableName": "snhu-it634-2",
        "Key": {'pk': 'booked-' + username, 'sk': uuidv4()},
        "flightdata": JSON.stringify(flightdata)
    };

    const result = await ddb.put(params).promise();
    return result;
}

/***********************************************
 */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}