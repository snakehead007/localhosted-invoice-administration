const  {google}= require('googleapis');

/*******************/
/** CONFIGURATION **/
/*******************/
let googleConfig,defaultScope;
exports.startUp = () =>{
    googleConfig= {
        clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
        redirect: process.env.GOOGLE_REDIRECT_URL, // this must match your google api settings
    };

    defaultScope = [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
    ];
};

/*************/
/** HELPERS **/
/*************/

exports.createConnection  = () =>{
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
};

exports.getConnectionUrl = (auth) => {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
};

exports.getGooglePlusApi = (auth)=> {
    return google.plus({ version: 'v1', auth });
};

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
exports.urlGoogle = () => {
    const auth = this.createConnection();
    const url = this.getConnectionUrl(auth);
    return url;
};

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */


exports.getGoogleAccountFromCode = async (code) =>{
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    const auth = this.createConnection();
    auth.setCredentials(tokens);
    const plus = this.getGooglePlusApi(auth);
    const me = await plus.people.get({ userId: 'me' });
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    return {
        googleId: userGoogleId,
        email: userGoogleEmail,
        tokens: tokens,
    };
};