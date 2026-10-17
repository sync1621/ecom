<?php
require 'config.php';
require_login();
$u = current_user();
$flash = $_SESSION['flash'] ?? '';
unset($_SESSION['flash']);

$title = 'Checkout';
require 'header.php';
?>
<main class="checkout">
    <h1>Checkout</h1>

    <?php if ($flash): ?><p class="notice error"><?= e($flash) ?></p><?php endif; ?>

    <form id="checkout-form" class="checkout-grid" method="post" action="place_order.php">
        <div>
            <section class="panel">
                <h2>Contact and delivery</h2>
                <label class="field"><span>Full name</span><input type="text" name="full_name" value="<?= e(trim($u['first_name'] . ' ' . $u['last_name'])) ?>" required></label>
                <div class="row2">
                    <label class="field"><span>Email</span><input type="email" name="email" value="<?= e($u['email']) ?>" required></label>
                    <label class="field"><span>Mobile number</span><input type="text" name="phone" value="<?= e($u['phone']) ?>" placeholder="0917 123 4567" required></label>
                </div>
                <label class="field"><span>Street, building, barangay</span><input type="text" name="address" value="<?= e($u['address']) ?>" required></label>
                <div class="row2">
                    <label class="field"><span>City</span><input type="text" name="city" value="<?= e($u['city']) ?>" required></label>
                    <label class="field"><span>Province</span><input type="text" name="province" value="<?= e($u['province']) ?>" required></label>
                </div>
                <label class="field"><span>ZIP code</span><input type="text" name="zip" value="<?= e($u['zip']) ?>" required></label>
                <p class="hint">Want this filled in next time? Save it in <a href="account.php">your account</a>.</p>
            </section>

            <section class="panel">
                <h2>Shipping method</h2>
                <?php foreach (SHIPPING as $key => $s): ?>
                    <label class="option">
                        <input type="radio" name="shipping" value="<?= e($key) ?>" <?= $key === 'standard' ? 'checked' : '' ?>>
                        <span><?= e($s['label']) ?></span><b><?= peso($s['fee']) ?></b>
                    </label>
                <?php endforeach; ?>
                <p class="hint">Free shipping on orders of <?= peso(FREE_SHIPPING_MIN) ?> or more.</p>
            </section>

            <section class="panel">
                <h2>Payment method</h2>
                <?php foreach (PAYMENTS as $key => $p): ?>
                    <label class="option">
                        <input type="radio" name="payment" value="<?= e($key) ?>" data-note="<?= e($p['note']) ?>" <?= $key === 'cod' ? 'checked' : '' ?>>
                        <span><?= e($p['label']) ?></span>
                    </label>
                <?php endforeach; ?>
                <p class="pay-note" id="pay-note"></p>
            </section>
        </div>

        <aside class="panel summary">
            <h2>Order summary</h2>
            <div id="co-items"></div>
            <div id="co-ids"></div>

            <div class="voucher">
                <input type="text" id="voucher-input" placeholder="Voucher code" aria-label="Voucher code" autocomplete="off">
                <button type="button" class="btn btn-outline" id="voucher-apply">Apply</button>
            </div>
            <input type="hidden" name="voucher" id="voucher-field" value="">
            <p class="voucher-msg" id="voucher-msg"></p>

            <div class="totals-row"><span>Subtotal</span><span id="t-sub">₱0.00</span></div>
            <div class="totals-row discount" id="r-disc" hidden><span>Voucher discount</span><span id="t-disc"></span></div>
            <div class="totals-row"><span>Shipping</span><span id="t-ship">₱0.00</span></div>
            <div class="totals-row grand"><span>Total</span><span id="t-total">₱0.00</span></div>

            <button class="btn btn-solid btn-block" id="place-btn" type="submit">Place order</button>
        </aside>
    </form>
</main>

<script src="products.php"></script>
<script src="checkout.js"></script>
<?php require 'footer.php'; ?>
