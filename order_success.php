<?php
require 'config.php';
require_login();

$st = $pdo->prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?');
$st->execute([(int)($_GET['id'] ?? 0), $_SESSION['uid']]);
$o = $st->fetch();
if (!$o) { header('Location: index.php'); exit; }

$st = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ?');
$st->execute([$o['id']]);
$items = $st->fetchAll();
$pay = PAYMENTS[$o['payment_method']] ?? null;

$title = 'Order placed';
require 'header.php';
?>
<main class="form-page wide">
    <section class="panel" style="text-align:center;">
        <i class="bi bi-check-circle success-icon"></i>
        <h1>Thank you, <?= e(explode(' ', $o['full_name'])[0]) ?>!</h1>
        <p class="subtitle">Your order <b><?= order_no($o['id']) ?></b> has been placed.</p>
        <?php if ($pay): ?><p class="pay-note" style="text-align:left;"><b><?= e($pay['label']) ?>:</b> <?= e($pay['note']) ?></p><?php endif; ?>
    </section>

    <section class="panel">
        <h2>Order details</h2>
        <?php foreach ($items as $i): ?>
            <div class="totals-row"><span><?= e($i['name']) ?></span><span><?= peso($i['price']) ?></span></div>
        <?php endforeach; ?>
        <div class="totals-row" style="margin-top:10px;"><span>Subtotal</span><span><?= peso($o['subtotal']) ?></span></div>
        <?php if ($o['discount'] > 0): ?><div class="totals-row discount"><span>Voucher <?= e($o['voucher_code']) ?></span><span>-<?= peso($o['discount']) ?></span></div><?php endif; ?>
        <div class="totals-row"><span>Shipping (<?= e(SHIPPING[$o['shipping_method']]['label'] ?? '') ?>)</span><span><?= $o['shipping_fee'] > 0 ? peso($o['shipping_fee']) : 'Free' ?></span></div>
        <div class="totals-row grand"><span>Total</span><span><?= peso($o['total']) ?></span></div>
    </section>

    <section class="panel">
        <h2>Delivering to</h2>
        <p><?= e($o['full_name']) ?><br><?= e($o['address']) ?>, <?= e($o['city']) ?>, <?= e($o['province']) ?> <?= e($o['zip']) ?><br><?= e($o['phone']) ?> &middot; <?= e($o['email']) ?></p>
    </section>

    <a class="btn btn-solid" href="index.php">Continue shopping</a>
</main>
<script>try { localStorage.removeItem("wishlist"); } catch (e) {}</script>
<?php require 'footer.php'; ?>
