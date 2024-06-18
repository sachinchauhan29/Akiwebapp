const axios = require('axios');
const uaParser = require('ua-parser-js');
const fs = require('fs');



// Import the urls object from the urls.js file
const { urls } = require('../../api');

// Destructure the required URLs from the urls object
const { LOGIN_URL,
    PROFILE_URL,

    get_security_question_URL,
    get_channels_URL,
    REGISTER_URL,
    app_content_URL
} = urls;

function parseUserAgent(userAgent) {
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    // Check if user-agent string contains 'Chrome'
    if (userAgent.includes('Chrome')) {
        browserName = 'Chrome';
        const match = userAgent.match(/Chrome\/(\S+)/);
        if (match) {
            browserVersion = match[1];
        }
    }
    // Add conditions to check for other browsers if needed

    return { name: browserName, version: browserVersion };
}

// Function to parse user-agent string and extract device name
function parseDeviceName(userAgent) {
    if (userAgent.includes('iPhone')) {
        return 'iPhone';
    } else if (userAgent.includes('iPad')) {
        return 'iPad';
    } else if (userAgent.includes('Android')) {
        if (userAgent.includes('Mobile')) {
            return 'Android Phone';
        } else {
            return 'Android Tablet';
        }
    } else if (userAgent.includes('Windows Phone')) {
        return 'Windows Phone';
    } else if (userAgent.includes('Macintosh')) {
        return 'Macintosh';
    } else if (userAgent.includes('Windows')) {
        return 'Windows PC';
    } else if (userAgent.includes('Linux')) {
        return 'Linux PC';
    } else {
        return 'Unknown';
    }
}



const sign_up_save = async (req, res) => {
    const jsonData = req.body;

    const userAgent = req.headers['user-agent'];
    const browserInfo = parseUserAgent(userAgent);
    const browserName = browserInfo.name;
    const browserVersion = browserInfo.version;
    const deviceName = parseDeviceName(userAgent);

    try {


        let data = new FormData();
        data.append('email', 'testweb1@crazibrainsolutions.com');
        data.append('outlet_name', 'testing');
        data.append('lat', '77.45452');
        data.append('longi', '77.4565');
        data.append('outlet_address', 'this is a testing address');
        data.append('landmark', 'testing landmark');
        data.append('area', 'testing random ');
        data.append('region', 'testing region');
        data.append('country', 'India');
        data.append('pin_code', '20301');
        data.append('retailer_type', 'Modern Trade');
        data.append('trn_number', '123456700');
        data.append('outlet_landline_no', '455555');
        data.append('outlet_mobile_no', '8877314520');
        data.append('outlet_manager_no', '9999999994');
        data.append('manager_whatsapp_no', '9999999994');
        data.append('manager_name', 'testing manager name');
        data.append('trade_license_no', '85265745461');
        data.append('vat_certificate_no', '5555155');
        data.append('passport_no', 'HTFYHGH5666');
        data.append('os_type', 'Android');
        data.append('os_version', '13.0.1');
        data.append('device_name', 'Mi');
        data.append('password', '123456ytte');
        data.append('trade_license', data.trade_license);
        data.append('vat_certificate', data.trade_license);
        data.append('passport', data.trade_license);
        data.append('retailer_type_id', '1');
        data.append('security_question_id', '1');
        data.append('security_question_answer', 'test');


        const response = await axios.post('http://3.29.220.19:4100/v1/auth/register', data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the Content-Type header to multipart/form-data
            },
        });


        res.status(200).send({ message: 'Registration successful', data: response.data });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving request'); // Send error response
    }
};







const Profile = async (req, res) => {

    const userData = req.session.userData;


    try {

        // Create the user profile data to send in the request
        const userProfileData = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Make the request to the profile endpoint
        const response = await axios.post(PROFILE_URL, userProfileData, { headers: req.headers });


        // Render the profile page with the profile data
        res.render('User/profile', { Profile: response.data, userData: userData });

        // Set up the headers with the access token

    } catch (error) {
        // Handle error
        console.error('Error fetching profile:', error);
        res.redirect('/page');
    }
};




const login_page = async (req, res) => {

    try {

        const userData = req.session.userData;
        const app_content = await axios.get(app_content_URL);
        const webData = app_content.data.result



        // Render the 'forgot' view with the user data
        res.render('Login/login', { userData: userData, app_content: webData, messages: req.flash('error') });

    } catch (error) {

        //(error.message);

    }




}

const page = (req, res, next) => {
    try {
        const userData = req.session.userData;
        res.render('page', { userData: userData });
    } catch (error) {
        //(error);
        next(error);  // Pass the error to the next middleware
    }
}






const sign = async (req, res) => {
    const userData = req.session.userData;

    try {
        const REGISTER_URL_ = REGISTER_URL

        //(REGISTER_URL_);
        const security_question = await axios.get(get_security_question_URL);
        const get_security_question = security_question.data.result
        const get_channels = await axios.get(get_channels_URL);
        const get_channels_data = get_channels.data.result

        const app_content = await axios.get(app_content_URL);
        const webData = app_content.data.result

        // Render the 'forgot' view with the user data
        res.render('sign-up/sign-up', { userData: userData, security_question: get_security_question, get_channels_data: get_channels_data, app_content: webData, REGISTER_URL_: REGISTER_URL_ });

    } catch (error) {

        //(error);

    }


}








const login = async (req, res, next) => {
    try {
        const payload = {
            login_id: req.body.login_id,
            password: req.body.password,
        };
        const response = await axios.post(LOGIN_URL, payload);

        // Store user data in the session
        req.session.userData = response.data;
        req.session.accessToken = response.data.access.token;

        // Redirect to the home page after successful login
        res.redirect('/');
    } catch (error) {
        console.error('Error fetching API:', error);

        // Set flash message for error
        req.flash('error', 'Invalid login credentials');

        // Redirect back to login page with flash message
        res.redirect('/login');
    }
}



module.exports = login;





module.exports = {
    login,
    login_page,

    Profile,
    page,

    sign,

    sign_up_save

}