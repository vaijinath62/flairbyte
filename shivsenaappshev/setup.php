<?php
// Shiv Sena Problems App Setup Script
// Run this file in your browser to set up the database

require_once 'config.php';

// Check if database exists and create if needed
function setupDatabase() {
    try {
        // Connect without database name first
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        
        // Create database if it doesn't exist
        $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        echo "<div class='success'>✅ Database created successfully!</div>";
        
        // Connect to the specific database
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        
        // Read and execute SQL file
        $sql = file_get_contents('database.sql');
        
        // Handle DELIMITER statements properly
        $statements = [];
        $currentStatement = '';
        $delimiter = ';';
        
        $lines = explode("\n", $sql);
        foreach ($lines as $line) {
            $line = trim($line);
            
            // Check for DELIMITER statement
            if (preg_match('/^DELIMITER\s+(.+)$/i', $line, $matches)) {
                if (!empty($currentStatement)) {
                    $statements[] = trim($currentStatement);
                }
                $delimiter = $matches[1];
                $currentStatement = '';
                continue;
            }
            
            // Skip empty lines and comments
            if (empty($line) || strpos($line, '--') === 0) {
                continue;
            }
            
            $currentStatement .= $line . "\n";
            
            // Check if statement ends with current delimiter
            if (substr(trim($currentStatement), -strlen($delimiter)) === $delimiter) {
                $statements[] = trim(substr($currentStatement, 0, -strlen($delimiter)));
                $currentStatement = '';
            }
        }
        
        // Add any remaining statement
        if (!empty($currentStatement)) {
            $statements[] = trim($currentStatement);
        }
        
        foreach ($statements as $statement) {
            if (!empty($statement)) {
                $pdo->exec($statement);
            }
        }
        
        echo "<div class='success'>✅ Tables created successfully!</div>";
        
        // Create uploads directory
        $uploadDir = 'uploads/problems/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
            echo "<div class='success'>✅ Uploads directory created!</div>";
        }
        
        return true;
        
    } catch (PDOException $e) {
        echo "<div class='error'>❌ Database Error: " . $e->getMessage() . "</div>";
        return false;
    }
}

// Test API endpoints
function testAPI() {
    $testData = [
        'name' => 'Test User',
        'phone' => '9876543210',
        'address' => 'Test Address, Shevgaon',
        'problem_type' => 'road',
        'description' => 'Test problem description'
    ];
    
    // Test registration API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/api/register_problem.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo "<div class='success'>✅ API registration endpoint working!</div>";
    } else {
        echo "<div class='warning'>⚠️ API registration endpoint returned HTTP $httpCode</div>";
    }
    
    // Test get problems API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/api/get_problems.php');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo "<div class='success'>✅ API get problems endpoint working!</div>";
    } else {
        echo "<div class='warning'>⚠️ API get problems endpoint returned HTTP $httpCode</div>";
    }
}

// Check system requirements
function checkRequirements() {
    $requirements = [
        'PHP Version (>= 7.4)' => version_compare(PHP_VERSION, '7.4.0', '>='),
        'PDO Extension' => extension_loaded('pdo'),
        'PDO MySQL Extension' => extension_loaded('pdo_mysql'),
        'JSON Extension' => extension_loaded('json'),
        'File Upload Support' => ini_get('file_uploads'),
        'Write Permissions' => is_writable('.')
    ];
    
    echo "<h3>System Requirements Check:</h3>";
    foreach ($requirements as $requirement => $met) {
        if ($met) {
            echo "<div class='success'>✅ $requirement</div>";
        } else {
            echo "<div class='error'>❌ $requirement</div>";
        }
    }
}

// Main setup process
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "<div class='setup-container'>";
    echo "<h2>🛠️ Shiv Sena Problems App Setup</h2>";
    
    checkRequirements();
    
    if (setupDatabase()) {
        echo "<h3>API Testing:</h3>";
        testAPI();
        
        echo "<div class='success'>🎉 Setup completed successfully!</div>";
        echo "<p>Your Shiv Sena Problems App is now ready to use.</p>";
        echo "<p><a href='index.html' class='btn'>Go to App</a></p>";
    } else {
        echo "<div class='error'>❌ Setup failed. Please check the errors above.</div>";
    }
    
    echo "</div>";
} else {
    // Show setup form
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shiv Sena Problems App - Setup</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #ff8c00, #ff6b35);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .setup-container {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 40px;
                max-width: 600px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(255, 140, 0, 0.3);
                text-align: center;
            }
            h1 {
                color: #1a1a1a;
                margin-bottom: 30px;
            }
            .btn {
                background: linear-gradient(135deg, #ff8c00, #ff6b35);
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                transition: all 0.3s ease;
                box-shadow: 0 8px 25px rgba(255, 140, 0, 0.3);
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 35px rgba(255, 140, 0, 0.4);
            }
            .success {
                background: rgba(40, 167, 69, 0.1);
                color: #155724;
                padding: 10px 15px;
                border-radius: 8px;
                margin: 10px 0;
                border-left: 4px solid #28a745;
            }
            .error {
                background: rgba(220, 53, 69, 0.1);
                color: #721c24;
                padding: 10px 15px;
                border-radius: 8px;
                margin: 10px 0;
                border-left: 4px solid #dc3545;
            }
            .warning {
                background: rgba(255, 193, 7, 0.1);
                color: #856404;
                padding: 10px 15px;
                border-radius: 8px;
                margin: 10px 0;
                border-left: 4px solid #ffc107;
            }
        </style>
    </head>
    <body>
        <div class="setup-container">
            <h1>🛠️ Shiv Sena Problems App Setup</h1>
            <p>This will set up the database and test the API endpoints.</p>
            <form method="POST">
                <button type="submit" class="btn">Start Setup</button>
            </form>
        </div>
    </body>
    </html>
    <?php
}
?> 