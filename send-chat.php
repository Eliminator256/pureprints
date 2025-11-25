<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set header for JSON response
header('Content-Type: application/json');

// Your email address
$businessEmail = 'info@pureprintsmedia.com';

// Get the JSON data from request
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate required fields
if (!isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Sanitize input
$name = htmlspecialchars($data['name']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = isset($data['phone']) ? htmlspecialchars($data['phone']) : 'Not provided';
$message = htmlspecialchars($data['message']);
$timestamp = isset($data['timestamp']) ? htmlspecialchars($data['timestamp']) : date('Y-m-d H:i:s');

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

// Prepare email content
$subject = "New Chat Message from " . $name;

$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e63946, #e10098); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #e63946; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #e63946; margin-top: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2 style='margin: 0;'>New Message from Pure Prints Chat</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Name:</span> {$name}
            </div>
            <div class='field'>
                <span class='label'>Email:</span> <a href='mailto:{$email}'>{$email}</a>
            </div>
            <div class='field'>
                <span class='label'>Phone:</span> {$phone}
            </div>
            <div class='field'>
                <span class='label'>Time:</span> {$timestamp}
            </div>
            <div class='message-box'>
                <span class='label'>Message:</span>
                <p>{$message}</p>
            </div>
            <hr>
            <p style='font-size: 12px; color: #999;'>
                This message was sent from the Pure Prints Media website chat.
            </p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

// Send email
$mailSent = mail($businessEmail, $subject, $emailBody, $headers);

if ($mailSent) {
    // Also send confirmation email to user
    $userSubject = "We received your message - Pure Prints Media";
    $userBody = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e63946, #e10098); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2 style='margin: 0;'>Thank You for Contacting Us!</h2>
            </div>
            <div class='content'>
                <p>Hi {$name},</p>
                <p>We've received your message and appreciate you reaching out to Pure Prints Media.</p>
                <p>We'll review your message and get back to you as soon as possible.</p>
                <hr>
                <p style='font-size: 12px; color: #999;'>
                    <strong>Your Message:</strong><br>
                    {$message}
                </p>
                <hr>
                <p>Best regards,<br><strong>Pure Prints Media Team</strong></p>
                <p style='font-size: 12px; color: #999;'>
                    📧 info@pureprintsmedia.com<br>
                    📱 +254 705 853517 | +254 787 493508<br>
                    📍 Nairobi, Kenya
                </p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $userHeaders = "MIME-Version: 1.0" . "\r\n";
    $userHeaders .= "Content-type: text/html; charset=UTF-8" . "\r\n";
    $userHeaders .= "From: " . $businessEmail . "\r\n";
    
    mail($email, $userSubject, $userBody, $userHeaders);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send message. Please try again.']);
}
?>
