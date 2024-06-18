// urls.js

require('dotenv').config();

const URL_ = `${process.env.SERVER_IP}:${process.env.SERVER_PORT}`;

console.log(URL_, "Api server");

const urls = {
    LOGIN_URL: `${URL_}/v1/auth/login`,
    RESET_PASSWORD_URL: `${URL_}/v1/auth/reset-password`,
    UPDATE_FORGOT_PASSWORD_URL: `${URL_}/v1/auth/update-forgot-password`,
    FORGOT_PASSWORD_URL: `${URL_}/v1/auth/forgot-password`,
    REGISTER_URL: `${URL_}/v1/auth/register`,
    PROFILE_URL: `${URL_}/v1/users/get-user`,
    UPDATE_USER_URL: `${URL_}/v1/users/update-user`,
    BANNER_URL: `${URL_}/v1/customer/banner`,
    PRODUCT_LISTING_URL: `${URL_}/v1/customer/product/listing`,
    GET_PRODUCT_DETAIL_URL: `${URL_}/v1/customer/product/get-product-detail`,
    CATEGORY_LIST_URL: `${URL_}/v1/customer/category/listing`,
    CATEGORY_DETAILS_URL: `${URL_}/v1/customer/category/get-category-detail`,
    CATEGORY_PARENT_URL: `${URL_}/v1/customer/category/get-category-by-parent`,
    TOP_BRAND_PRODUCT_URL: `${URL_}/v1/customer/product/top-brand-product`,
    TOP_SELLING_PRODUCT_URL: `${URL_}/v1/customer/product/top-selling-product`,
    CART_URL: `${URL_}/v1/customer/cart/add-cart`,
    GET_CART_URL: `${URL_}/v1/customer/cart/get-cart`,
    REMOVE_CART_URL: `${URL_}/v1/customer/cart/remove-cart`,
    GET_FAQS_URL: `${URL_}/v1/customer/setting/get-faqs`,
    PAYMENT_URL: `${URL_}/v1/customer/payment`,
    PENDING_PAYMENT_ORDER_URL: `${URL_}/v1/customer/payment/get-pending-payment-order`,
    OUTSTANDING_PAYMENT_URL: `${URL_}/v1/customer/payment/outstanding-payment`,
    CATALOGUE_URL: `${URL_}/v1/customer/product/catalogue/`,
    FREQUENTLY_URL: `${URL_}/v1/customer/product/frequently`,

    GET_CUSTOMER_LOYALTY_POINT_URL: `${URL_}/v1/customer/loyalty/get-customer-loyalty-point`,
    give_away_URL: `${URL_}/v1/customer/give-away/listing`,
    return_get_orders_URL: `${URL_}/v1/customer/order/return/get-orders`,

    INVOICED_get_orders_URL: `${URL_}/v1/customer/order/get-orders`,
    get_order_by_id_URL: `${URL_}/v1/customer/order/get-order-by-id`,

    get_scheme_detail_by_product_URL: `${URL_}/v1/customer/scheme/get-scheme-detail-by-product`,

    get_security_question_URL: `${URL_}/v1/users/get-security-question`,
    get_channels_URL: `${URL_}/v1/auth/get-channels`,
    get_shipping_address_URL: `${URL_}/v1/customer/order/address/get-shipping-address`,

    count_customerP_loyalty_point_URL: `${URL_}/v1/customer/loyalty/count-customer-loyalty-point`,

    Search_filter_product_URL: `${URL_}/v1/customer/product/filter-product`,

    add_order_URL: `${URL_}/v1/customer/order/add-order`,
    brand_by_parent_URL: `${URL_}/v1/customer/brand/get-category-brand-by-parent`,

    app_content_URL: `${URL_}/v1/customer/setting/app-content`,
    get_sales_man: `${URL_}/v1/customer/sales-man`,
    get_reason_by_type: `${URL_}/v1/customer/reason/get-reason-by-type`,

    return_add_order: `${URL_}/v1/customer/order/return/add-order`,




};

module.exports = { urls };
