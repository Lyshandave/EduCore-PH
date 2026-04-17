<?php
/**
 * Verify Code
 * 
 * POST /api/forgot-password/verify-code.php
 * Body: { "email": "user@gmail.com", "code": "123456" }
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
$code = trim($input['code'] ?? '');

// Validate
if (empty($email) || empty($code)) {
    jsonResponse(['success' => false, 'message' => 'Email and code are required.'], 400);
}

if (strlen($code) !== CODE_LENGTH) {
    jsonResponse(['success' => false, 'message' => 'Code must be ' . CODE_LENGTH . ' digits.'], 400);
}

// Verify the code
$result = verifyCode($email, $code);

if ($result['valid']) {
    jsonResponse([
        'success' => true,
        'message' => 'Code verified successfully.',
        'token' => $result['token'],
    ]);
} else {
    jsonResponse([
        'success' => false,
        'message' => $result['message'],
    ], 400);
}
