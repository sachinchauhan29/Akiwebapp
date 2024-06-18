const axios = require('axios');

const { urls } = require('../../api');
const { CATALOGUE_URL, CATEGORY_PARENT_URL
} = urls;


const catalogue = async (req, res) => {

    const categoriesOneValue = req.query.Categories_one;
    const Categories_Two = req.query.Categories_Two;
    const Categories_Three = req.query.Categories_Three;

    const brand_id = req.query.brand_id;
    const sub_brand_id = req.query.sub_brand_id;
    const ALL = req.query.ALL;

    try {

        const userData = req.session.userData;
        // Calculate pagination values
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 15; // Number of products per page
        const skip = (page - 1) * limit;

        // Construct the request data for product listing
        const catalogue_data = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            skip: skip,
            limit: limit,
            customer_mapping_status: userData.customer_mapping_status,
            filter: {
                category_1: categoriesOneValue || "0",
                category_2: Categories_Two || "",
                category_3: Categories_Three || "",
                brand_id: brand_id || "",
                sub_brand_id: sub_brand_id || "",
                product_type: ALL || "ALL",
            }
        };

        ////(catalogue_data);


        const response = await axios.post(CATALOGUE_URL, catalogue_data, { headers: req.headers });
        const catalogue = response.data;


        // Get total count of products
        const totalCount = catalogue.totalCount;

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);


        const Categories_one = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            parent_id: "0",
            customer_mapping_status: userData.customer_mapping_status,
        };
        const Categories_one_ = await axios.post(CATEGORY_PARENT_URL, Categories_one, { headers: req.headers });
        const CATEGORY_1_result = Categories_one_.data.result;

        res.render('catalogue/catalogue', {
            catalogue: catalogue,
            userData: userData,
            CATEGORY_PARENT: CATEGORY_1_result,

        });

    } catch (error) {

        //(error.message);

    }



}


const catalogue_Details = async (req, res) => {
    const userData = req.session.userData;
    try {
        // Extract the product_id from the request parameters
        const productId = req.params.product_id;

        // Extract necessary data from session
        // Make the request to fetch the products
        const catalogue_Details = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status,
            skip: 0,
            limit: 10


        };

        // Make the request to get cart count
        const catalogue_Details_data = await axios.post(CATALOGUE_URL, catalogue_Details, { headers: req.headers });
        const catalogue_Result = catalogue_Details_data.data.result;



        let foundProduct = null;

        catalogue_Result.forEach(product => {
            if (String(product.product_id) === productId) { // Convert product_id to string before comparison
                foundProduct = product;
            }
        });


        if (foundProduct) {
            // Render the product details in the 'product/TopBrands' template
            res.render('catalogue/catalogue-Details', { userData: userData, foundProduct: foundProduct });
        } else {
            // If the product with the specified productId is not found, return a 404 error
            res.status(404).send('Product not found');
        }
    } catch (error) {
        // Log any errors that occur during the process
        console.error("Error fetching product details:", error.message);
        // Send an error response back to the client
        res.status(500).json({ success: false, message: "Failed to fetch product details" });
    }

}


module.exports = {
    catalogue,
    catalogue_Details
}

