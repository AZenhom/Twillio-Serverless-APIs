exports.handler = function (context, event, callback) {
  // Credentials in .env
  const twilioAccountSid = context.ACCOUNT_SID;
  const twilioApiKey = context.API_KEY;
  const twilioApiSecret = context.API_SECRET;
  const identity = event.identity;

  // Getting ATokens
  const AccessToken = Twilio.jwt.AccessToken;
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity: identity }
  );

  // Addding video Grant to AT
  const VideoGrant = AccessToken.VideoGrant;
  const videoGrant = new VideoGrant();
  token.addGrant(videoGrant);

  const JwtToken = token.toJwt()
  const success = JwtToken !== null && JwtToken !== ''

  // Returning the token
  const response = new Twilio.Response();
  const headers = {
    "Access-Control-Allow-Origin": "*", // change this to your client-side URL
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  response.setHeaders(headers);
  response.setBody({
    data: {
      accessToken: JwtToken,
      identity: identity
    },
    success: success
  });
  return callback(null, response);
};
