<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>PHP Error Check</h2>";

// Check PHP version
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";

// Check if session works
session_start();
echo "<p><strong>Session ID:</strong> " . session_id() . "</p>";

// Check if config file exists and is readable
if (file_exists('config.php')) {
    echo "<p><strong>Config file:</strong> ✅ Exists</p>";
    if (is_readable('config.php')) {
        echo "<p><strong>Config file:</strong> ✅ Readable</p>";
    } else {
        echo "<p><strong>Config file:</strong> ❌ Not readable</p>";
    }
} else {
    echo "<p><strong>Config file:</strong> ❌ Not found</p>";
}

// Check if database connection works
try {
    include_once 'config.php';
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        echo "<p><strong>Database:</strong> ❌ Connection failed: " . $conn->connect_error . "</p>";
    } else {
        echo "<p><strong>Database:</strong> ✅ Connected successfully</p>";
        $conn->close();
    }
} catch (Exception $e) {
    echo "<p><strong>Database:</strong> ❌ Error: " . $e->getMessage() . "</p>";
}

// Check if required files exist
$required_files = [
    'manifest.json',
    'sw.js',
    'logo.svg',
    'login.html',
    'index.php',
    'problems.php',
    'styles.css',
    'script.js',
    'login.js',
    'problems.js'
];

echo "<h3>File Existence Check:</h3>";
foreach ($required_files as $file) {
    if (file_exists($file)) {
        echo "<p><strong>$file:</strong> ✅ Exists</p>";
    } else {
        echo "<p><strong>$file:</strong> ❌ Missing</p>";
    }
}

// Check current directory
echo "<p><strong>Current Directory:</strong> " . getcwd() . "</p>";

// Check if we can access the main index file
echo "<h3>Testing index.php:</h3>";
if (file_exists('index.php')) {
    // Try to include it to see if there are any errors
    ob_start();
    try {
        include 'index.php';
        $output = ob_get_clean();
        echo "<p><strong>index.php:</strong> ✅ Loaded successfully</p>";
        echo "<p><strong>Output length:</strong> " . strlen($output) . " characters</p>";
    } catch (Exception $e) {
        $output = ob_get_clean();
        echo "<p><strong>index.php:</strong> ❌ Error: " . $e->getMessage() . "</p>";
    }
} else {
    echo "<p><strong>index.php:</strong> ❌ File not found</p>";
}

echo "<h3>Server Information:</h3>";
echo "<p><strong>Server Software:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p><strong>Request URI:</strong> " . $_SERVER['REQUEST_URI'] . "</p>";
?> 