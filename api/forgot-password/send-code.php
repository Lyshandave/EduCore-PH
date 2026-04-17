<?php
/**
 * Send Verification Code via PHPMailer
 * 
 * POST /api/forgot-password/send-code.php
 * Body: { "email": "user@gmail.com" }
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

handleCors();

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Get request body
$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');

// Validate email
if (empty($email)) {
    jsonResponse(['success' => false, 'message' => 'Email is required.'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Please enter a valid email address.'], 400);
}

// Generate 6-digit code
$code = generateCode();

// Store code
storeCode($email, $code);

// Send email via PHPMailer
$mail = new PHPMailer(true);

try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USERNAME;
    $mail->Password   = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;

    // Recipients
    $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
    $mail->addAddress($email);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'EduCore PH - Password Reset Verification Code';
    
    // Beautiful HTML email template
    $mail->Body = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4ff;">
        <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
                    <span style="font-size: 32px; color: white;">🎓</span>
                </div>
                <h1 style="margin: 0; font-size: 24px; color: #1e293b; font-weight: 800;">EduCore PH</h1>
                <p style="margin: 4px 0 0; color: #64748b; font-size: 14px;">Enterprise School System</p>
            </div>
            
            <!-- Card -->
            <div style="background: white; border-radius: 16px; padding: 40px 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                <h2 style="margin: 0 0 8px; font-size: 20px; color: #1e293b; text-align: center;">Password Reset</h2>
                <p style="margin: 0 0 24px; color: #64748b; text-align: center; font-size: 14px; line-height: 1.5;">
                    Use the verification code below to reset your password. This code will expire in <strong>' . CODE_EXPIRY_MINUTES . ' minutes</strong>.
                </p>
                
                <!-- Code Display -->
                <div style="background: linear-gradient(135deg, #eff6ff, #eef2ff); border: 2px dashed #93c5fd; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                    <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 600;">Your Verification Code</p>
                    <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #2563eb; font-family: \'Courier New\', monospace;">' . $code . '</div>
                </div>
                
                <p style="margin: 0 0 16px; color: #94a3b8; font-size: 13px; text-align: center; line-height: 1.5;">
                    If you didn\'t request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                
                <p style="margin: 0; color: #cbd5e1; font-size: 11px; text-align: center;">
                    This is an automated message from EduCore PH. Please do not reply to this email.
                </p>
            </div>
            
            <!-- Footer -->
            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
                &copy; 2024 EduCore PH. All rights reserved.
            </p>
        </div>
    </body>
    </html>';

    // Plain text alternative
    $mail->AltBody = "EduCore PH - Password Reset\n\nYour verification code is: $code\n\nThis code will expire in " . CODE_EXPIRY_MINUTES . " minutes.\n\nIf you didn't request this, please ignore this email.";

    $mail->send();
    
    jsonResponse([
        'success' => true,
        'message' => 'Verification code sent successfully.',
    ]);

} catch (Exception $e) {
    // Log the error for debugging
    error_log("PHPMailer Error: " . $mail->ErrorInfo);
    
    jsonResponse([
        'success' => false,
        'message' => 'Failed to send verification email. Please try again later.',
        'debug' => $mail->ErrorInfo, // Remove this line in production
    ], 500);
}
