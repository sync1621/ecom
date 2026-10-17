<?php
require 'config.php';
require_login();

function back($msg) {
    $_SESSION['flash'] = $msg;
    header('Location: checkout.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: checkout.php'); exit; }
$u = current_user();

$f = [];
foreach (['full_name', 'email', 'phone', 'address', 'city', 'province', 'zip'] as $k) {
    $f[$k] = trim($_POST[$k] ?? '');
    if ($f[$k] === '') back('Please complete all contact and delivery fields.');
}
if (!filter_var($f['email'], FILTER_VALIDATE_EMAIL)) back('Please enter a valid email address.');
if (!preg_match('/^[0-9+\-\s()]{7,20}$/', $f['phone'])) back('Please enter a valid phone number.');

$shipping_key = (string)($_POST['shipping'] ?? '');
if (!isset(SHIPPING[$shipping_key])) back('Please choose a shipping method.');
$pay = (string)($_POST['payment'] ?? '');
if (!isset(PAYMENTS[$pay])) back('Please choose a payment method.');

$q = build_quote($pdo, $_POST['ids'] ?? [], $shipping_key, $_POST['voucher'] ?? '');
if (!$q['items']) back('Your bag is empty.');

$pdo->beginTransaction();
try {
    $pdo->prepare('INSERT INTO orders (user_id, full_name, email, phone, address, city, province, zip, shipping_method, shipping_fee, payment_method, voucher_code, discount, subtotal, total)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
        ->execute([$u['id'], $f['full_name'], $f['email'], $f['phone'], $f['address'], $f['city'], $f['province'], $f['zip'],
                   $shipping_key, $q['shipping'], $pay, $q['voucher'], $q['discount'], $q['subtotal'], $q['total']]);
    $order_id = (int)$pdo->lastInsertId();

    $ins = $pdo->prepare('INSERT INTO order_items (order_id, product_id, name, price) VALUES (?,?,?,?)');
    foreach ($q['items'] as $p) $ins->execute([$order_id, $p['id'], $p['name'], $p['price']]);
    $pdo->commit();
} catch (Exception $ex) {
    $pdo->rollBack();
    back('Sorry, we could not place your order. Please try again.');
}

header('Location: order_success.php?id=' . $order_id);
exit;
