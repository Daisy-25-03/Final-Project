$(document).ready(function () {
    $('.fullbanner').slick({
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    });

    // Smooth scroll to menu when starting an order
    $('.home-order-btn .btn, .banner-menu a[href="#menu"]').on('click', function (e) {
        e.preventDefault();
        var $target = $('#menu');
        if ($target.length) {
            $('html, body').animate({ scrollTop: $target.offset().top - 40 }, 600);
        }
    });

    // Food category filtering
    $('.menu-category-tab').on('click', function () {
        var category = $(this).data('category');
        $('.menu-category-tab').removeClass('active');
        $(this).addClass('active');

        if (category === 'all') {
            $('.menu-item').show();
        } else {
            $('.menu-item').hide().filter('[data-category="' + category + '"]').show();
        }
    });

    // Simple cart implementation
    var DELIVERY_FEE = 5000;
    var cart = [];

    function formatCurrency(amount) {
        amount = amount || 0;
        return 'UGX ' + amount.toLocaleString('en-UG');
    }

    function renderCart() {
        var $items = $('#cart-items');
        $items.empty();

        if (!cart.length) {
            $items.append('<p class="cart-empty">Your cart is empty. Add something delicious.</p>');
        } else {
            cart.forEach(function (item, index) {
                var itemHtml = '<div class="cart-item" data-index="' + index + '">' +
                    '<div class="cart-item-main">' +
                    '<span class="cart-item-name">' + item.name + '</span>' +
                    '<span class="cart-item-qty">× ' + item.qty + '</span>' +
                    '</div>' +
                    '<div class="cart-item-meta">' +
                    '<span class="cart-item-price">' + formatCurrency(item.price * item.qty) + '</span>' +
                    '<button type="button" class="cart-remove" aria-label="Remove ' + item.name + '">Remove</button>' +
                    '</div>' +
                    '</div>';
                $items.append(itemHtml);
            });
        }

        var subtotal = cart.reduce(function (sum, item) {
            return sum + item.price * item.qty;
        }, 0);
        var delivery = cart.length ? DELIVERY_FEE : 0;
        var total = subtotal + delivery;

        $('#cart-subtotal').text(formatCurrency(subtotal));
        $('#cart-delivery').text(formatCurrency(delivery));
        $('#cart-total').text(formatCurrency(total));
    }

    $('.menu-items').on('click', '.add-to-cart', function () {
        var name = $(this).data('name');
        var price = parseInt($(this).data('price'), 10) || 0;

        var existing = cart.find(function (item) { return item.name === name; });
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name: name, price: price, qty: 1 });
        }

        renderCart();
    });

    $('#cart-items').on('click', '.cart-remove', function () {
        var index = $(this).closest('.cart-item').data('index');
        if (index !== undefined) {
            cart.splice(index, 1);
            renderCart();
        }
    });

    // Checkout form handling
    $('#checkout-form').on('submit', function (e) {
        e.preventDefault();

        var $message = $('#order-message');
        $message.removeClass('success error').text('');

        if (!cart.length) {
            $message.addClass('error').text('Please add at least one item to your cart before placing your order.');
            return;
        }

        if (!this.checkValidity()) {
            $message.addClass('error').text('Please fill in all required delivery information and choose a payment method.');
            this.reportValidity();
            return;
        }

        var name = $('#customer-name').val();
        var payment = $('input[name="payment"]:checked').val();

        $message.addClass('success').text('Thank you ' + name + '. Your order has been received. We will contact you shortly to confirm your ' + payment + ' payment and delivery details.');

        // Reset cart and form for this demo experience
        cart = [];
        renderCart();
        this.reset();
    });

    // Initial state
    renderCart();
});
