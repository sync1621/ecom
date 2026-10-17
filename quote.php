<?php
require 'config.php';
header('Content-Type: application/json');
$in = json_decode(file_get_contents('php://input'), true) ?: [];
$q = build_quote($pdo, $in['ids'] ?? [], $in['shipping'] ?? 'standard', $in['voucher'] ?? '');
unset($q['items']);
echo json_encode($q);
