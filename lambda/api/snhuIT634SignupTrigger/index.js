var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'})
var ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event) => {
    console.log('called:', event);

    try {
        // Set the user pool autoConfirmUser flag after validating the email domain
        event.response.autoConfirmUser = false;
    
        // This example uses a custom attribute "custom:domain"
        event.response.autoConfirmUser = true;
        
        var params = {
          TableName : 'snhu-it634-2',
          Item: {
             pk: 'users',
             sk: event.userName,
             name: event.request.userAttributes.name
          }
        };
    
        var documentClient = new AWS.DynamoDB.DocumentClient();
        var putResponse = await documentClient.put(params).promise();
        console.log('putResponse', putResponse);
        
        return event;

    } catch (err) {
        return err;
    }    

};


// {
//   version: '1',
//   region: 'us-east-1',
//   userPoolId: 'us-east-1_0s1pggUB0',
//   userName: 'mictay7',
//   callerContext: {
//     awsSdkVersion: 'aws-sdk-unknown-unknown',
//     clientId: '5qnp0rquuvkj81eqsv1qa1si1k'
//   },
//   triggerSource: 'PreSignUp_SignUp',
//   request: { userAttributes: { name: 'mike' }, validationData: null },
//   response: {
//     autoConfirmUser: false,
//     autoVerifyEmail: false,
//     autoVerifyPhone: false
//   }
// }