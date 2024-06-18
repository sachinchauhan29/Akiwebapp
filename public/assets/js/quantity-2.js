// // Event listener for clicking on the plus button
// $('.qty-right-plus').click(function () {
//     if ($(this).prev().val() < 9) {
//         $(this).prev().val(+$(this).prev().val() + 1);
//         // Retrieve the updated quantity value
//         var quantity = $(this).prev().val();
//        //("Updated quantity:", quantity);
//     }
// });

// // Event listener for clicking on the minus button
// $('.qty-left-minus').click(function () {
//     var $qty = $(this).siblings(".qty-input");
//     var _val = $($qty).val();
//     if (_val == '1') {
//         var _removeCls = $(this).parents('.cart_qty');
//         $(_removeCls).removeClass("open");
//     }
//     var currentVal = parseInt($qty.val());
//     if (!isNaN(currentVal) && currentVal > 0) {
//         $qty.val(currentVal - 1);
//         // Retrieve the updated quantity value
//         var quantity = $qty.val();
//        //("Updated quantity:", quantity);
//     }
// });

// Event listener for clicking on the add to cart button
$(".addcart-button").click(function () {
    $(this).next().addClass("open");
    $(".add-to-cart-box .qty-input").val('1');
    //("started adding to cart");
});
