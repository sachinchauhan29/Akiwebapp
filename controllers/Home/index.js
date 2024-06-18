const axios = require('axios');
const { urls } = require('../../api');

const {
    BANNER_URL,
    GET_CART_URL,
} = urls;

const fetchApiData = async (url, postData, headers) => {
    try {
        console.log(`Fetching data from ${url} with postData:`, postData);
        const response = await axios.post(url, postData, { headers });
        return response.data.result || [];
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error.message);
        console.error(`Error response data: ${error.response?.data}`);
        return [];
    }
};

const fetchCartCount = async (cart_count, headers) => {
    try {
        console.log(`Fetching cart count with data:`, cart_count);
        const response = await axios.post(GET_CART_URL, cart_count, { headers });
        const carts = response.data.result || [];
        return carts.product_details ? carts.product_details.length : 0;
    } catch (error) {
        console.error("Error fetching cart count:", error.message);
        console.error(`Error response data: ${error.response?.data}`);
        return 0;
    }
};

const HomePage = async (req, res) => {
    try {
        const userData = req.session.userData;
        const accessToken = req.session.accessToken;

        if (!userData) {
            console.log("User data not found in session. Redirecting to /page.");
            return res.redirect('/page');
        }

        if (!accessToken) {
            console.log("Access token not found in session. Redirecting to /page.");
            return res.redirect('/page');
        }

        console.log("User data found in session:", userData);

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            ...req.headers,
        };

        const fetchBanner = async (postData) => await fetchApiData(BANNER_URL, postData, headers);

        const CartCount = await fetchCartCount(
            {
                login_id: userData.login_id,
                customer_id: userData.id,
                channel_id: userData.channel_id
            },
            headers
        );

        const bannerUrl = await fetchBanner({ login_id: userData.login_id, banner_type: "HOME" });

        res.render('index', {
            userData,
            banner: bannerUrl || null,
            CartCount,
        });
    } catch (error) {
        console.error("Internal server error:", error.message);
        console.error(error.stack);
        res.status(500).send("Internal server error");
    }
};

module.exports = {
    HomePage
};
