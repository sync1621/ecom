<?php
session_start();

try {
    $pdo = new PDO('mysql:host=localhost;dbname=glamourify;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $ex) {
    die('Cannot connect to the database. In XAMPP start MySQL, then import database.sql in phpMyAdmin.');
}

const FREE_SHIPPING_MIN = 5000;

const SHIPPING = [
    'standard' => ['label' => 'Standard (3-5 days)', 'fee' => 100],
    'express'  => ['label' => 'Express (1-2 days)',  'fee' => 250],
];


const PAYMENTS = [
    'cod'   => ['label' => 'Cash on Delivery',     'note' => 'Pay in cash when your order arrives.'],
    'gcash' => ['label' => 'GCash',                'note' => 'After placing your order, send the total to GCash 0917 000 0000 (Glamourify) and use your order number as the reference.'],
    'card'  => ['label' => 'Credit / Debit Card',  'note' => 'A secure payment link will be sent to your email after you place your order.'],
    'bank'  => ['label' => 'Bank Transfer',        'note' => 'Transfer the total to BDO 0000 0000 0000 (Glamourify) and use your order number as the reference.'],
];

function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function peso($n) { return '₱' . number_format((float)$n, 2); }
function order_no($id) { return 'GL-' . str_pad((string)$id, 5, '0', STR_PAD_LEFT); }

function current_user() {
    global $pdo;
    static $user = false;
    if ($user === false) {
        $user = null;
        if (!empty($_SESSION['uid'])) {
            $st = $pdo->prepare('SELECT * FROM users WHERE id = ?');
            $st->execute([$_SESSION['uid']]);
            $user = $st->fetch() ?: null;
        }
    }
    return $user;
}

function require_login() {
    if (!current_user()) {
        header('Location: login.php?next=' . urlencode(basename($_SERVER['PHP_SELF'])));
        exit;
    }
}

function load_products() {
    $list = json_decode(file_get_contents(__DIR__ . '/products.json'), true) ?: [];
    $map = [];
    foreach ($list as $p) $map[$p['id']] = $p;
    return $map;
}


function build_quote($pdo, $ids, $shipping_key, $code) {
    $products = load_products();
    $items = [];
    $subtotal = 0;
    foreach (array_unique(array_map('intval', array_filter((array)$ids, 'is_scalar'))) as $id) {
        if (isset($products[$id])) { $items[] = $products[$id]; $subtotal += $products[$id]['price']; }
    }

    $ship = SHIPPING[(string)$shipping_key] ?? SHIPPING['standard'];
    $shipping = ($subtotal > 0 && $subtotal < FREE_SHIPPING_MIN) ? $ship['fee'] : 0;

    $discount = 0; $ok = false; $msg = ''; $applied = '';
    $code = strtoupper(trim((string)$code));
    if ($code !== '') {
        $st = $pdo->prepare('SELECT * FROM vouchers WHERE code = ? AND active = 1');
        $st->execute([$code]);
        $v = $st->fetch();
        if (!$v) {
            $msg = 'That voucher code is not valid.';
        } elseif ($subtotal < $v['min_spend']) {
            $msg = 'Spend at least ' . peso($v['min_spend']) . ' to use ' . $code . '.';
        } else {
            $ok = true; $applied = $code; $msg = $code . ' applied.';
            if ($v['type'] === 'percent')    $discount = round($subtotal * $v['value'] / 100, 2);
            elseif ($v['type'] === 'fixed')  $discount = min($subtotal, (float)$v['value']);
            else                             $shipping = 0;
        }
    }
    return [
        'items' => $items, 'subtotal' => $subtotal, 'discount' => $discount, 'shipping' => $shipping,
        'total' => $subtotal - $discount + $shipping,
        'voucher_ok' => $ok, 'voucher_msg' => $msg, 'voucher' => $applied,
    ];
}
