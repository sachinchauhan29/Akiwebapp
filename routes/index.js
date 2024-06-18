var express = require('express');
var router = express.Router();

const authController = require('../controllers/Auth')
const auth = require('../middleware/middleware');
const UserController = require('../controllers/User');
const categoryController = require('../controllers/category')
const cartController = require('../controllers/cart')
const catalogueController = require('../controllers/product/catalogue')
const frequentlyController = require('../controllers/product/frequently')
const DealsController = require('../controllers/product/Deals')
const forgot_Controller = require('../controllers/Auth/forgotPassword.js')
const TopBrandsController = require('../controllers/product/TopBrands.js')
const BestSellersController = require('../controllers/product/BestSellers.js')
const HomeController = require('../controllers/Home')
const SearchController = require('../controllers/search')
const contactController = require('../controllers/contact')
const checkoutController = require('../controllers/checkout')
const OrderSummeryController = require('../controllers/OrderSummery')
const OrderAdd = require('../controllers/OrderSummery/addorder')
const ordersuccessController = require('../controllers/ordersuccess/')
const TOP_BRAND = require('../controllers/TopBrands')
const BestSellers = require('../controllers/BestSellers')





/* GET home page. */
router.get('/', auth.setHeadersWithAccessToken, HomeController.HomePage);
router.get('/page', authController.page);

router.get('/search', auth.setHeadersWithAccessToken, SearchController.search);


router.get('/login', authController.login_page)
router.post('/login', authController.login)
router.get('/forgot', forgot_Controller.forgot)
router.post('/forgot', forgot_Controller.forgot_password)
router.get('/otp', auth.ForgotAccessToken, forgot_Controller.otp)
router.post('/otp', auth.ForgotAccessToken, forgot_Controller.UPDATE_FORGOT_PASSWORD)



router.get('/sign-up', authController.sign)
router.post('/sign-up', authController.sign_up_save)


// Use the Profile method from authController in your route banner

router.get('/category', auth.setHeadersWithAccessToken, categoryController.category)
router.post('/category', auth.setHeadersWithAccessToken, categoryController.categoryData)

router.post('/get_scheme_detail_by_product', auth.setHeadersWithAccessToken, categoryController.get_scheme_detail_by_product);

router.get('/category-details/:id', auth.setHeadersWithAccessToken, categoryController.categorydetails);
router.post('/loadmore', auth.setHeadersWithAccessToken, categoryController.loadmore);

router.post('/category-Two', auth.setHeadersWithAccessToken, categoryController.category_Two);
router.post('/Categories_Three', auth.setHeadersWithAccessToken, categoryController.Categories_Three);

router.post('/brand-id', auth.setHeadersWithAccessToken, categoryController.brand);
router.post('/sub_brand_id', auth.setHeadersWithAccessToken, categoryController.sub_brand_id);
router.post('/sub_brand_Two', auth.setHeadersWithAccessToken, categoryController.sub_brand_Two);
router.post('/selectedAll', auth.setHeadersWithAccessToken, categoryController.selectedAll);






router.get('/singleProduct/:customer_product_master_id/:product_id', auth.setHeadersWithAccessToken, categoryController.singleProduct);
router.get('/TopBrands/:product_id', auth.setHeadersWithAccessToken, TopBrandsController.TopBrandsDetails);
router.get('/BestSellers/:product_id', auth.setHeadersWithAccessToken, BestSellersController.BestSellersDetails);

router.post('/addToCartTopBrands/:productId', auth.setHeadersWithAccessToken, TopBrandsController.addToCartTopBrands);
router.post('/addToCartBestSellers/:productId', auth.setHeadersWithAccessToken, BestSellersController.addToCartBestSellers);

router.post('/top-brands', auth.setHeadersWithAccessToken, TOP_BRAND.TOP_BRAND);
router.post('/top-selling', auth.setHeadersWithAccessToken, BestSellers.TOP_SELLING);
router.get('/top-brands', auth.setHeadersWithAccessToken, TOP_BRAND.TOP_BRAND_Page);
router.get('/top-selling', auth.setHeadersWithAccessToken, BestSellers.TOP_SELLING_Page);





// router.post('/add-to-cart/:id', auth.setHeadersWithAccessToken, cartController.addToCart);

router.get('/catalogue', auth.setHeadersWithAccessToken, catalogueController.catalogue)
router.get('/catalogue-Details/:product_id', auth.setHeadersWithAccessToken, catalogueController.catalogue_Details)

router.get('/frequently', auth.setHeadersWithAccessToken, frequentlyController.frequently)
router.get('/frequently-Details/:product_id', auth.setHeadersWithAccessToken, frequentlyController.frequently_Details)
router.post('/add-to-cart-frequently/:productId', auth.setHeadersWithAccessToken, frequentlyController.add_to_cart_frequently);


router.get('/Deals', auth.setHeadersWithAccessToken, DealsController.Deals);


router.get('/cart', auth.setHeadersWithAccessToken, cartController.cart);
router.post('/add-to-cart/:productId', auth.setHeadersWithAccessToken, cartController.addToCart);
router.post('/updateCart/:productId', auth.setHeadersWithAccessToken, cartController.updateCart);

router.post('/remove-from-cart', auth.setHeadersWithAccessToken, cartController.removeCart);
router.get('/checkout', auth.setHeadersWithAccessToken, checkoutController.checkout)
router.post('/checkout', auth.setHeadersWithAccessToken, checkoutController.checkoutPost)

router.get('/OrderSummery', auth.setHeadersWithAccessToken, OrderSummeryController.OrderSummery)
router.get('/order-success', auth.setHeadersWithAccessToken, ordersuccessController.order_success)
router.post('/add-order', auth.setHeadersWithAccessToken, OrderAdd.add_order)
router.get('/contact-us', auth.setHeadersWithAccessToken, contactController.contact)













// Define routes
router.get('/Profile', auth.setHeadersWithAccessToken, UserController.ProfilePage);
router.post('/update_user', auth.setHeadersWithAccessToken, UserController.update_user);

router.get('/CreditDetails', auth.setHeadersWithAccessToken, UserController.CreditDetailsPage);
router.get('/LoyaltyPoints', auth.setHeadersWithAccessToken, UserController.LoyaltyPointsPage);
router.get('/LanguageSettings', auth.setHeadersWithAccessToken, UserController.LanguageSettingsPage);
router.post('/PreviousOrdersAjex', auth.setHeadersWithAccessToken, UserController.PreviousOrdersAjex);
router.get('/PreviousOrdersProgress', auth.setHeadersWithAccessToken, UserController.PreviousOrdersProgress);
router.get('/PreviousOrdersDelivered', auth.setHeadersWithAccessToken, UserController.PreviousOrdersDelivered);
router.get('/PreviousOrderscancel', auth.setHeadersWithAccessToken, UserController.PreviousOrderscancel);
router.get('/Invoice', auth.setHeadersWithAccessToken, UserController.PreviousOrdersInvoice);
router.get('/OrdersDetails/:id', auth.setHeadersWithAccessToken, UserController.OrdersDetails);

router.get('/ApprovelRequest', auth.setHeadersWithAccessToken, UserController.ApprovelRequest);
router.get('/PurchaseReturns', auth.setHeadersWithAccessToken, UserController.PurchaseReturnsPage);
router.post('/PurchaseReturnsAjex', auth.setHeadersWithAccessToken, UserController.PurchaseReturnsAjex);


router.get('/ReturnRequest', auth.setHeadersWithAccessToken, UserController.ReturnRequest);
router.post('/Return', auth.setHeadersWithAccessToken, UserController.Return);
router.post('/product_Return', auth.setHeadersWithAccessToken, UserController.product_Return);

router.get('/Return', auth.setHeadersWithAccessToken, UserController.ReturnPge);


router.get('/PaymentSummary', auth.setHeadersWithAccessToken, UserController.PaymentSummaryPage);
router.post('/PaymentSummaryAjex', auth.setHeadersWithAccessToken, UserController.PaymentSummaryAjex);

router.get('/FrequentlyAskedQuestions', auth.setHeadersWithAccessToken, UserController.FAQPage);
router.get('/ResetPassword', auth.setHeadersWithAccessToken, UserController.ResetPasswordPage);
router.post('/ResetPassword', auth.setHeadersWithAccessToken, UserController.UpdatePassword);

router.get('/logout', auth.setHeadersWithAccessToken, UserController.logout);


module.exports = router;
