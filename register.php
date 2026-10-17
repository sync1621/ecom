<?php
require 'config.php';
$error = '';
$f = ['first' => '', 'last' => '', 'email' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $f['first'] = trim($_POST['first_name'] ?? '');
    $f['last']  = trim($_POST['last_name'] ?? '');
    $f['email'] = strtolower(trim($_POST['email'] ?? ''));
    $pass = $_POST['password'] ?? '';

    if ($f['first'] === '' || $f['last'] === '') {
        $error = 'Please enter your first and last name.';
    } elseif (!filter_var($f['email'], FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } elseif (strlen($pass) < 6) {
        $error = 'Password must be at least 6 characters.';
    } else {
        $st = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $st->execute([$f['email']]);
        if ($st->fetch()) {
            $error = 'That email is already registered. Try logging in.';
        } else {
            $pdo->prepare('INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)')
                ->execute([$f['first'], $f['last'], $f['email'], password_hash($pass, PASSWORD_DEFAULT)]);
            session_regenerate_id(true);
            $_SESSION['uid'] = (int)$pdo->lastInsertId();
            header('Location: account.php?welcome=1');
            exit;
        }
    }
}

$title = 'Register';
require 'header.php';
?>
<main class="form-page">
    <h1>Register</h1>
    <p class="subtitle">Please fill in the blanks below</p>

    <?php if ($error): ?><p class="notice error"><?= e($error) ?></p><?php endif; ?>

    <form method="post" action="register.php">
        <label class="field"><span>First name</span><input type="text" name="first_name" value="<?= e($f['first']) ?>" required></label>
        <label class="field"><span>Last name</span><input type="text" name="last_name" value="<?= e($f['last']) ?>" required></label>
        <label class="field"><span>Email</span><input type="email" name="email" value="<?= e($f['email']) ?>" required></label>
        <label class="field"><span>Password (6+ characters)</span><input type="password" name="password" required></label>
        <button class="btn btn-solid btn-block" type="submit">Create account</button>
    </form>

    <p class="member">Already a member? <a href="login.php">Log in</a></p>
</main>
<?php require 'footer.php'; ?>
