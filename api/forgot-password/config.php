<?php
/**
 * PHPMailer Configuration for EduCore PH
 * 
 * IMPORTANT: Update these settings with your actual Gmail credentials.
 * You need to use an App Password (not your regular Gmail password).
 * 
 * How to get an App Password:
 * 1. Go to https://myaccount.google.com/security
 * 2. Enable 2-Step Verification
 * 3. Go to App Passwords
 * 4. Generate a new app password for "Mail"
 * 5. Use that 16-character password below
 */

// SMTP Configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'lyshandavet@gmail.com');      // <-- PALITAN MO ITO ng Gmail mo
define('SMTP_PASSWORD', 'ddcrvdsjqsqjofyl');           // <-- PALITAN MO ITO ng App Password mo
define('SMTP_FROM_EMAIL', 'lyshandavet@gmail.com');     // <-- PALITAN MO ITO ng Gmail mo
define('SMTP_FROM_NAME', 'EduCore PH');

// Database Configuration (for storing reset codes)
// Using file-based storage for simplicity - replace with database in production
define('CODES_STORAGE_DIR', __DIR__ . '/storage');

// Code Settings
define('CODE_LENGTH', 6);
define('CODE_EXPIRY_MINUTES', 10);

// Create storage directory if not exists
if (!file_exists(CODES_STORAGE_DIR)) {
    mkdir(CODES_STORAGE_DIR, 0755, true);
}

/**
 * Generate a random numeric code
 */
function generateCode(int $length = CODE_LENGTH): string {
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= random_int(0, 9);
    }
    return $code;
}

/**
 * Store verification code
 */
function storeCode(string $email, string $code): void {
    $data = [
        'email' => $email,
        'code' => $code,
        'created_at' => time(),
        'expires_at' => time() + (CODE_EXPIRY_MINUTES * 60),
        'verified' => false,
    ];
    
    $filename = CODES_STORAGE_DIR . '/' . md5($email) . '.json';
    file_put_contents($filename, json_encode($data));
}

/**
 * Verify code for an email
 */
function verifyCode(string $email, string $code): array {
    $filename = CODES_STORAGE_DIR . '/' . md5($email) . '.json';
    
    if (!file_exists($filename)) {
        return ['valid' => false, 'message' => 'No verification code found. Please request a new one.'];
    }
    
    $data = json_decode(file_get_contents($filename), true);
    
    if (time() > $data['expires_at']) {
        unlink($filename);
        return ['valid' => false, 'message' => 'Verification code has expired. Please request a new one.'];
    }
    
    if ($data['code'] !== $code) {
        return ['valid' => false, 'message' => 'Invalid verification code. Please try again.'];
    }
    
    // Mark as verified and generate reset token
    $token = bin2hex(random_bytes(32));
    $data['verified'] = true;
    $data['reset_token'] = $token;
    $data['token_expires_at'] = time() + (15 * 60); // 15 minutes to reset password
    file_put_contents($filename, json_encode($data));
    
    return ['valid' => true, 'token' => $token];
}

/**
 * Verify reset token
 */
function verifyResetToken(string $email, string $token): bool {
    $filename = CODES_STORAGE_DIR . '/' . md5($email) . '.json';
    
    if (!file_exists($filename)) {
        return false;
    }
    
    $data = json_decode(file_get_contents($filename), true);
    
    if (!$data['verified'] || $data['reset_token'] !== $token) {
        return false;
    }
    
    if (time() > $data['token_expires_at']) {
        unlink($filename);
        return false;
    }
    
    return true;
}

/**
 * Clean up used code
 */
function cleanupCode(string $email): void {
    $filename = CODES_STORAGE_DIR . '/' . md5($email) . '.json';
    if (file_exists($filename)) {
        unlink($filename);
    }
}

/**
 * Send JSON response
 */
function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($data);
    exit;
}

/**
 * Handle CORS preflight
 */
function handleCors(): void {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        http_response_code(200);
        exit;
    }
}
