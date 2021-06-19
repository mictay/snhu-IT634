var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'})
var ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
//var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const popularShortNames = [
    {'name': 'DISNEY', sk: 'KMCO'},
    {'name': 'VEGAS', sk: 'KVGT'},
    {'name': 'NYC', sk: 'KJFK'},
]

/***********************************************
 */
exports.handler = async (event) => {
    console.log('Airports Get called');
    let q = event['queryStringParameters'];
    console.log("q", q);

    //Exit Fast for empty calls
    if(!q || !q['q'] || q['q'].length < 3) {
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify([]),
        };
        return response;
    }

    var filter = q['q'];
    filter = filter.toUpperCase();

    //Support for popular short names
    for(var i = 0; i < popularShortNames.length; i++) {
        if(filter === popularShortNames[i].name)
            filter = popularShortNames[i].sk;
    }

    var ret = [];

    var retSK;
    if (filter.length >=3 && filter.length <=4 ) {
        console.log('doQuery called BEGINS WITH CODE');

        if (filter.length === 3)
            retSK = await doQuerySK('K' + filter);
        else
            retSK = await doQuerySK(filter);

        if (retSK && retSK['Items'] && retSK['Items'].length > 0)
            ret.push(...retSK['Items']);

    }

    console.log('doQuery called BEGINS WITH NAME');
    const retName = await doQueryName(filter);
    ret.sort(compare);

    console.log('doQuery called BEGINS WITH CITY');
    const retCity = await doQueryCity(filter);

    console.log('doQuery called BEGINS WITH STATE');
    const retState = await doQueryState(filter);
    console.log("retState", retState);

    if (retName && retName['Items'] && retName['Items'].length > 0)
        addArray(ret, retName["Items"]);

    if (retCity && retCity['Items'] && retCity['Items'].length > 0)
        addArray(ret, retCity["Items"]);

    if (retState && retState['Items'] && retState['Items'].length > 0)
        addArray(ret, retState["Items"]);

    //ret.sort(compare);
    //console.log("ret", ret);

    // TODO implement
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({"airports": ret}),
    };
        console.log("q", q);
    return response;
};

/***********************************************
 * AIRPORT CODE
 * pk & sk
 */
async function doQuerySK(filter) {

    const params = {
        "TableName": "snhu-it634-2",
        "ScanIndexForward": true,
        "KeyConditionExpression": "pk = :PK AND begins_with(sk, :SK)",
        "Limit": "1",
        "ExpressionAttributeValues": {
          ":PK": "airports",
          ":SK": filter
        }
    };

    const queryOutput = await ddb.query(params).promise();
    return queryOutput;
}

/***********************************************
 * STATE
 * gpk1 & gsk1
 */
async function doQueryState(filter) {

    const params = {
        "TableName": "snhu-it634-2",
        "ScanIndexForward": true,
        "IndexName": "gpk1-gsk1",
        "KeyConditionExpression": "gpk1 = :PK AND begins_with(gsk1, :SK)",
        "Limit": "10",
        "ExpressionAttributeValues": {
          ":PK": "airports",
          ":SK": filter
        }
    };

    const queryOutput = await ddb.query(params).promise();
    return queryOutput;
}

/***********************************************
 * COUNTRY
 * gpk2 & gsk2
 */
async function doQueryCountry(filter) {

    const params = {
        "TableName": "snhu-it634-2",
        "ScanIndexForward": true,
        "IndexName": "gpk2-gsk2",
        "KeyConditionExpression": "gpk2 = :PK AND begins_with(gsk2, :SK)",
        "Limit": "3",
        "ExpressionAttributeValues": {
          ":PK": "airports",
          ":SK": filter
        }
    };

    const queryOutput = await ddb.query(params).promise();
    return queryOutput;
}

/***********************************************
 * NAME
 * lsk1
 */
async function doQueryName(filter) {

    const params = {
        "TableName": "snhu-it634-2",
        "ScanIndexForward": true,
        "IndexName": "lsk1Index",
        "KeyConditionExpression": "pk = :PK AND begins_with(lsk1, :SK)",
        "Limit": "5",
        "ExpressionAttributeValues": {
          ":PK": "airports",
          ":SK": filter
        }
    };

    const queryOutput = await ddb.query(params).promise();
    return queryOutput;
}

/***********************************************
 * CITY
 * lsk2
 */
async function doQueryCity(filter) {

    const params = {
        "TableName": "snhu-it634-2",
        "ScanIndexForward": true,
        "IndexName": "lsk2Index",
        "KeyConditionExpression": "pk = :PK AND begins_with(lsk2, :SK)",
        "Limit": "5",
        "ExpressionAttributeValues": {
          ":PK": "airports",
          ":SK": filter
        }
    };

    const queryOutput = await ddb.query(params).promise();
    return queryOutput;
}

/***********************************************
 */
function compare(a, b) {
  if (a.name > b.name) return 1;
  if (b.name > a.name) return -1;

  return 0;
}

/***********************************************
 */
function addArray(src, cpy) {
    
    for(var i = 0; i < cpy.length; i++) {
        
        var bfound = false;
        for(var y=0; y< src.length; y++) {
            if (src[y].sk === cpy[i].sk)
                bfound = true;
        }

        if(!bfound) {
            src.push(cpy[i]);
        }
        
    }
    
}