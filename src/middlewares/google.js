const {google} = require("googleapis");
const googleAuth = require("google-auto-auth");
const User = require("../models/user.js");
const Profile = require("../models/profile");
const Settings = require("../models/settings");
const logger = require("../middlewares/logger");
let googleConfig, defaultScope;
/**
 *
 */
exports.startUp = () => {
    if (process.env.DEVELOP === "false") {
        googleConfig = {
            clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
            redirect: process.env.GOOGLE_REDIRECT_URL // this must match your google api settings
        };
    } else if (process.env.DEVELOP === "true" && process.env.DEVELOP_WITH_GOOGLE === "true"||process.env.DOCKER_COMPOSITE==="true") {
        googleConfig = {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirect: process.env.GOOGLE_REDIRECT_URL_DEVELOP
        };
    }

    defaultScope = [
        "https://www.googleapis.com/auth/plus.me",
        "https://www.googleapis.com/auth/userinfo.email",
    ];
};

/**
 *
 * @returns {OAuth2Client}
 */
exports.createConnection = () => {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
};
/**
 *
 * @param auth
 * @returns {string}
 */
exports.getConnectionUrl = (auth) => {
    return auth.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: defaultScope
    });
};
/**
 *
 * @param auth
 * @returns {*}
 */
exports.getGooglePlusApi = (auth) => {
    return google.plus({version: "v2", auth});
};

/**
 * Creates a Google URL and send to the client to log in the user.
 */
exports.urlGoogle = () => {
    const auth = this.createConnection();
    const url = this.getConnectionUrl(auth);
    return url;
};

/**
 * Take the "code" parameter which Google gives us once when the user logs in, then get the user"s email and id.
 * @param {String} code - query string after succesfully logging in with Google
 */
exports.getGoogleAccountFromCode = async (code) => {
    const oAuth2Client = await this.createConnection();
    const {tokens} = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2("v2");
    const {
        data: {email, id: google_id}
    } = await oauth2.userinfo.v2.me.get({
        auth: oAuth2Client
    });
    return {
        googleId: google_id,
        email: email,
        tokens: tokens
    };
};
/**
 * Checks if the user that logged in is new or old.
 * If it"s a new user it creates a default empty User, Settings and profile model.
 * If it"s an old user it set the session parameters correct
 * @param req
 * @param googleId
 * @param email
 * @param tokens
 * @returns {Promise<*>}
 */
exports.checkSignIn = async function checkSignIn(req, {googleId, email, tokens}) {
    const currentUser = await User.findOne({googleId: googleId}, function (err, User) {
        if(err) {
            logger.error.log("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method User.findOne trace: "+err.message);
            throw new Error(err);
        }
        return User;
    });
    if (!currentUser) {//new user, add user to database
        logger.info("[INFO]: New User found, welcome "+req.session.email+"!");
        //create user
        const newUser = new User({
            googleId: googleId,
            email: email,
            tokens: tokens
        });
        await newUser.save((err)=>{
            if(err) logger.error.log("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method newUser.save trace: "+err.message);});
        //find new user.__id, add ID to database
        const currentUser = await User.findOne({googleId: googleId}, function (err, User) {
            if(err){
                logger.error.log("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method User.findOne trace: "+err.message);
                throw new Error(err);
            }
            return User._id;
        });
        const newSettings = new Settings({
            fromUser: currentUser._id
        });
        await newSettings.save((err)=>{
            if(err) logger.error.log("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method newSettings.save trace: "+err.message);});
        const newProfile = new Profile({
            fromUser: currentUser._id
        });
        await newProfile.save((err)=>{
            if(err) logger.error.log("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method newProfile.save trace: "+err.message);});
        const settings = await Settings.findOne({fromUser: currentUser._id},(err)=>{
            if(err) logger.error.log("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method Settings.findOne trace: "+err.message);});
        const profile = await Profile.findOne({fromUser: currentUser._id},(err)=>{
            if(err) logger.error.log("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method Profile.findOne trace: "+err.message);});
        await User.updateOne({_id: currentUser._id}, {settings: settings._id, profile: profile._id},(err)=>{
            if(err) logger.error.log("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method User.updateOne trace: "+err.message);});
        req.session.email = email;
        logger.info.log("[INFO]: Succesfully created settings, profile and user for new user "+req.session.email);
        return currentUser;
    } else {//user already added
        logger.info.log("[INFO]: User logged in, welcome back "+req.session.email);
        req.session.email = email;
        return currentUser._id;
    }
};