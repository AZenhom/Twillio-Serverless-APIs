exports.handler = async function (context, event, callback) {
    // Credentials in .env
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    // Request parameters
    const roomSid = event.room_sid

    // Getting Recording
    let recordings = [];
    let success = true
    try {
        recordings = await client.video.v1.recordings.list({ groupingSid: [roomSid], limit: 20 });
    } catch { success = false }

    // Returning the recordings
    const response = new Twilio.Response();
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };
    response.setHeaders(headers);
    response.setBody({
        data: recordings,
        success: success,
    });
    return callback(null, response);
};