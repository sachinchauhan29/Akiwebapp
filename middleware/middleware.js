const setHeadersWithAccessToken = (req, res, next) => {
    // Get the access token from the session
    const accessToken = req.session.accessToken;

    // Check if the access token exists
    if (accessToken) {
        // Set up the headers with the access token
        req.headers.Authorization = `Bearer ${accessToken}`;
        next(); // Call the next middleware
    } else {
        // Handle the case where the access token doesn't exist (user is not logged in)
        // For example, you can redirect the user to the login page
        res.redirect('/page'); // Redirect the user
    }
};


const ForgotAccessToken = (req, res, next) => {
    // Get the access token from the session
    const accessToken = req.session.accessToken;

    // Check if the access token exists
    if (accessToken) {
        // Set up the headers with the access token
        req.headers.Authorization = `Bearer ${accessToken}`;
    } else {
        // Handle the case where the access token doesn't exist (user is not logged in)
        // For example, you can redirect the user to the login page
        return res.redirect('/forgot');
    }

    next(); // Call the next middleware
};

module.exports = {
    setHeadersWithAccessToken,
    ForgotAccessToken
};
