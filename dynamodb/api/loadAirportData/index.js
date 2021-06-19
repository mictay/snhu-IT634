var AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'})

var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var allParams = [];
const scanMaxRecords = 25;
var deleteMaxRecords = scanMaxRecords * 500;
const insertBatchSize = 25;

var recordsInsertedCount = 0;
var recordsDeletedCount = 0;

exports.handler = async (event) => {
    console.log("Lambda AirportData Called");
    var response;

    //Reset this vars on new request
    recordsInsertedCount = 0;
    recordsDeletedCount = 0;

    //Reset the AllParams data for this request
    allParams = event;

    try {

        if (!true) {
            //console.log("S3", JSON.stringify(event));
            console.log("DEBUG STOP");
            response = {
                statusCode: 200,
                body: JSON.stringify("DEBUG STOPPED")
            };
            return response;
        }
    
        // Do the delete Stuff
        if (allParams['action'] && allParams['action'] === 'delete') {
            response = await doDeleteAll();
            return response;
        
        // Do the Batch Stuff
        } else if (allParams.length > 0) {
            console.log("AllParams.length", allParams.length);
            response = await doInsertBatch();
            return response;
        }

        return response;

    } catch (err) {
        console.log(err);
        return err;
    }

};

/***********************************************
 */
async function doDeleteAll(cProtect = 0) {
    console.log("doDeleteAll called deleteMaxRecords=" + deleteMaxRecords, cProtect);
    var response;

    try {
        const scanResult = await doScan();
        var count = scanResult.Count;
        console.log("scan count", count);

        cProtect = cProtect + count;

        const delItems = scanResult.Items;

        //Fix up the array to be a batch delete request
        for(var i = 0; i < count; i++) {
            delItems[i] = {"DeleteRequest": {"Key": delItems[i]}};
        }

        const deleteResult = await doDelete(delItems);
        console.log("deleteResult", deleteResult);

        // Are we done? if so, return the response
        if(count === 0 || cProtect >= deleteMaxRecords) {
            console.log("doDeleteAll completed");
            response = {
                statusCode: 200,
                body: JSON.stringify("Completed cProtect=" + cProtect)
            };
            return response;

        } else {
            //Do it again, till we're done
            const deleteAllResult = await doDeleteAll(cProtect);
            console.log("deleteAllResult", deleteAllResult);
        }

    } catch (err) {
        console.log("doDeleteAll Catch", err)
        response = {
            statusCode: 200,
            body: JSON.stringify(err)
        };
        return response;
    }

}


/***********************************************
 */
async function doInsertBatch(startIndex =  0) {
    var response;

    //Allow thresholds to settle down
    await sleep(100);

    try {

        var endIndex = startIndex + insertBatchSize;
        console.log("doInsertBatch startIndex=" + startIndex + " endIndex=" + endIndex);

        // HARD DEBUG STOP
        if (startIndex === 20000) {
           const message = "STOPPED: startIndex=" + startIndex + " dataLength=" + allParams.length + " recordsWritten=" + recordsInsertedCount;
            console.log(message);
            const response = {
                statusCode: 200,
                body: JSON.stringify(message)
            };
            return response;
        }

        // Stop if our Start index is bigger than our data size
        if (startIndex >= allParams.length) {
           const message = "STOPPED: startIndex=" + startIndex + " dataLength=" + allParams.length + " recordsWritten=" + recordsInsertedCount;
            console.log(message);
            const response = {
                statusCode: 200,
                body: JSON.stringify(message)
            };
            return response;
        }

        if (endIndex >= allParams.length) {

            //console.log("doInsertBatch: write with only startIndex");
            var data = await write(startIndex);
            var retryCount = 0;

            while(data['UnprocessedItems'] && data['UnprocessedItems']['snhu-it634-2'] && data['UnprocessedItems']['snhu-it634-2'].length > 0 && retryCount < 5) {
                console.log('UnprocessedItems Retry', retryCount)

                for(var i = 0; i < data['UnprocessedItems']['snhu-it634-2'].length; i++) {
                    console.log("retry", JSON.stringify(data['UnprocessedItems']['snhu-it634-2'][i]));
                }

                data = await write(startIndex);
                retryCount = retryCount + 1;
            }

            //Increment our startIndex
            startIndex = startIndex + insertBatchSize;
             
            if (startIndex >= allParams.length) {
                const message = "STOPPED: startIndex=" + startIndex + " dataLength=" + allParams.length + " recordsWritten=" + recordsInsertedCount;
                console.log(message);
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(message)
                };
                return response;

            } else {
                //recursively call this method
                response = await doInsertBatch(startIndex);
                return response;
            }

        } else {
            //console.log("doInsertBatch: write with startIndex and endIndex");
            const data = await write(startIndex, endIndex);
            var retryCount = 1;

            while(data['UnprocessedItems'] && data['UnprocessedItems']['snhu-it634-2'] && data['UnprocessedItems']['snhu-it634-2'].length > 0 && retryCount < 5) {
                console.log('UnprocessedItems Retry', retryCount)

                for(var i = 0; i < data['UnprocessedItems']['snhu-it634-2'].length; i++) {
                    console.log("retry", JSON.stringify(data['UnprocessedItems']['snhu-it634-2'][i]));
                }

                data = await write(startIndex);
                retryCount = retryCount + 1;
            }

            console.log("doInsertBatch: write completed: " + startIndex, data);

            //Increment our startIndex
            startIndex = startIndex + insertBatchSize;

            // Are we done?             
            if (startIndex >= allParams.length) {
                const message = "doInsertBatch: STOPPED! startIndex=" + startIndex + " dataLength=" + allParams.length + " recordsWritten=" + recordsInsertedCount;
                console.log(message);
                response = {
                    statusCode: 200,
                    body: JSON.stringify(message)
                };
                return response;

            } else {
                //recursively call this method
                response = await doInsertBatch(startIndex);
                return response;
            }

        }

    } catch (err) {
        console.log("Catch Error", err);
        response = {
            statusCode: 200,
            body: JSON.stringify(err)
        };
        return response;
    }

}

/***********************************************
 */
async function write(start, end = null) {
    //console.log("write called start=" + start + " end=" + end);
    var params = {};

    if (start >= allParams.length) {
        console.log("stopped write, start is past its length");
        return new Promise.reject('stopped write, start is past its length');

    } else if (!end) {

        params = {
            RequestItems: {
                "snhu-it634-2": allParams.slice(start)
            }
        }

    } else {

        params = {
            RequestItems: {
                "snhu-it634-2": allParams.slice(start, end)
            }
        }

    }

    //console.log("Params", JSON.stringify(params));
    //console.log(JSON.stringify(params));
    recordsInsertedCount = recordsInsertedCount + params.RequestItems['snhu-it634-2'].length;
    return ddb.batchWriteItem(params).promise();
}

/***********************************************
 */
async function doScan() {

    const params = {
        "TableName": "snhu-it634-2",
        "Limit": scanMaxRecords,
        "AttributesToGet": ["pk", "sk"]
    };

    const ret = await ddb.scan(params).promise();
    return ret;
}


/***********************************************
 */
async function doDelete(delItems) {

    if (!delItems || !delItems.length) {
        return null;
    }

    // const params = {
    //     "TableName": "snhu-it634-2",
    //     "Key": delItem
    // };

    var params = {
        RequestItems: {
            "snhu-it634-2": delItems
        }
    }

    //console.log(JSON.stringify(params));
    recordsDeletedCount = recordsDeletedCount + params.RequestItems['snhu-it634-2'].length;

    const ret = await ddb.batchWriteItem(params).promise();
    return ret;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}