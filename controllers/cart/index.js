const axios = require('axios');
const { urls } = require('../../api');

const { CART_URL, GET_CART_URL, REMOVE_CART_URL, GET_PRODUCT_DETAIL_URL } = urls;



const cart = async (req, res) => {
    const userData = req.session.userData;



    try {

        const userProfileData = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Make the request to the profile endpoint
        const response = await axios.post(GET_CART_URL, userProfileData, { headers: req.headers });
        const carts = response.data.result;



        const cart_count = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Make the request to the profile endpoint
        const responsecart = await axios.post(GET_CART_URL, cart_count, { headers: req.headers });
        const carts_ = responsecart.data.result
        const CartCount = carts_ ? carts_.product_details.length : 0; // If carts is truthy, get the length of product_details array, otherwise set CartCount to 0


        // Display flash messages if any
        let successMessages = req.flash('success');
        let errorMessages = req.flash('error');



        if (carts) {
            res.render('cart/cart', {
                userData: userData, cart: carts, productDetails: carts.product_details, CartCount: CartCount, successMessages: successMessages,
                errorMessages: errorMessages
            });
        } else {

            res.render('cart/cart', {
                userData: userData, cart: null, productDetails: [], successMessages: successMessages,
                errorMessages: errorMessages
            }); // Pass an empty array if cart data is not found
        }




    } catch (error) {

        //(error.message);

        res.redirect('/')

    }

}

const addToCart = async (req, res) => {
    const userData = req.session.userData;
    const requestData = req.body;
    const desiredUomCode = requestData.primary_uom_code;

    try {

        if (userData) {

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
                data: getCart_id // Include cartData inside the data field
            };

            // Make the request to add the cart data
            const cartsresponse = await axios.request(carts_id_);
            const carts_id = cartsresponse.data.result || '';

            const Checkcarts_id = carts_id.id





            // Prepare the request data for getting product details
            let requestData = {
                login_id: userData.login_id,
                customer_id: userData.id,
                channel_id: userData.channel_id,
                product_id: req.body.product_id,
                customer_product_master_id: req.body.customer_product_master_id,
                customer_mapping_status: userData.customer_mapping_status,
            };

            // Set up the configuration for the request to get product details
            const config = {
                method: 'post',
                url: GET_PRODUCT_DETAIL_URL,
                headers: {
                    'Authorization': `Bearer ${req.session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: requestData
            };

            // Make the request to get product details
            const singleProductResponse = await axios.request(config);
            const singleProductResult = singleProductResponse.data.result;


            let convRate; // Variable to store the conv_rate value
            let primary_uom_code;
            for (const uomDetail of singleProductResult.uom_details) {
                // Check if the id property matches the desiredUomCode
                if (uomDetail.id === parseInt(desiredUomCode)) { // Parse desiredUomCode to ensure it's an integer
                    // If a match is found, assign the conv_rate to the convRate variable
                    convRate = uomDetail.conv_rate;
                    primary_uom_code = uomDetail.uom_code;
                    // Exit the loop since we found the desired UOM detail
                    break;
                }
            }



            // Prepare the cart data
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
                        gross_amount: convRate,
                        total_amount: convRate,
                        vat_per: singleProductResult.vat_per,
                        vat_cat: singleProductResult.vat_cat
                    }
                ],
                login_id: userData.login_id,
                customer_id: userData.id,
                channel_id: userData.channel_id
            };


            // Set up the configuration for the request to add the cart data
            const config_cart = {
                method: 'post',
                url: CART_URL,
                headers: {
                    'Authorization': `Bearer ${req.session.accessToken}`,
                },
                data: cartData // Include cartData inside the data field
            };

            // Make the request to add the cart data
            const addToCartResponse = await axios.request(config_cart);

            // Respond with the cart data
            res.status(200).json({ success: true, message: 'Item added to cart successfully', data: addToCartResponse.data });



        } else {

            res.redirect('/login')

        }




    } catch (error) {
        // Handle errors
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateCart = async (req, res) => {
    const userData = req.session.userData;
    const productId = req.body.product_id; // Get the product ID from request body

    try {
        // Get the cart data
        const getCartIdData = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        const getCartConfig = {
            method: 'post',
            url: GET_CART_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: getCartIdData
        };

        const cartsResponse = await axios.request(getCartConfig);
        const cartsData = cartsResponse.data.result;

        if (cartsData && cartsData.product_details) {
            // Find the product in the cart by its ID
            const product = cartsData.product_details.find(product => product.product_id === productId);


            if (product) {
                // Update the quantity of the found product

                const cartData__ = {
                    total: '',
                    total_tax_value: "",
                    total_discount_amount: "",
                    grand_total: '',
                    product_details: [
                        {
                            cart_id: product.cart_id,
                            customer_id: product.customer_id,
                            channel_id: product.channel_id,
                            product_id: product.product_id,
                            scheme_id: product.scheme_id,
                            list_price_id: product.list_price_id,
                            uom_conversion_id: product.uom_conversion_id,
                            product_name: product.product_name,
                            item_code: product.item_code,
                            barcode: product.barcode,
                            image: product.image,
                            primary_uom_code: product.primary_uom_code,
                            uom_code: product.uom_code,
                            conv_rate: product.conv_rate,
                            qty: req.body.quantity,
                            list_price: product.list_price,
                            gross_price: product.gross_price,
                            eanno: product.eanno,
                            discount: product.discount,
                            discount_amount: product.discount_amount,
                            gross_amount: product.gross_amount,
                            total_amount: product.total_amount,
                            vat_per: product.vat_per,
                            vat_cat: product.vat_cat
                        }
                    ],
                    login_id: userData.login_id,
                    customer_id: userData.id,
                    channel_id: userData.channel_id
                };



                // Set up the configuration for the request to update the cart data
                const updateCartConfig = {
                    method: 'post',
                    url: CART_URL,
                    headers: {
                        'Authorization': `Bearer ${req.session.accessToken}`,
                    },
                    data: cartData__ // Updated cart data
                };

                // Make the request to update the cart data
                const updateCartResponse = await axios.request(updateCartConfig);

                const responseData = {
                    status: updateCartResponse.status,
                    data: {
                        message: 'Product successfully'
                        // Include other necessary properties from updateCartResponse
                    }
                };

                if (responseData) {

                    const userProfileData = {
                        login_id: userData.login_id,
                        customer_id: userData.id,
                        channel_id: userData.channel_id
                    };



                    // Set up the configuration for the request to update the cart data
                    const updateCartConfig = {
                        method: 'post',
                        url: GET_CART_URL,
                        headers: {
                            'Authorization': `Bearer ${req.session.accessToken}`,
                        },
                        data: userProfileData // Updated cart data
                    };

                    // Make the request to update the cart data
                    const response = await axios.request(updateCartConfig);
                    const carts = response.data.result;

                    res.status(200).json({ success: true, message: 'Product details retrieved successfully', data: responseData, AllCart: carts });


                } else {
                    res.status(404).json({ success: false, message: 'Product not found in the All cart' });




                }


                // Respond with success message
                // Respond with the product details
            } else {
                // Product not found in the cart
                res.status(404).json({ success: false, message: 'Product not found in the cart' });
            }
        } else {
            // Cart data or product details not found
            res.status(404).json({ success: false, message: 'Cart data or product details not found' });
        }
    } catch (error) {
        // Handle errors
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};





const removeCart = async (req, res) => {
    try {
        const userData = req.session.userData;

        // Construct the request payload
        const data = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            cart_id: req.body.cart_id,
            product_id: req.body.product_id,
            remove_type: "PRODUCT"
        };

        // Configure the request
        const config = {
            method: 'post',
            url: REMOVE_CART_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        };

        // Make the request
        const response = await axios.request(config);

        // Flash success message
        req.flash('success', 'Product removed successfully.');

        // Redirect to the cart page
        res.redirect('/cart');
    } catch (error) {
        // Log the error
        //(error);

        // Flash error message
        req.flash('error', 'Error occurred while removing the product.');

        // Redirect to the cart page
        res.redirect('/cart');
    }
};







module.exports = {
    cart,
    addToCart,
    removeCart,
    updateCart
}