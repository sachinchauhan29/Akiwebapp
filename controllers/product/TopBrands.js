const axios = require('axios');
const { urls } = require('../../api');
const { TOP_BRAND_PRODUCT_URL, CART_URL, GET_CART_URL } = urls;

const TopBrandsDetails = async (req, res) => {

    try {
        // Extract the product_id from the request parameters
        const productId = req.params.product_id;
        // Extract necessary data from session
        const userData = req.session.userData;
        // Make the request to fetch the products
        const TOP_BRAND = await axios.post(TOP_BRAND_PRODUCT_URL, {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status
        }, { headers: req.headers });

        // Assuming TOP_BRAND contains the array of products
        const TOP_BRAND_PRODUCTS = TOP_BRAND.data.result;
        let foundProduct = null;

        TOP_BRAND_PRODUCTS.forEach(product => {
            if (String(product.product_id) === productId) { // Convert product_id to string before comparison
                foundProduct = product;
            }
        });


        if (foundProduct) {
            // Render the product details in the 'product/TopBrands' template
            res.render('TopBrands/TopBrands-Details', { userData: userData, product: foundProduct });
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

const addToCartTopBrands = async (req, res) => {
    const userData = req.session.userData;
    const requestData = req.body;
    const desiredUomCode = requestData.primary_uom_code;



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

        const productId = req.body.product_id;
        const TOP_BRAND = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status
        };

        const config_cart = {
            method: 'post',
            url: TOP_BRAND_PRODUCT_URL,
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
    TopBrandsDetails,
    addToCartTopBrands

}