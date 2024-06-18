const axios = require('axios');

const { urls } = require('../../api');
const { FREQUENTLY_URL, BANNER_URL, GET_CART_URL, CART_URL
} = urls;


const frequently = async (req, res) => {

    try {

        const userData = req.session.userData;

        const postData = {
            login_id: userData.login_id,
            banner_type: "HOME"
        };


        let bannerUrl; // Define bannerUrl variable outside the if block

        try {
            const response = await axios.post(BANNER_URL, postData, { headers: req.headers });

            if (response.data && response.data.result && response.data.result.length > 0) {
                bannerUrl = response.data.result[0].banner_url; // Assign bannerUrl inside the if block
                ////("Banner URL:", bannerUrl);
            } else {
                console.error("Banner data not available or response structure is unexpected.");
                // Handle this case as per your application's requirements
            }
        } catch (error) {
            console.error("Error occurred while fetching or processing banner data:", error.message);
            // Handle the error gracefully, such as logging or displaying an appropriate message to the user
        }
        ////(categories);


        const frequently_data = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status,
            skip: 0,
            limit: 10


        };

        // Make the request to get cart count
        const frequently = await axios.post(FREQUENTLY_URL, frequently_data, { headers: req.headers });
        const frequently_result = frequently.data;

        ////("frequently_result", frequently_result);


        res.render('frequently/frequently', { frequently_result: frequently_result, bannerUrl: bannerUrl, userData: userData, });

    } catch (error) {

        //(error.message);

    }



}



const frequently_Details = async (req, res) => {
    const userData = req.session.userData;
    try {
        // Extract the product_id from the request parameters
        const productId = req.params.product_id;

        // Extract necessary data from session
        // Make the request to fetch the products
        const frequently_data = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status,
            skip: 0,
            limit: 10


        };

        // Make the request to get cart count
        const frequently = await axios.post(FREQUENTLY_URL, frequently_data, { headers: req.headers });
        const frequently_result = frequently.data.result;



        let foundProduct = null;

        frequently_result.forEach(product => {
            if (String(product.product_id) === productId) { // Convert product_id to string before comparison
                foundProduct = product;
            }
        });

        //(foundProduct);

        if (foundProduct) {
            // Render the product details in the 'product/TopBrands' template
            res.render('frequently/frequently-Details', { userData: userData, foundProduct: foundProduct });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        // Log any errors that occur during the process
        console.error("Error fetching product details:", error.message);
        // Send an error response back to the client
        res.status(500).json({ success: false, message: "Failed to fetch product details" });
    }










}



const add_to_cart_frequently = async (req, res) => {
    const userData = req.session.userData;
    const requestData = req.body;
    const desiredUomCode = requestData.primary_uom_code;
    const productId = req.body.product_id;

    try {
        const getCart_id = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        const carts_id_ = {
            method: 'post',
            url: GET_CART_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: getCart_id
        };

        const cartsresponse = await axios.request(carts_id_);
        const carts_id = cartsresponse.data.result || '';
        const Checkcarts_id = carts_id.id

        const TOP_BRAND = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status,
            skip: 0,
            limit: 10
        };

        const config_cart = {
            method: 'post',
            url: FREQUENTLY_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: TOP_BRAND
        };

        const addToCartResponse = await axios.request(config_cart);
        const TOP_BRAND_PRODUCTS = addToCartResponse.data.result;

        let singleProductResult = null;

        TOP_BRAND_PRODUCTS.forEach(product => {
            if (String(product.product_id) === productId) {
                singleProductResult = product;
            }
        });

        let convRate; // Variable to store the conv_rate value
        let primary_uom_code;
        for (const uomDetail of singleProductResult.uom_details) {
            if (uomDetail.id === parseInt(desiredUomCode)) { // Parse desiredUomCode to ensure it's an integer
                // If a match is found, assign the conv_rate to the convRate variable
                convRate = uomDetail.conv_rate;
                primary_uom_code = uomDetail.uom_code;
                // Exit the loop since we found the desired UOM detail
                break;
            }
        }

        if (singleProductResult) {
            const cartData = {
                total: '',
                total_tax_value: "",
                total_discount_amount: "",
                grand_total: '',
                product_details: [
                    {
                        cart_id: Checkcarts_id,
                        customer_id: userData.id,
                        channel_id: userData.channel_id,
                        product_id: singleProductResult.product_id || req.body.product_id,
                        scheme_id: null,
                        list_price_id: singleProductResult.price_list_id,
                        uom_conversion_id: "1",
                        product_name: singleProductResult.name,
                        item_code: singleProductResult.item_code,
                        barcode: singleProductResult.barcode,
                        image: singleProductResult.image,
                        primary_uom_code: primary_uom_code,
                        uom_code: primary_uom_code,
                        conv_rate: convRate,
                        qty: req.body.quantity,
                        list_price: convRate,
                        gross_price: convRate,
                        eanno: singleProductResult.eanno,
                        discount: "",
                        discount_amount: "",
                        gross_amount: singleProductResult.gross_price,
                        total_amount: singleProductResult.list_price,
                        vat_per: singleProductResult.vat_per,
                        vat_cat: singleProductResult.vat_cat
                    }
                ],
                login_id: userData.login_id,
                customer_id: userData.id,
                channel_id: userData.channel_id
            };

            //("cartData", cartData);

            const config_cart = {
                method: 'post',
                url: CART_URL,
                headers: {
                    'Authorization': `Bearer ${req.session.accessToken}`,
                },
                data: cartData
            };

            const addToCartResponse = await axios.request(config_cart);

            const responseData = {
                status: addToCartResponse.status,
                data: {
                    message: 'Product details retrieved successfully'
                }
            };

            res.status(200).json({ success: true, message: 'Item added to cart successfully', data: responseData });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}




module.exports = {
    frequently,
    frequently_Details,
    add_to_cart_frequently
}