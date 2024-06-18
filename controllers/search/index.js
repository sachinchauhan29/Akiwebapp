
const axios = require('axios');
const uaParser = require('ua-parser-js');


// Import the urls object from the urls.js file
const { urls } = require('../../api');

// Destructure the required URLs from the urls object
const { Search_filter_product_URL,

} = urls;



const search = async (req, res) => {
    const userData = req.session.userData;

    const search_key = req.query.search; // Retrieve search key from query parameters



    try {
        const Search_filter = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            search_key: String(search_key), // Ensure search_key is treated as a string
            customer_mapping_status: userData.customer_mapping_status
        };

        const Search_filter_product = await axios.post(Search_filter_product_URL, Search_filter, { headers: req.headers });
        const Search_product = Search_filter_product.data.result;


        res.render('search/search', { userData: userData, Search_product: Search_product });
    } catch (error) {
        //(error);
    }
};




module.exports = {

    search,


}