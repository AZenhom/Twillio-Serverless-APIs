exports.handler = async function (context, event, callback) {
    // Credentials in .env
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    // Request parameters
    const name = event.name

    // Getting ....
    let greetingText = "Hello Wrold";
    let success = true
    try {
        greetingText = await (greetingText + ", " + name);
    } catch { success = false }

    // Returning the .....
    const response = new Twilio.Response();
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };
    response.setHeaders(headers);
    response.setBody({
        greetingText: greetingText,
        success: success,
    });
    return callback(null, response);
};