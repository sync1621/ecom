<?php
require 'config.php';
require_login();
$u = current_user();
$error = '';
$fields = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'province', 'zip'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $d = [];
    foreach ($fields as $k) $d[$k] = trim($_POST[$k] ?? '');
    $d['email'] = strtolower($d['email']);

    if ($d['first_name'] === '' || $d['last_name'] === '') {
        $error = 'Please enter your first and last name.';
    } elseif (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } elseif ($d['phone'] !== '' && !preg_match('/^[0-9+\-\s()]{7,20}$/', $d['phone'])) {
        $error = 'Please enter a valid phone number.';
    } else {
        $st = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id <> ?');
        $st->execute([$d['email'], $u['id']]);
        if ($st->fetch()) {
            $error = 'That email is used by another account.';
        } else {
            $pdo->prepare('UPDATE users SET first_name=?, last_name=?, email=?, phone=?, address=?, city=?, province=?, zip=? WHERE id=?')
                ->execute(array_merge(array_values($d), [$u['id']]));
            header('Location: account.php?saved=1');
            exit;
        }
    }
}

function val($k, $u) { return e($_POST[$k] ?? $u[$k] ?? ''); }

$st = $pdo->prepare('SELECT id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 5');
$st->execute([$u['id']]);
$orders = $st->fetchAll();

$title = 'My account';
require 'header.php';
?>
<main class="form-page wide">
    <h1>My account</h1>
    <p class="subtitle"><?= isset($_GET['welcome']) ? 'Welcome! Add your delivery details so checkout is quick.' : 'Your details are used to fill in checkout for you.' ?></p>

    <?php if (isset($_GET['saved'])): ?><p class="notice ok">Your information was saved.</p><?php endif; ?>
    <?php if ($error): ?><p class="notice error"><?= e($error) ?></p><?php endif; ?>

    <form method="post" action="account.php">
        <section class="panel">
            <h2>Personal details</h2>
            <div class="row2">
                <label class="field"><span>First name</span><input type="text" name="first_name" value="<?= val('first_name', $u) ?>" required></label>
                <label class="field"><span>Last name</span><input type="text" name="last_name" value="<?= val('last_name', $u) ?>" required></label>
            </div>
            <div class="row2">
                <label class="field"><span>Email</span><input type="email" name="email" value="<?= val('email', $u) ?>" required></label>
                <label class="field"><span>Mobile number</span><input type="text" name="phone" value="<?= val('phone', $u) ?>" placeholder="0917 123 4567"></label>
            </div>
        </section>

        <section class="panel">
            <h2>Delivery address</h2>
            <label class="field"><span>Street, building, barangay</span><input type="text" name="address" value="<?= val('address', $u) ?>"></label>
            <div class="row2">
                <label class="field"><span>City</span><input type="text" name="city" value="<?= val('city', $u) ?>"></label>
                <label class="field"><span>Province</span><input type="text" name="province" value="<?= val('province', $u) ?>"></label>
            </div>
            <label class="field"><span>ZIP code</span><input type="text" name="zip" value="<?= val('zip', $u) ?>"></label>
        </section>

        <button class="btn btn-solid btn-block" type="submit">Save information</button>
    </form>

    <section class="panel" style="margin-top:28px;">
        <h2>Recent orders</h2>
        <?php if ($orders): ?>
            <table class="orders">
                <tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th></tr>
                <?php foreach ($orders as $o): ?>
                    <tr><td><?= order_no($o['id']) ?></td><td><?= e(date('M j, Y', strtotime($o['created_at']))) ?></td><td><?= peso($o['total']) ?></td><td><?= e($o['status']) ?></td></tr>
                <?php endforeach; ?>
            </table>
        <?php else: ?>
            <p class="hint">No orders yet. <a href="index.php#products">Start shopping</a></p>
        <?php endif; ?>
    </section>

    <a class="logout" href="logout.php">Log out</a>
</main>
<?php require 'footer.php'; ?>
