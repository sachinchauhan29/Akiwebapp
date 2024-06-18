const axios = require('axios');
const { urls } = require('../../api');

const { get_sales_man } = urls;


const contact = async (req, res) => {

    try {
        const userData = req.session.userData;

        const get_sales_man_data = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status,
            skip: 0,
            limit: 10

        };

        // Retrieve cart count
        const responseget_sales_man = await axios.post(get_sales_man, get_sales_man_data, { headers: req.headers });
        const Result = responseget_sales_man.data.result;
        //(Result);

        res.render('contact-us/contact-us', { userData: userData, sales_man_Data: Result })

    } catch (error) {

        //(error.message);

    }

}

module.exports = { contact: contact }