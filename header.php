<?php
$user  = current_user();
$title = $title ?? 'Glamourify';
$home  = $home ?? false;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($title) ?> | Glamourify</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;600&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="index.css">
</head>
<body>

<header class="site-header<?= $home ? '' : ' scrolled' ?>" id="header">
    <div class="left">
        <button class="menu-btn" id="menu-btn" aria-label="Menu" aria-expanded="false"><i class="bi bi-list"></i></button>
        <nav class="main-nav" id="main-nav">
            <a href="index.php?cat=women#products" data-cat="women">Women</a>
            <a href="index.php?cat=men#products" data-cat="men">Men</a>
            <a href="index.php?cat=kids#products" data-cat="kids">Kids</a>
            <span class="nav-account">
                <?php if ($user): ?>
                    <a href="account.php">My account</a>
                    <a href="logout.php">Log out</a>
                <?php else: ?>
                    <a href="login.php">Log in</a>
                    <a href="register.php">Register</a>
                <?php endif; ?>
            </span>
        </nav>
    </div>

    <a href="index.php" class="logo">Glamourify</a>
    <div class="header-actions">
        <a href="#" id="search-btn" aria-label="Search"><i class="bi bi-search"></i></a>
        <a href="<?= $user ? 'account.php' : 'login.php' ?>" aria-label="Account"><i class="bi bi-person"></i></a>
        <a href="<?= $home ? '#' : 'checkout.php' ?>" id="wishlist-btn" class="wishlist-link" aria-label="Wishlist">
            <i class="bi bi-heart"></i><span class="badge hidden" id="wishlist-badge">0</span>
        </a>
        <a href="checkout.php" aria-label="Cart"><i class="bi bi-bag"></i></a>
    </div>
</header>

<div class="search-panel" id="search-panel" aria-hidden="true">
    <form class="search-form" id="search-form" role="search">
        <i class="bi bi-search"></i>
        <input type="search" id="search-input" placeholder="What are you looking for?" autocomplete="off" aria-label="Search products">
        <button type="button" class="modal-close" id="search-close" aria-label="Close search"><i class="bi bi-x-lg"></i></button>
    </form>
    <div class="search-results" id="search-results"></div>
</div>

