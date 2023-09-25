exports.handler = async function (context, event, callback) {
    // Credentials in .env
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    // Request parameters
    const roomName = event.room_name

    // Creating the Room
    let room = null;
    let success = true;
    try {
        room = await client.video.v1.rooms.create({
            uniqueName: roomName,
            recordParticipantsOnConnect: true,
            type: 'group-small',
            maxParticipantDuration: 3600,
            unusedRoomTimeout: 15
        });
    } catch { success = false }

    // Returning the created Composition
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