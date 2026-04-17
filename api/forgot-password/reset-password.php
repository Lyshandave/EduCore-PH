<?php
/**
 * Reset Password
 * 
 * POST /api/forgot-password/reset-password.php
 * Body: { "email": "user@gmail.com", "token": "...", "newPassword": "..." }
 */

require_once __DIR__ . '/config.php';

handleCors();

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Get request body
$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$token = trim($input['token'] ?? '');
$newPassword = $input['newPassword'] ?? '';

// Validate
if (empty($email) || empty($token) || empty($newPassword)) {
    jsonResponse(['success' => false, 'message' => 'All fields are required.'], 400);
}

if (strlen($newPassword) < 8) {
    jsonResponse(['success' => false, 'message' => 'Password must be at least 8 characters.'], 400);
}

// Verify token
if (!verifyResetToken($email, $token)) {
    jsonResponse([
        'success' => false,
        'message' => 'Invalid or expired reset token. Please start over.',
    ], 400);
}

// TODO: Here you would update the password in your database
// Example with PDO:
// $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
// $stmt = $pdo->prepare('UPDATE users SET password = ? WHERE email = ?');
// $stmt->execute([$hashedPassword, $email]);

// For now, we'll just log it and return success
// In production, replace this with actual database update
$hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

// Log the password change (for demonstration)
error_log("Password reset for: $email (hash: $hashedPassword)");

// Clean up the verification code
cleanupCode($email);

jsonResponse([
    'success' => true,
    'message' => 'Password has been reset successfully.',
]);
