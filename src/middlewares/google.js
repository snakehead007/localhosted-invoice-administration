const  {google}= require('googleapis');
const googleAuth = require('google-auto-auth');
const User = require('../models/user.js');
const Profile = require('../models/profile');
const Settings = require('../models/settings');
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
    console.log("[Info]: Google config set up");
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
    return google.plus({ version: 'v2', auth });
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
    const oAuth2Client = this.createConnection();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2("v2");
    const {
        data: { email, id: google_id }
    } = await oauth2.userinfo.v2.me.get({
        auth: oAuth2Client
    });
    console.log("[info]: new login with email: "+email);
    return {
        googleId: google_id,
        email: email,
        tokens:tokens
    };
};

exports.checkSignIn = async function checkSignIn(req,{googleId,email,tokens}){
    const currentUser = await User.findOne({googleId:googleId},function(err,User){
        if(err) throw new Error(err);
        return User;
    });
    if(!currentUser){//new user, add user to database
        //create user
        const newUser = new User({
            googleId: googleId,
            email:email,
            tokens:tokens
        });
        await newUser.save();
        //find new user.__id, add ID to database
        const currentUserId = await User.findOne({googleId:googleId},function(err,User){
            if(err) throw new Error(err);
            return User._id;
        });
        const newSettings = new Settings({
            fromUser:currentUserId
        });
        await newSettings.save();
        const newProfile = new Profile({
            fromUser:currentUserId
        });
        await newProfile.save();
        const settings = await Settings.findOne({fromUser:currentUserId});
        const profile = await Profile.findOne({fromUser:currentUserId});
        await User.updateOne({_id:currentUserId},{settings:settings._id,profile:profile._id});
        req.session.email = email;
        return currentUserId;
    }else{//user already added
        req.session.email = email;
        return currentUser._id;
    }
};