<?php
require 'config.php';
$error = '';
$email = '';
$next = $_POST['next'] ?? $_GET['next'] ?? 'index.php';
if (!in_array($next, ['index.php', 'account.php', 'checkout.php'], true)) $next = 'index.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim($_POST['email'] ?? ''));
    $st = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $st->execute([$email]);
    $u = $st->fetch();
    if ($u && password_verify($_POST['password'] ?? '', $u['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['uid'] = (int)$u['id'];
        header('Location: ' . $next);
        exit;
    }
    $error = 'Incorrect email or password.';
}

$title = 'Log in';
require 'header.php';
?>
<main class="form-page">
    <h1>Log in</h1>
    <p class="subtitle">Please fill in the blanks below</p>

    <?php if ($error): ?><p class="notice error"><?= e($error) ?></p><?php endif; ?>

    <form method="post" action="login.php">
        <input type="hidden" name="next" value="<?= e($next) ?>">
        <label class="field"><span>Email</span><input type="email" name="email" value="<?= e($email) ?>" required></label>
        <label class="field"><span>Password</span><input type="password" name="password" required></label>
        <button class="btn btn-solid btn-block" type="submit">Log in</button>
    </form>

    <p class="member">Don't have an account? <a href="register.php">Register</a></p>
</main>
<?php require 'footer.php'; ?>
