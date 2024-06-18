const axios = require('axios');

const { urls } = require('../../api');
const { CATEGORY_DETAILS_URL,
    CATEGORY_LIST_URL,
    CATEGORY_PARENT_URL,
    BANNER_URL,
    PRODUCT_LISTING_URL,
    GET_PRODUCT_DETAIL_URL,
    GET_CART_URL,
    get_scheme_detail_by_product_URL,
    brand_by_parent_URL
} = urls;




const category = async (req, res) => {
    try {
        const userData = req.session.userData;

        const cart_count = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Retrieve cart count
        const responsecart = await axios.post(GET_CART_URL, cart_count, { headers: req.headers });
        const carts_ = responsecart.data.result;
        const CartCount = carts_ ? carts_.product_details.length : 0;
        // Render the view with necessary data
        res.render('category/category', {
            userData: userData,
            CartCount: CartCount,

        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
}

const categoryData = async (req, res) => {
    try {
        const userData = req.session.userData;
        const nextPageNumber = parseInt(req.body.nextPageNumber); // Parse nextPageNumber as integer

        // Define pagination parameters
        const limit = 10; // Number of categories per page (adjust as needed)
        const skip = (nextPageNumber - 1) * limit; // Calculate skip value based on page number and limit

        // Fetch category list with pagination
        const CATEGORYLIST = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status,
            skip: skip,
            limit: limit.toString() // Convert limit to string as per your API requirement
        };

        const config = {
            method: 'post',
            url: CATEGORY_LIST_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: CATEGORYLIST // Include cartData inside the data field
        };

        // Make the request to fetch category data
        const response = await axios.request(config);
        const categoryListData = response.data.result; // Assuming the response contains categoryListData
        // Check if the response status is not 200
        if (response.status !== 200) {
            throw new Error('Failed to fetch categories');
        }

        // Prepare the response object
        const responseData = {
            status: 'success',
            data: categoryListData
        };

        // Send the response as JSON
        // res.json(responseData);


        // Send the JSON string as a response
        res.send(responseData);
    } catch (error) {
        console.error(error.message);
        // If an error occurs, send an appropriate error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const categorydetails = async (req, res) => {
    try {
        const userData = req.session.userData;
        if (!userData) throw new Error('User data not found in session');

        const { id: parent_id } = req.params;


        // const { Categories_one: categoriesOneValue, Categories_Two, brand_id, sub_brand_id, ALL } = req.query;

        const cart_count = { login_id: userData.login_id, customer_id: userData.id, channel_id: userData.channel_id };
        const responsecart = await axios.post(GET_CART_URL, cart_count, { headers: req.headers });
        const CartCount = (responsecart.data.result && responsecart.data.result.product_details) ? responsecart.data.result.product_details.length : 0;

        // const page = parseInt(req.query.page) || 1;

        // const limit_ = 5;
        // const skip = (page - 1) * limit_;
        // const limit = page * limit_; // Calculate the ending index for pagination

        // const productList = {
        //     login_id: userData.login_id, customer_id: userData.id, channel_id: userData.channel_id,
        //     skip, limit, customer_mapping_status: userData.customer_mapping_status,
        //     filter: {
        //         category_1: Number(parent_id),
        //         category_2: categoriesOneValue || "",
        //         category_3: Categories_Two || "",
        //         brand_id, sub_brand_id,
        //         product_type: ALL || "ALL"
        //     }
        // };





        // const response = await axios.post(PRODUCT_LISTING_URL, productList, { headers: req.headers });
        // const productListData = response.data;
        // const totalCount = (productListData.result) ? productListData.result.length : 0;
        // const totalPages = Math.ceil(totalCount / limit);

        const Categories_one____ = { login_id: userData.login_id, customer_id: userData.id, channel_id: userData.channel_id, parent_id: Number(parent_id), customer_mapping_status: userData.customer_mapping_status };
        const Categories_one_ = await axios.post(CATEGORY_PARENT_URL, Categories_one____, { headers: req.headers });
        const CATEGORY_1_result = Categories_one_.data.result;

        let bannerUrl;
        try {
            const postData = { login_id: userData.login_id, banner_type: "CATEGORY" };
            const response = await axios.post(BANNER_URL, postData, { headers: req.headers });
            bannerUrl = (response.data && response.data.result && response.data.result.length > 0) ? response.data.result : null;
        } catch (error) {
            console.error("Error occurred while fetching or processing banner data:", error.message);
        }

        res.render('category/category-details', { userData, bannerUrl, CATEGORY_PARENT: CATEGORY_1_result, url: parent_id, CartCount });
    } catch (error) {
        console.error('Error fetching category details:', error);
        res.redirect('/');
    }
};


const loadmore = async (req, res) => {
    //(req.body);
    const parent_id = req.body.url;
    const nextPageNumber = req.body.nextPageNumber;
    const selectedId = req.body.selectedId;
    const selectedValue = req.body.selectedValue;
    const selectedBrandId = req.body.selectedBrandId;
    const selectedSubBrandValue = req.body.selectedSubBrandValue;
    const selectedAllValue = req.body.selectedAllValue;


    try {
        const userData = req.session.userData;
        if (!userData) throw new Error('User data not found in session');
        const limit = 20; // Number of categories per page (adjust as needed)
        const skip = (nextPageNumber - 20); // Calculate skip value based on page number and limit

        const productList = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            skip,
            limit,
            customer_mapping_status: userData.customer_mapping_status,
            filter: {
                category_1: Number(parent_id),
                category_2: selectedValue || "", // Use selectedId or default to "2" if not provided
                category_3: selectedId || "",
                brand_id: selectedBrandId || "",
                sub_brand_id: selectedSubBrandValue || "",
                product_type: selectedAllValue || "ALL"
            }
        };

        //(productList);

        const config_cart = {
            method: 'post',
            url: PRODUCT_LISTING_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: productList // Include cartData inside the data field
        };

        // Make the request to add the cart data
        const response = await axios.request(config_cart);

        const productListData = response.data.result; // Assuming the response contains productListData

        //("productListData", productListData);
        const responses = {
            status: 'success loadMore',
            data: productListData
        };

        // Send the response as JSON
        res.json(responses);
    } catch (error) {
        console.error('Error fetching category details:', error);
        res.redirect('/');
    }
}



const category_Two = async (req, res) => {
    const userData = req.session.userData;
    try {
        const parent_id__ = req.body.url;
        const category_Two_id = req.body.selectedId;

        const all = req.body.allDropdown;


        //("category_Two_id", category_Two_id, parent_id__);

        const Categories_Two = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            parent_id: Number(category_Two_id),
            customer_mapping_status: userData.customer_mapping_status,
        };


        const limit = 20; // Number of categories per page (adjust as needed)
        const skip = 0; // Calculate skip value based on page number and limit

        const productList = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            skip,
            limit,
            customer_mapping_status: userData.customer_mapping_status,
            filter: {
                category_1: Number(parent_id__),
                category_2: category_Two_id || "", // Use selectedId or default to "2" if not provided
                category_3: "",
                brand_id: "",
                sub_brand_id: "",
                product_type: all || "ALL"
            }
        };


        const config_cart = {
            method: 'post',
            url: PRODUCT_LISTING_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: productList // Include cartData inside the data field
        };

        // Make the request to add the cart data
        const response = await axios.request(config_cart);

        const productListData = response.data.result; // Assuming the response contains productListData

        //("productListDataproductListData********************************", productListData);




        const config = {
            method: 'post',
            url: CATEGORY_PARENT_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: Categories_Two
        };

        // Make the request to get product details
        const Categories_Two_ = await axios.request(config);
        const CATEGORY_2_result = Categories_Two_.data.result;


        res.status(200).json({
            success: true,
            data: CATEGORY_2_result,
            productList: productListData
        });
    } catch (error) {

        //(error.message);

    }

}

const Categories_Three = async (req, res) => {
    const userData = req.session.userData;

    try {


        const Categories_Three = req.body.selectedId;
        const Categories_Three_ = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            parent_id: Number(Categories_Three),
            customer_mapping_status: userData.customer_mapping_status,
        };

        const config = {
            method: 'post',
            url: CATEGORY_PARENT_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: Categories_Three_
        };

        // Make the request to get product details
        const Categories_Three__ = await axios.request(config);
        const CATEGORY_3_result = Categories_Three__.data.result;

        res.status(200).json({ success: true, data: CATEGORY_3_result });




    } catch (error) {

        //(error.message);

    }

}

const brand = async (req, res) => {
    const userData = req.session.userData;
    const parent_id__ = req.body.url;
    const parentCategoryId = req.body.parentCategoryId
    const all = req.body.allDropdown



    //(req.body);

    try {
        const { selectedValue, selectedId } = req.body;

        // Construct the payload for the request
        const brandPayload = {
            login_id: userData.login_id,
            customer_id: String(userData.id),
            channel_id: String(userData.channel_id),
            category_id: selectedId,
            parent_id: "0",
            customer_mapping_status: userData.customer_mapping_status,
        };




        // Configure the request
        const config = {
            method: 'post',
            url: brand_by_parent_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: brandPayload
        };

        // Make the request to fetch brand data
        const response = await axios.request(config);
        const brandResult = response.data.result;









        const limit = 20; // Number of categories per page (adjust as needed)
        const skip = 0; // Calculate skip value based on page number and limit

        const productList = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            skip,
            limit,
            customer_mapping_status: userData.customer_mapping_status,
            filter: {
                category_1: Number(parent_id__),
                category_2: String(parentCategoryId || ""), // Use selectedId or default to "2" if not provided
                category_3: selectedId || "",
                brand_id: "",
                sub_brand_id: "",
                product_type: all || "ALL"
            }
        };


        const config_cart = {
            method: 'post',
            url: PRODUCT_LISTING_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: productList // Include cartData inside the data field
        };

        // Make the request to add the cart data
        const responseData = await axios.request(config_cart);

        const productListData = responseData.data.result; // Assuming the response contains productListData



        // Send the brand data as JSON response
        res.status(200).json({
            success: true,
            data: brandResult,
            selectedId,
            productListData
        });
    } catch (error) {
        console.error('Error fetching brand data:', error);
        res.status(500).json({ success: false, error: 'An error occurred while fetching brand data.' });
    }
};



const sub_brand_id = async (req, res) => {
    const userData = req.session.userData;

    //("sub_brand_id", req.body);

    const selectedCategoryId = req.body.selectedCategoryId
    const selectedBrandId = req.body.selectedBrandId
    const parentCategoryId = req.body.parentCategoryId
    const all = req.body.allDropdown

    const parent_id__ = req.body.url


    try {

        // Construct the payload for the request
        const brandPayload = {
            login_id: userData.login_id,
            customer_id: String(userData.id),
            channel_id: String(userData.channel_id),
            category_id: selectedCategoryId,
            parent_id: selectedBrandId,
            customer_mapping_status: userData.customer_mapping_status,
        };


        // Configure the request
        const config = {
            method: 'post',
            url: brand_by_parent_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: brandPayload
        };

        // Make the request to fetch brand data
        const response = await axios.request(config);
        const brandResult = response.data.result;





        const limit = 20; // Number of categories per page (adjust as needed)
        const skip = 0; // Calculate skip value based on page number and limit

        const productList = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            skip,
            limit,
            customer_mapping_status: userData.customer_mapping_status,
            filter: {
                category_1: Number(parent_id__),
                category_2: String(parentCategoryId || ""), // Use selectedId or default to "2" if not provided
                category_3: selectedCategoryId || "",
                brand_id: selectedBrandId || "",
                sub_brand_id: "",
                product_type: all || "ALL"
            }
        };


        const config_cart = {
            method: 'post',
            url: PRODUCT_LISTING_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: productList // Include cartData inside the data field
        };

        // Make the request to add the cart data
        const responseData = await axios.request(config_cart);

        const productListData = responseData.data.result; // Assuming the response contains productListData

        //("productListDataproductListData**", productListData);


        // Send the brand data as JSON response
        res.status(200).json({
            success: true,
            data: brandResult,
            productListData
        });
    } catch (error) {
        console.error('Error fetching brand data:', error);
        res.status(500).json({ success: false, error: 'An error occurred while fetching brand data.' });
    }
};

const sub_brand_Two = async (req, res) => {

    //("sub_brand_Two",);
    const userData = req.session.userData;

    //("sub_brand_Two", req.body);

    const selectedCategoryId = req.body.selectedCategoryId
    const selectedCategoriesOneValue = req.body.selectedCategoriesOneValue
    const selectedBrandValue = req.body.selectedBrandValue
    const selectedBrandId = req.body.selectedBrandId
    const all = req.body.allDropdown



    const parent_id__ = req.body.url


    try {

        const limit = 20; // Number of categories per page (adjust as needed)
        const skip = 0; // Calculate skip value based on page number and limit

        const productList = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            skip,
            limit,
            customer_mapping_status: userData.customer_mapping_status,
            filter: {
                category_1: Number(parent_id__),
                category_2: String(selectedCategoriesOneValue || ""), // Use selectedId or default to "2" if not provided
                category_3: selectedCategoryId || "",
                brand_id: selectedBrandValue || "",
                sub_brand_id: selectedBrandId || "",
                product_type: all || "ALL"
            }
        };


        const config_cart = {
            method: 'post',
            url: PRODUCT_LISTING_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: productList // Include cartData inside the data field
        };

        // Make the request to add the cart data
        const responseData = await axios.request(config_cart);

        const productListData = responseData.data.result; // Assuming the response contains productListData

        //("productListDataproductListData**", productListData);


        // Send the brand data as JSON response
        res.status(200).json({
            success: true,
            data: productListData,
            productListData
        });
    } catch (error) {
        console.error('Error fetching brand data:', error);
        res.status(500).json({ success: false, error: 'An error occurred while fetching brand data.' });
    }
};



const selectedAll = async (req, res) => {
    const userData = req.session.userData;

    //("sub_brand_id", req.body);

    const selectedCategoriesOneValue = req.body.selectedCategoriesOneValue
    const selectedCategoriesTwoValue = req.body.selectedCategoriesTwoValue
    const selectedBrandValue = req.body.selectedBrandValue
    const selectedSubBrandValue = req.body.selectedSubBrandValue
    const selectedAllValue = req.body.selectedAllValue
    const parent_id__ = req.body.url


    try {



        const limit = 20; // Number of categories per page (adjust as needed)
        const skip = 0; // Calculate skip value based on page number and limit

        const productList = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            skip,
            limit,
            customer_mapping_status: userData.customer_mapping_status,
            filter: {
                category_1: Number(parent_id__),
                category_2: String(selectedCategoriesOneValue || ""), // Use selectedId or default to "2" if not provided
                category_3: selectedCategoriesTwoValue || "",
                brand_id: selectedBrandValue || "",
                sub_brand_id: selectedSubBrandValue || "",
                product_type: selectedAllValue || "ALL"
            }
        };


        const config_cart = {
            method: 'post',
            url: PRODUCT_LISTING_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: productList // Include cartData inside the data field
        };

        // Make the request to add the cart data
        const responseData = await axios.request(config_cart);

        const productListData = responseData.data.result; // Assuming the response contains productListData

        //("productListDataproductListData**", productListData);


        // Send the brand data as JSON response
        res.status(200).json({
            success: true,
            data: productListData,
            productListData
        });
    } catch (error) {
        console.error('Error fetching brand data:', error);
        res.status(500).json({ success: false, error: 'An error occurred while fetching brand data.' });
    }
};





const get_scheme_detail_by_product = async (req, res) => {
    try {
        // Extract necessary data from session
        const userData = req.session.userData;

        // Construct the data to be sent in the request
        const requestData = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            product_id: req.body.product_id,
            scheme_id: req.body.scheme_id
        };

        // Set up the configuration for the request
        const config = {
            method: 'post',
            url: get_scheme_detail_by_product_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: requestData
        };

        // Make the request to fetch scheme details
        const response = await axios.request(config);


        // Send the response back to the client
        res.json({ success: true, message: "Scheme details fetched successfully", data: response.data.result });
    } catch (error) {
        console.error("Error fetching scheme details:", error.message);
        // Send an error response back to the client
        res.status(500).json({ success: false, message: "Failed to fetch scheme details" });
    }
};





const singleProduct = async (req, res) => {




    try {
        const userData = req.session.userData;
        const customer_product_master_id = req.params.customer_product_master_id;
        const product_id = req.params.product_id;


        const cart_count = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };



        // Make the request to the profile endpoint
        const responsecart = await axios.post(GET_CART_URL, cart_count, { headers: req.headers });
        const carts = responsecart.data.result
        const CartCount = carts ? carts.product_details.length : 0; // If carts is truthy, get the length of product_details array, otherwise set CartCount to 0



        let data = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            product_id: product_id,
            customer_product_master_id: customer_product_master_id,
            customer_mapping_status: userData.customer_mapping_status,
        };

        const singleProduct = await axios.post(GET_PRODUCT_DETAIL_URL, data, { headers: req.headers });
        const singleProduct_result = singleProduct.data.result;
        singleProduct_result.customer_product_master_id = customer_product_master_id;

        //(singleProduct_result);




        // const getCart_id = {
        //     login_id: userData.login_id,
        //     customer_id: userData.id,
        //     channel_id: userData.channel_id
        // };
        // const cartsresponse = await axios.post(GET_CART_URL, getCart_id, { headers: req.headers });
        // const carts_id = cartsresponse.data.result || '';





        res.render('category/singleProduct', { userData: userData, singleProduct_result: singleProduct_result, CartCount: CartCount, });
    } catch (error) {
        //(error.message);
        res.redirect('/');
    }
}



module.exports = {
    categorydetails,
    category,
    singleProduct,
    get_scheme_detail_by_product,
    category_Two,
    brand,
    sub_brand_id,
    sub_brand_Two,
    Categories_Three,
    categoryData,
    selectedAll,
    loadmore
};


