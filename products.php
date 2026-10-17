<?php
header('Content-Type: application/javascript; charset=utf-8');
echo 'const products = ' . file_get_contents(__DIR__ . '/products.json') . ';';
