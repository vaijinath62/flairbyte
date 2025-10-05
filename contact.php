<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['txtName']) ? strip_tags(trim($_POST['txtName'])) : '';
    $email = isset($_POST['txtEmail']) ? filter_var(trim($_POST['txtEmail']), FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST['txtPhone']) ? strip_tags(trim($_POST['txtPhone'])) : '';
    $message = isset($_POST['txtMsg']) ? strip_tags(trim($_POST['txtMsg'])) : '';

    $to = 'info@flairbyte.in'; // Change to your receiving email
    $subject = 'New Contact Form Submission from FlairByte Website';
    $body = "Name: $name\nEmail: $email\nPhone: $phone\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        header('Location: index.html?mailsent=1');
        exit();
    } else {
        header('Location: index.html?mailsent=0');
        exit();
    }
} else {
    // If accessed directly, show a simple message
    echo '<!DOCTYPE html><html><head><title>Contact Form</title></head><body><h2>This page is for processing contact form submissions.</h2></body></html>';
}