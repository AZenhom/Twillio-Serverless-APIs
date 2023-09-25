exports.handler = async function (context, event, callback) {
    // Credentials in .env
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    // Request parameters
    const roomSid = event.room_sid
    const participantSid = event.participant_sid

    // Creating the Composition
    let composition = null;
    let success = true;
    try {
        composition = await client.video.v1.compositions.create({
            audioSources: ['*'],
            videoLayout: { single: { video_sources: [participantSid] } },
            format: 'mp4',
            roomSid: roomSid
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
        data: composition,
        success: success,
    });
    return callback(null, response);
};