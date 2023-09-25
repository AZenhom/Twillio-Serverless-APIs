exports.handler = async function (context, event, callback) {
    // Credentials in .env
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    // Request parameters
    const compositionSid = event.composition_sid

    // Getting Composition
    let composition = null;
    let success = true;
    try {
        composition = await client.video.v1.compositions(compositionSid).fetch();
    } catch { success = false }
    // Getting the media file
    if (composition != null && composition.status == "completed") {
        const uri = "https://video.twilio.com/v1/Compositions/" + compositionSid + "/Media?Ttl=3600";
        try {
            const urlResponse = await client.request({method: "GET", uri: uri});
            composition.mediaUrl = urlResponse.body.redirect_to;
        } catch { success = false }
    }

    // Returning the Composition and the Media File
    const response = new Twilio.Response();
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
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