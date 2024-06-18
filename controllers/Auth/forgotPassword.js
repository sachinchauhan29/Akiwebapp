const axios = require('axios');
// Import the urls object from the urls.js file
const { urls } = require('../../api');

// Destructure the required URLs from the urls object
const { FORGOT_PASSWORD_URL, UPDATE_FORGOT_PASSWORD_URL, get_security_question_URL } = urls;

const forgot = async (req, res) => {
    try {
        // Retrieve user data from the session
        const userData = req.session.userData;
        // Render the 'forgot' view with the user data and flash messages
        res.render('Login/forgot', {
            userData: userData,
            errorMessages: req.flash('error'),
            successMessages: req.flash('success')
        });
    } catch (error) {
        // Log any errors that occur
        console.error(error);
        // Handle the error appropriately
        res.status(500).send('Internal Server Error');
    }
}

const forgot_password = async (req, res) => {
    try {
        // Retrieve the login_id from the request body
        const { login_id } = req.body;

        // Construct the forgot object
        const forgot = {
            login_id: login_id
        };

        // Make a POST request to the FORGOT_PASSWORD_URL endpoint
        const forgotResponse = await axios.post(FORGOT_PASSWORD_URL, forgot, { headers: req.headers });

        // Extract the result from the response data
        const forgotResult = forgotResponse.data; // Assuming the result is stored in the 'data' property of the response


        if (forgotResult.status === true) {
            req.session.userData_forget = {
                otp: forgotResult.otp,
                token: forgotResult.token
            };
            req.session.accessToken = forgotResult.token;
            req.session.login_id = login_id;


            // Set success flash message
            req.flash('success', 'OTP sent successfully');
            res.redirect('/otp');
        } else {
            // Set error flash message
            req.flash('error', 'Invalid login credentials');
            res.redirect('/forgot');
        }
    } catch (error) {
        // Handle network errors and other errors
        console.error(error);
        req.flash('error', 'An error occurred. Please try again later.');
        res.redirect('/forgot');
    }
}



const otp = async (req, res) => {
    try {
        const userData = req.session.userData;
        const security_question = await axios.get(get_security_question_URL);
        const get_security_question = security_question.data.result
        res.render('Login/otp', {
            userData: userData,
            security_question: get_security_question,
            messages: req.flash('error'),
            successMessages: req.flash('success')
        });

    } catch (error) {
        //(error.message);
    }
}

const UPDATE_FORGOT_PASSWORD = async (req, res) => {
    try {
        const OTP_DATA = req.session.userData_forget;
        const login_id = req.session.login_id;

        // Destructure request body
        const { password, Confirmpassword, security_question, security_question_answer } = req.body;

        // Check if password matches confirm password
        if (password !== Confirmpassword) {
            req.flash('error', 'Confirm Password does not match');
            return res.status(400).redirect('/otp');
        }

        // Extract OTP digits from the request body
        const otpDigits = [
            req.body.otp1.trim(),
            req.body.otp2.trim(),
            req.body.otp3.trim(),
            req.body.otp4.trim()
        ];

        // Concatenate OTP digits into a single string
        const otp = otpDigits.join('');

        // Check if entered OTP matches stored OTP
        if (OTP_DATA.otp === otp) {
            const forgot = {
                login_id: login_id,
                otp: '1234',
                password: password,
                security_question_id: security_question,
                security_question_answer: security_question_answer
            };

            try {
                // Include token in the URL
                const UPDATE_FORGOT_PASSWORD_URL_WITH_TOKEN = `${UPDATE_FORGOT_PASSWORD_URL}?token=${OTP_DATA.token}`;

                // Attempt to update the password
                const forgotResponse = await axios.post(UPDATE_FORGOT_PASSWORD_URL_WITH_TOKEN, forgot);

                // Check if the update was successful
                if (forgotResponse) {
                    req.flash('success', 'Password updated successfully');
                    return res.redirect('/otp');
                } else {
                    // Handle unsuccessful password update
                    req.flash('error', forgotResponse.data.message || 'Failed to update password');
                    return res.redirect('/otp');
                }
            } catch (error) {
                // Handle axios errors
                console.error("Forgot password update error:", error);
                req.flash('error', 'Failed to update password');
                return res.redirect('/otp');
            }
        } else {
            // If OTP does not match, handle it accordingly
            req.flash('error', 'Invalid OTP');
            return res.redirect('/otp');
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error("Internal server error:", error);
        req.flash('error', 'Internal Server Error');
        return res.redirect('/otp');
    }
};










module.exports = {

    forgot,
    forgot_password,
    otp,
    UPDATE_FORGOT_PASSWORD


}