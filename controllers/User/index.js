
const axios = require('axios');

const { urls } = require('../../api');
const { GET_FAQS_URL,
    PAYMENT_URL,
    GET_CUSTOMER_LOYALTY_POINT_URL,
    give_away_URL,
    return_get_orders_URL,
    INVOICED_get_orders_URL,
    get_order_by_id_URL,
    PENDING_PAYMENT_ORDER_URL,
    UPDATE_USER_URL,
    PROFILE_URL,
    get_security_question_URL,
    RESET_PASSWORD_URL,
    get_reason_by_type,
    return_add_order
} = urls


const ProfilePage = async (req, res) => {
    // Your logic to  the profile page

    const userData = req.session.userData;
    ////("**********************************************************", userData);


    try {


        const security_question = await axios.get(get_security_question_URL);

        // Create the user profile data to send in the request
        const userProfileData = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Make the request to the profile endpoint
        const response = await axios.post(PROFILE_URL, userProfileData, { headers: req.headers });
        const get_security_question = security_question.data.result

        ////(get_security_question);

        // Render the profile page with the profile data
        res.render('User/Profile', { Profile: response.data, userData: userData, get_security_question: get_security_question });

        // Set up the headers with the access token

    } catch (error) {
        // Handle error
        console.error('Error fetching profile:', error);
        res.redirect('/page');
    }

};

const update_user = async (req, res) => {
    // Your logic to  the profile page

    try {
        const userData = req.session.userData;

        const { landline_no, manager_mobile_no, manager_whatsapp_no, manager_name, security_question_id, security_question_answer } = req.body

        const update_user_ = {
            login_id: userData.login_id,
            customer_id: String(userData.id),
            channel_id: String(userData.channel_id),
            landline_no: landline_no,
            manager_mobile_no: manager_mobile_no,
            manager_whatsapp_no: manager_whatsapp_no,
            manager_name: manager_name,
            security_question_id: security_question_id,
            security_question_answer: security_question_answer

        };



        const update_user__ = {
            method: 'post',
            url: UPDATE_USER_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: update_user_ // Include cartData inside the data field
        };

        // Make the request to add the cart data
        const update_user_Data = await axios.request(update_user__);

        const update_user_Data_ = {
            status: update_user_Data.status,
            data: {
                message: ' successfully'
                // Include other necessary properties from updateCartResponse
            }
        };



        res.redirect('./Profile')

    } catch (error) {
        //(error);

    }

};

const CreditDetailsPage = async (req, res) => {
    // Your logic to  the credit details page

    try {

        const userData = req.session.userData;

        const CreditDetails = {
            login_id: userData.login_id,
            customer_id: String(userData.id),
            channel_id: String(userData.channel_id),
            payment_status: 0,
            skip: 0,
            limit: 100
        };

        const PENDING_PAYMENT_ORDER = await axios.post(PENDING_PAYMENT_ORDER_URL, CreditDetails, { headers: req.headers });
        const PENDING_PAYMENT_ORDER_data = PENDING_PAYMENT_ORDER.data.result

        //(PENDING_PAYMENT_ORDER_data);


        ////(PENDING_PAYMENT_ORDER_data);
        res.render('User/CreditDetails', { userData: userData, PENDING_PAYMENT_ORDER_data: PENDING_PAYMENT_ORDER_data });
    } catch (error) {
        //(error);

    }
};

const LoyaltyPointsPage = async (req, res) => {
    try {

        const userData = req.session.userData;

        const give_awayPoint = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            skip: 0,
            limit: 10
        };



        const give_away = await axios.post(give_away_URL, give_awayPoint, { headers: req.headers });
        const give_awayPoint_data = give_away.data.result

        //(give_awayPoint_data);


        const LoyaltyPoint = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            skip: 0,
            limit: 10
        };

        const response = await axios.post(GET_CUSTOMER_LOYALTY_POINT_URL, LoyaltyPoint, { headers: req.headers });
        const LoyaltyPoint_data = response.data.result

        //(LoyaltyPoint_data);

        // Assuming userData is retrieved from the session


        // Render the 'LoyaltyPoints' view, passing userData to it
        res.render('User/LoyaltyPoints', { userData: userData, LoyaltyPoint_data: LoyaltyPoint_data, give_awayPoint_data });
    } catch (error) {
        console.error('Error fetching payment summary:', error);
        // Handle error rendering the loyalty points page
        res.status(500).send('Internal Server Error');
    }
};


const LanguageSettingsPage = (req, res) => {
    // Your logic to  the language settings page

    const userData = req.session.userData;
    res.render('User/LanguageSettings', { userData: userData });
};

const PreviousOrdersPage = (req, res) => {
    // Your logic to  the previous orders page

    try {
        const userData = req.session.userData;
        res.render('User/PreviousOrders', { userData: userData });

    } catch (error) {
        //(error);

    }

};


const PreviousOrdersInvoice = async (req, res) => {
    try {
        const userData = req.session.userData;

        res.render('User/PreviousOrdersInvoice', { userData: userData });

    } catch (error) {
        //(error);

    }

}


const PreviousOrdersAjex = async (req, res) => {
    try {
        const userData = req.session.userData;

        const { startDate, endDate, nextPageNumber, APPROVED } = req.body;
        const limit = 10; // Number of categories per page (adjust as needed)
        const skip = (nextPageNumber - 1) * limit; // Calculate skip value based on page number and limit
        //(req.body);


        const Orders = {
            login_id: userData.login_id,
            customer_id: String(userData.id),
            channel_id: String(userData.channel_id),
            order_status: [APPROVED],
            skip: skip,
            limit: limit,
            filter: {
                from_date: startDate || "", // Use startDate from request or default to empty
                to_date: endDate || "" // Use endDate from request or default to empty
            }
        };

        const config = {
            method: 'post',
            url: INVOICED_get_orders_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: Orders // Include return_get_orders inside the data field
        };

        // Make the request to fetch return order data
        const response = await axios.request(config);
        const return_get = response.data.result; // Assuming the response contains return_get


        // Prepare the response object
        const responseData = {
            status: 'success',
            data: return_get
        };

        // Send the response as JSON
        res.json(responseData);

    } catch (error) {
        //(error);

    }

}


const PreviousOrdersProgress = async (req, res) => {
    try {
        const userData = req.session.userData;


        res.render('User/PreviousOrdersProgress', { userData: userData });

    } catch (error) {
        //(error);

    }

}



const PreviousOrdersDelivered = async (req, res) => {




    try {
        const userData = req.session.userData;


        res.render('User/PreviousOrdersDelivered', { userData: userData });

    } catch (error) {
        //(error);

    }

}


const PreviousOrderscancel = async (req, res) => {




    try {
        const userData = req.session.userData;





        res.render('User/PreviousOrderscancel', { userData: userData });

    } catch (error) {
        //(error);

    }

}

const OrdersDetails = async (req, res) => {
    try {
        const userData = req.session.userData;
        const Orders = {
            login_id: userData.login_id,
            customer_id: String(userData.id),
            channel_id: String(userData.channel_id),
            order_id: Number(req.params.id)

        };

        const response = await axios.post(get_order_by_id_URL, Orders, { headers: req.headers });

        res.render('User/OrdersDetails', { userData: userData, OrdersDetails: response.data.result });

    } catch (error) {
        //(error);



    }

}





const ApprovelRequest = async (req, res) => {

    try {
        const userData = req.session.userData;


        res.render('User/ApprovelRequest', { userData: userData });

    } catch (error) {

        //(error);

    }

};





const PurchaseReturnsPage = async (req, res) => {

    try {
        const userData = req.session.userData;

        res.render('User/PurchaseReturns', { userData: userData, });

    } catch (error) {

        //(error);

    }

};



const PurchaseReturnsAjex = async (req, res) => {
    //("PurchaseReturnsAjex");

    try {

        const userData = req.session.userData;
        const { startDate, endDate, nextPageNumber, APPROVED } = req.body;
        const limit = 10; // Number of categories per page (adjust as needed)
        const skip = (nextPageNumber - 1) * limit; // Calculate skip value based on page number and limit
        //(req.body);

        const return_get_orders = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            return_order_status: [APPROVED],
            skip: skip,
            limit: limit,
            filter: {
                from_date: startDate || "", // Use startDate from request or default to empty
                to_date: endDate || "" // Use endDate from request or default to empty
            }
        };

        const config = {
            method: 'post',
            url: return_get_orders_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: return_get_orders // Include return_get_orders inside the data field
        };

        // Make the request to fetch return order data
        const response = await axios.request(config);
        const return_get = response.data.result; // Assuming the response contains return_get

        //("PurchaseReturnsAjex", return_get);

        // Prepare the response object
        const responseData = {
            status: 'success',
            data: return_get
        };

        // Send the response as JSON
        res.json(responseData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'An error occurred' });
    }
};


const ReturnPge = async (req, res) => {
    const userData = req.session.userData;

    res.send("userData")

    try {

        res.render('User/Return', { userData: userData, result_data: result_data });

    } catch (error) {

        //(error);

    }
}







const product_Return = async (req, res) => {
    const userData = req.session.userData;
    const order_id = req.body.order_id.trim();
    const customer_trx_id = req.body.customer_trx_id.trim();



    try {
        const return_get_orders = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            order_id: Number(order_id),
            customer_trx_id: Number(customer_trx_id),
        };

        const config = {
            method: 'post',
            url: get_order_by_id_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: return_get_orders,
        };

        const response = await axios.request(config);
        const return_data = response.data.result;

        //("return_data-------****", return_data);


        // Utility function to ensure arrays
        const toArray = (value) => Array.isArray(value) ? value : [value];

        // Extract and ensure all fields are arrays
        const product_ids = toArray(req.body['product_id[]']);
        const return_qtys = toArray(req.body['return_qty[]']);
        const batch_nos = toArray(req.body['batch_no[]']);
        const dates = toArray(req.body['date[]']);
        const reason_ids = toArray(req.body['reason_id[]']);

        // Log extracted data for debugging


        // Filter the product details based on product IDs
        const filtered_product_details = return_data.product_details.filter(product =>
            product_ids.includes(product.id.toString())
        );

        //("filtered_product_details", filtered_product_details);


        // Map additional return data to each filtered product
        const updated_product_details = filtered_product_details.map(product => {
            const matchingIndex = product_ids.indexOf(product.id.toString());
            return {
                ...product,
                return_qty: return_qtys[matchingIndex] || '',
                batch_no: batch_nos[matchingIndex] || '',
                date: dates[matchingIndex] || '',
                reason_id: reason_ids[matchingIndex] || ''
            };
        });

        // Update return_data with the new product details
        return_data.product_details = updated_product_details;

        //("updated_product_details", updated_product_details);

        const productDetails = updated_product_details.map(product => ({
            order_id: product.order_id, // Extract order_id from each product object
            order_no: product.order_no, // Extract order_no from each product object
            customer_trx_id: product.customer_trx_id, // Extract customer_trx_id from each product object
            customer_trx_line_id: product.customer_trx_line_id,
            // Include other properties as needed
        }));

        //("productDetailsproductDetailsproductDetails", productDetails);


        // Create the final data object
        const data = {
            login_id: userData.login_id,
            order_id: productDetails[0].order_id, // Access order_id of the first product
            order_no: productDetails[0].order_no, // Access order_no of the first product
            customer_id: userData.id,
            channel_id: userData.channel_id,
            customer_trx_id: productDetails[0].customer_trx_id,// Access customer_trx_id of the first product

            total_return_amount: "",
            approve_return_amount: "",
            shipping_address_id: return_data.shipping_address_id,
            payment_mode: return_data.payment_mode,
            product_details: return_data.product_details.map(product => ({
                order_id: product.order_id,
                customer_trx_id: product.customer_trx_id,
                customer_trx_line_id: product.customer_trx_line_id,
                customer_id: product.customer_id,
                channel_id: product.channel_id,
                product_id: product.id,
                scheme_id: "",
                list_price_id: product.list_price_id,
                uom_conversion_id: product.uom_conversion_id,
                product_name: product.product_name,
                vat_per: product.vat_per,
                vat_cat: product.vat_cat,
                item_code: product.item_code,
                barcode: product.barcode,
                image: product.image,
                primary_uom_code: product.primary_uom_code,
                uom_code: product.uom_code,
                conv_rate: product.conv_rate,
                qty: product.qty,
                return_qty: product.return_qty,
                batch_no: product.batch_no,
                expiry_date: product.date,
                reason_id: product.reason_id,
                reason: "",
                remarks: "",
                list_price: product.list_price,
                gross_price: product.gross_price,
                eanno: product.eanno
            }))
        };

        //(data, "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");

        res.send(data)


        // const config_data = {
        //     method: 'post',
        //     url: return_add_order,
        //     headers: {
        //         'Authorization': `Bearer ${req.session.accessToken}`,
        //     },
        //     data: data,
        // };

        // const _response = await axios.request(config_data);

        ////("Final data to send:", _response.data);

        // res.send(_response.data);

    } catch (error) {
        console.error("Error occurred:", error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
};













const Return = async (req, res) => {
    const userData = req.session.userData;

    const order_id = req.body.order_id
    const customer_trx_id = req.body.customer_trx_id

    //("************************", customer_trx_id);

    try {


        const get_reason_by_type__data = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            reason_type: "RETURN_REASON",


        };

        const config_type = {
            method: 'post',
            url: get_reason_by_type,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: get_reason_by_type__data,
        };

        const response__ = await axios.request(config_type);
        const result_data = response__.data.result;



        //("result_data,", result_data);





        const return_get_orders = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            order_id: Number(order_id),
            customer_trx_id: Number(customer_trx_id),


        };



        const config = {
            method: 'post',
            url: get_order_by_id_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: return_get_orders // Include cartData inside the data field
        };

        // Make the request to fetch category data
        const response = await axios.request(config);
        const return_data = response.data.result; // Assuming the response contains categoryListData
        // Check if the response status is not 200


        //("return_data page---", return_data);



        res.render('User/Return', { userData: userData, return_data: return_data, order_id, customer_trx_id, result_data: result_data });

    } catch (error) {

        //(error);

    }
}


const ReturnRequest = async (req, res) => {
    const userData = req.session.userData;


    try {
        const return_get_orders = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            order_status: ["CLOSED"],
            skip: 0,
            limit: 100,
            filter: {
                from_date: "",
                to_date: ""
            }


        };

        const response = await axios.post(INVOICED_get_orders_URL, return_get_orders, { headers: req.headers });
        const return_data = response.data.result

        //("ReturnRequest page------", return_data);

        res.render('User/ReturnRequest', { userData: userData, return_data: return_data });

    } catch (error) {

        //(error);

    }
}

const PaymentSummaryPage = async (req, res) => {
    // Your logic to the payment summary page

    try {
        const userData = req.session.userData;



        res.render('User/PaymentSummary', { userData: userData, });
    } catch (error) {
        //(error);
        // Handle the error appropriately, such as sending an error response to the client
        res.redirect('/')
    }
};



const PaymentSummaryAjex = async (req, res) => {
    try {
        const userData = req.session.userData;

        const { nextPageNumber } = req.body
        const limit = 10; // Number of categories per page (adjust as needed)
        const skip = (nextPageNumber - 1) * limit; // Calculate skip value based on page number and limit
        //(req.body);

        // Extract pagination parameters from the request

        const PaymentSummaryPage = {
            login_id: userData.login_id,
            customer_id: String(userData.id),
            channel_id: String(userData.channel_id),
            skip, // Calculate the skip value based on the page number and limit
            limit
        };

        const axiosResponse = await axios.post(PAYMENT_URL, PaymentSummaryPage, {
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            }
        });

        const return_get = axiosResponse.data.result; // Assuming the response contains return_get
        const paymentSummaryData = {
            status: 'success',
            data: return_get
        };
        // Send the payment summary data back to the client
        res.json(paymentSummaryData);
    } catch (error) {
        //(error);
        // Handle the error appropriately, such as sending an error response to the client
        res.status(500).json({ error: 'An error occurred while fetching payment summary data' });
    }
};




const FAQPage = async (req, res) => {
    try {
        const userData = req.session.userData;

        // Fetch FAQs list from the server
        const response = await axios.get(GET_FAQS_URL, { headers: req.headers });
        const faqs = response.data.result; // Extract the FAQs array from the response

        // Render the FAQ page, passing the FAQs data to the view
        res.render('User/FrequentlyAskedQuestions', { userData: userData, faqs: faqs });
    } catch (error) {
        console.error('Error fetching FAQs:', error.message);
        // Handle the error appropriately
        res.status(500).send('Error fetching FAQs');
    }
};


const ResetPasswordPage = (req, res) => {
    try {
        const userData = req.session.userData;
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');

        res.render('User/ResetPassword', { userData, errorMessages, successMessages });
    } catch (error) {
        //(error.message);
    }
};


const UpdatePassword = async (req, res) => {
    try {
        // Extract fields from the request body
        const { oldPassword, newPassword, Confirm_Password } = req.body;

        // Check if all required fields are present
        if (!oldPassword || !newPassword || !Confirm_Password) {
            throw new Error('All fields are required');
        }

        // Check if the new password matches the confirmation
        if (newPassword !== Confirm_Password) {
            throw new Error('New password and confirmation do not match');
        }

        // Your logic to the reset password page
        const userData = req.session.userData;

        const data = {
            login_id: userData.login_id,
            old_password: oldPassword,
            password: newPassword
        };



        let config = {
            method: 'post',
            url: RESET_PASSWORD_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config);


        // Check if the request was successful
        if (response.data && response.data.status) {
            // Set a flash message to indicate success
            req.flash('success', 'Password updated successfully');
        } else {
            // If the request was not successful, log an error message
            console.error('Failed to update password:', response.data.message);

            // Set a flash message to indicate failure
            req.flash('error', response.data.message || 'Failed to update password');
        }

        // Redirect the user to the 'ResetPassword' page
        return res.redirect('./ResetPassword');
    } catch (error) {
        console.error('Error updating password:', error.message);

        // Set a flash message to indicate failure
        req.flash('error', error.message);
        return res.redirect('./ResetPassword');
    }
};








const logout = (req, res) => {
    const userData = req.session.userData;

    // Log user data before destroying the session

    // Your logic to handle user logout
    // For example, clearing session data
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/'); // Redirect to the home page after logout
    });
};


module.exports = {
    ProfilePage,
    update_user,
    CreditDetailsPage,
    LoyaltyPointsPage,
    LanguageSettingsPage,
    PreviousOrdersPage,
    PreviousOrdersProgress,
    PreviousOrdersDelivered,
    PreviousOrderscancel,
    PreviousOrdersInvoice,
    PurchaseReturnsPage,
    OrdersDetails,
    PaymentSummaryPage,
    PaymentSummaryAjex,
    FAQPage,
    ResetPasswordPage,
    UpdatePassword,
    ReturnRequest,
    ApprovelRequest,
    ReturnPge,
    Return,
    product_Return,
    PurchaseReturnsAjex,
    PreviousOrdersAjex,
    logout
};


