<?php
require 'config.php';
$home  = true;
$title = 'New Season';
require 'header.php';
?>

<main>
    <section class="hero">
        <img src="background.jpg" alt="" onerror="this.remove()">
        <div class="hero-text">
            <p>New Season</p>
            <h1>Made to be noticed</h1>
            <a href="#products" class="btn btn-light">Shop now</a>
        </div>
    </section>


    <section class="products" id="products">
        <div class="section-head">
            <h2>Products</h2>
            <div class="filters" id="filters">
                <button class="chip active" data-cat="all">All</button>
                <button class="chip" data-cat="women">Women</button>
                <button class="chip" data-cat="men">Men</button>
                <button class="chip" data-cat="kids">Kids</button>
            </div>
        </div>
        <p class="result-note" id="result-note" hidden></p>
        <div class="grid" id="grid"></div>
    </section>

    <section class="newsletter">
        <h2>Join the list</h2>
        <p>Get first access to new drops and offers.</p>
        <form id="news-form">
            <input type="email" id="news-email" placeholder="Enter your email" required aria-label="Email">
            <button class="btn btn-solid" type="submit">Subscribe</button>
        </form>
        <p class="news-msg" id="news-msg"></p>
    </section>
</main>

<footer class="footer">
    <div class="footer-grid">
        <div><h4>Shop</h4><a href="#products" data-cat="women">Women</a><a href="#products" data-cat="men">Men</a><a href="#products" data-cat="kids">Kids</a></div>
        <div><h4>Help</h4><a href="#">Shipping</a><a href="#">Returns</a><a href="#">Contact</a></div>
        <div><h4>Company</h4><a href="#">About</a><a href="#">Careers</a><a href="#">Stores</a></div>
    </div>
    <p class="copy">&copy; 2026 Glamourify. All rights reserved.</p>
</footer>

<div class="modal-overlay" id="wishlist-modal" aria-hidden="true">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="wishlist-title">
        <div class="modal-header">
            <h3 id="wishlist-title">My Wishlist <span id="wishlist-count"></span></h3>
            <button class="modal-close" id="wishlist-close" aria-label="Close wishlist"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body" id="wishlist-list"></div>
        <div class="modal-total" id="wishlist-totalrow"><span>Total</span><strong id="wishlist-total"></strong></div>
        <div class="modal-footer">
            <a class="btn btn-solid" href="checkout.php" id="wishlist-continue">Check out</a>
            <button class="btn btn-outline" id="wishlist-clear">Clear all</button>
        </div>
    </div>
</div>

<div class="toast" id="toast" role="status"></div>

<script src="products.php"></script>
<script src="index.js"></script>
</body>
</html>
