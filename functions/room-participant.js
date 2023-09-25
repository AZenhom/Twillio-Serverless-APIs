exports.handler = async function (context, event, callback) {
    // Credentials in .env
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    // Request parameters
    const roomSid = event.room_sid;
    const pIdentity = event.participant_identity;

    // Getting Room Participant
    let participant = null;
    let success = true;
    try {
        const disconectedPs = await client.video.v1.rooms(roomSid).participants.list({ limit: 20 });
        disconectedPs.forEach(p => { if (p.identity == pIdentity) { participant = p } })
    } catch { success = false; }


    // Returning the Participant
    const response = new Twilio.Response();
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };
    response.setHeaders(headers);
    response.setBody({
        data: participant,
        success: success,
    });
    return callback(null, response);
};