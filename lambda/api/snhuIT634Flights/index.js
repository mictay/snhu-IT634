var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'})
var ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const COST_PER_MILE_ADULT = .25;
const COST_PER_MILE_CHILD = .15;
const JET_SPEED = 570; //miles per hour
const ONE_HOUR = 3600000;
const FLIGHTS_EVERY_HOURS = 2;

/***********************************************
 * 
 */
exports.handler = async (event) => {
    console.log('Flights GET called');
    let q = event['queryStringParameters'];
    console.log("q", q);

    var response;
    var ret = {};

    try {

        //validate will throw an error is anything is wrong
        validateAllInboundParams(q);

        //Move params to variables
        const fromAirport = await getAirport(q['fr']);

        //Move params to variables
        const toAirport = await getAirport(q['to']);

        //Make sure we have airports, throws if invalid
        validateAirport(fromAirport, toAirport)

        // Move the querystring to variables
        const isRoundTrip = q['rt'];
        const adults = parseInt(q['ad'], 10);
        const children = parseInt(q['ch'], 10);
        const departureDate = Date.parse(q['de']).to;
        const returnDate = Date.parse(q['re']);

        ret.adults = adults;
        ret.children = children;
        ret.isRoundTrip = q['rt'] === 'true';
        ret.departureDate = departureDate;
        ret.returnDate = returnDate;
        ret.adultRatePerMile = COST_PER_MILE_ADULT;
        ret.childRatePerMile = COST_PER_MILE_CHILD;
        ret.today = (new Date()).toISOString();
        ret.flightDeparture = createFlights(fromAirport, toAirport, adults, children);;

        if (ret.isRoundTrip) {
            ret.flightReturn = createFlights(toAirport, fromAirport, adults, children);;
        }

        // TODO implement
        response = makeResponse(200, {"data": ret});

    } catch (err) {
        response = makeResponse(200, {"error": err});
    }

    return response;
};

/******************************************************
 */
function makeResponse(status, body) {
    return {
            statusCode: status,
            headers: {
                "Access-Control-Allow-Headers" : "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(body),
    }
}

/***********************************************
 * AIRPORT CODE
 * pk & sk
 */
async function getAirport(airportCode) {

    const params = {
        "TableName": "snhu-it634-2",
        "ScanIndexForward": true,
        "KeyConditionExpression": "pk = :PK AND sk = :SK",
        "Limit": "1",
        "ExpressionAttributeValues": {
          ":PK": "airports",
          ":SK": airportCode
        }
    };

    const queryOutput = await ddb.query(params).promise();
    
    if(queryOutput && queryOutput['Items'] && queryOutput['Items'][0])
        return queryOutput['Items'][0];
    else
        return null;
}

/******************************************************
 * fr=From Airport Code
 * to=To Airport Code
 * ad=Adults
 * ch=Children
 * rt=is round-trip
 * de=departure date
 * re=return date
 */
function validateAllInboundParams(q) {

    const requiredParams = ['fr', 'to', 'ad', 'ch', 'rt', 'de', 're'];

    if(!q)
        throw 'Missing Parameters';

    // All params are required
    for(let value of requiredParams) {
        if (!q[value])
            throw 'Missing Parameters: ' + value;
    }

    // Airport Codes are always length 4
    if(q['fr'].length != 4 || q['to'].length != 4) {
        throw 'Missing Parameters';
    }

    // RoundTrip indicator
    if( !(q['rt'] === 'true' || q['rt'] === 'false') )
        throw 'Invalid value for rt';

    // Airport Codes are always length 4
    if(q['fr'].length != 4 || q['to'].length != 4) {
        throw 'Invalid Airport Code Lengths';
    }

    // Adults and Children must be parseable numbers
    if(isNaN(parseInt(q['ad'], 10)) || isNaN(parseInt(q['ch'], 10))){
        throw 'Adults and Children must be Numbers';
    }

    // Adults + children must be greater than zero
    if((parseInt(q['ad']) + parseInt(q['ch'])) < 1 || (parseInt(q['ad']) + parseInt(q['ch'])) > 100){
        throw 'Party size must be minumum 1 and maximum 100';
    }

    if(isNaN(Date.parse(q['de'])) || isNaN(Date.parse(q['re']))) {
        throw 'Invalid Dates';
    }

    if( Date.parse(q['de']) > Date.parse(q['re'])   ) {
        throw 'Return Date must be after Departure Date';
    }

    if( Date.parse(q['re']) - Date.parse(q['de']) > 31536000000  ) {
        throw 'Return Date must within 1 year of Departure Date';
    }

    if( Date.parse(q['re']) - Date.parse(q['de']) < 86400000  ) {
        throw 'Return Date must at least 1 day of Departure Date';
    }

}

/******************************************************
 */
function validateAirport(fromAirport, toAirport) {
    
    if(!fromAirport)
        throw "Invalid departure airport";

    if(!toAirport)
        throw "Invalid destination airport";

    console.log('fromAirport', fromAirport);
    console.log('toAirport', toAirport);
    
    if(fromAirport['sk'] === toAirport['sk'])
        throw "From and To Airports can not be the same";
    
}

/******************************************************
 */
function getDistanceFromLatLonInMiles(fromAirport, toAirport) {

  const lat1 = fromAirport.lat;
  const lon1 = fromAirport.lon;
  const lat2 = toAirport.lat;
  const lon2 = toAirport.lon;
    
  //var R = 6371; // Radius of the earth in km
  const R = 3958.8; // Radius of the earth in miles

  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in miles

  console.log("getDistanceFromLatLonInMiles", d);
  
  return d;
}

/******************************************************
 */
function deg2rad(deg) {
  return deg * (Math.PI/180)
}

/******************************************************
 */
function createFlights(fromAirport, toAirport, adults, children) {
    var ret = [];

    const distance = parseFloat(getDistanceFromLatLonInMiles(fromAirport, toAirport).toFixed(2));
    const duration = parseFloat( (distance / JET_SPEED).toFixed(2));

    //Force departers on the hour.
    var now = Date.now();
    var nextDeparts = new Date(now);
    nextDeparts.setMinutes(0);
    nextDeparts.setSeconds(0);
    nextDeparts.setMilliseconds(0);
    nextDeparts = nextDeparts.getTime();

    for(var i = 0; i < 12; i++) {

        var departs = nextDeparts + (ONE_HOUR * FLIGHTS_EVERY_HOURS);

        //Force Flight Departs on Even Hours
        if (new Date(departs).getHours() % 2 > 0)
            departs = departs + ONE_HOUR;

        const arrives = departs + ((distance / JET_SPEED) * ONE_HOUR);
        
        const flight = "FLT-" + fromAirport['sk'] + "-" + toAirport['sk'] + "-" + (new Date(departs)).getHours();
        var cost = ((adults * COST_PER_MILE_ADULT) * distance) + ((children * COST_PER_MILE_CHILD) * distance);

        var premiumDiscountCost = 0;
        var premiumDiscountReason = "";

        //PREMIUM every hour between 8am to 8pm, it increments a premium rate
        if((new Date(departs)).getHours() >= 8 && (new Date(departs)).getHours() <= 16){
            premiumDiscountCost = parseFloat((  (((new Date(departs)).getHours() + 1) * .01)  * distance * (adults + children) ).toFixed(2));
            premiumDiscountReason = "Popular Flight Premium"
        }

        //DISCOUNTS every hour between 8am to 8pm, it increments a premium rate
        if(
            ((new Date(departs)).getHours() >= 22 && (new Date(departs)).getHours() <= 24) || 
            ((new Date(departs)).getHours() >= 0 && (new Date(departs)).getHours() <= 4)
          ) {
            premiumDiscountCost = -1 * parseFloat(( (((new Date(departs)).getHours() + 1) * .02)  * distance * (adults + children)).toFixed(2));
            premiumDiscountReason = "Economy Discount"
          }

        ret.push(
            {
                "flight": flight,
                "distance": distance,
                "duration": duration,
                "departs": new Date(departs).toISOString(),
                "arrives": new Date(arrives).toISOString(),
                "cost": cost,
                "premiumDiscountCost": premiumDiscountCost,
                "premiumDiscountReason": premiumDiscountReason,
                "total": parseFloat( (cost + premiumDiscountCost).toFixed(2) ),
                "distance": parseFloat(getDistanceFromLatLonInMiles(fromAirport, toAirport).toFixed(2)),
                "flightDuration": duration,
                "fromDisplayName": fromAirport.displayName,
                "toDisplayName:": toAirport.displayName
            }
        );

        nextDeparts = departs;
    }
    
    return ret;
}