exports.handler = async function (context, event, callback) {
    // Credentials in .env
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    // Request parameters
    const roomSid = event.room_sid

    // Updating room status
    let room = null;
    let success = true;
    try {
        room = await client.video.v1.rooms(roomSid).update({status: 'completed'});
    } catch { success = false }

    // Returning the created room
    const response = new Twilio.Response();
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };
    response.setHeaders(headers);
    response.setBody({
        data: room,
        success: success,
    });
    return callback(null, response);
};