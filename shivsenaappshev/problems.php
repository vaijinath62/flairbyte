<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_mobile'])) {
    // Redirect to login.html if not logged in
    header('Location: login.html');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>नोंदवलेल्या समस्या - शिवसेना - शेवगाव तालुका</title>
    

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="styles.css" rel="stylesheet">
    <style>
        .problems-page {
            min-height: 100vh;
        }
        
        .problems-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 10px;
            margin: 10px;
            box-shadow: 0 20px 60px rgba(255, 140, 0, 0.3);
            border: 1px solid rgba(255, 140, 0, 0.3);
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .back-btn-header {
            background: linear-gradient(135deg, #ff8c00, #ff6b35);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            box-shadow: 0 8px 25px rgba(255, 140, 0, 0.3);
            transition: all 0.3s ease;
        }
        
        .back-btn-header:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(255, 140, 0, 0.4);
        }
        

        
        .problem-card {
            background: white;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border-left: 4px solid #ff8c00;
        }
        
        .problem-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .problem-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 10px;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        
        .problem-header:hover {
            background: rgba(255, 140, 0, 0.1);
        }
        
        .problem-header-left {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        .problem-header-right {
            display: flex;
            align-items: center;
        }
        
        .problem-toggle-icon {
            font-size: 18px;
            color: #ff8c00;
            transition: all 0.3s ease;
        }
        
        .problem-content {
            display: none;
            animation: slideDown 0.3s ease;
        }
        
        .problem-card.expanded .problem-content {
            display: block;
        }
        
        /* Chat Styles */
        .chat-container {
            max-height: 400px;
            overflow-y: auto;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            margin-bottom: 15px;
        }
        
        .chat-message {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
        }
        
        .chat-message.user {
            justify-content: flex-end;
        }
        
        .chat-message.admin {
            justify-content: flex-start;
        }
        
        .message-bubble {
            max-width: 90%;
            padding: 5px 10px;
            border-radius: 5px;
            position: relative;
            word-wrap: break-word;
        }
        
        .message-bubble.user {
            background: #ff8c00;
            color: white;
            border-bottom-right-radius: 4px;
        }
        
        .message-bubble.admin {
            background: #e9ecef;
            color: #333;
            border-bottom-left-radius: 4px;
        }
        
        .message-sender {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 4px;
            opacity: 0.8;
        }
        
        .message-time {
            font-size: 11px;
            opacity: 0.7;
            margin-top: 4px;
        }
        
        .chat-input-container {
            display: flex;
            gap: 10px;
            align-items: center;
            padding: 15px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .chat-input {
            flex: 1;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .chat-input:focus {
            border-color: #ff8c00;
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
        }
        
        .send-btn {
            background: linear-gradient(135deg, #ff8c00, #ff6b35);
            color: white;
            border: none;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .send-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
        }
        
        .send-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        /* Disabled chat input styles for resolved problems */
        .chat-input-container.disabled {
            opacity: 0.6;
            pointer-events: none;
        }
        
        .chat-input:disabled {
            background-color: #f5f5f5;
            color: #999;
            cursor: not-allowed;
        }
        
        /* Media Display Styles */
        .message-media {
            margin-top: 8px;
            border-radius: 8px;
            overflow: hidden;
            max-width: 250px;
        }
        
        .message-media img {
            width: 100%;
            height: auto;
            border-radius: 8px;
        }
        
        .message-media video {
            width: 100%;
            height: auto;
            border-radius: 8px;
        }
        
        .send-btn:disabled {
            background: #ccc !important;
            color: #999 !important;
            cursor: not-allowed !important;
            transform: none !important;
        }
        
        .send-btn:disabled:hover {
            transform: none !important;
            box-shadow: none !important;
        }
        
        /* Star Rating System */
        .rating-container {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            padding: 20px;
            margin-top: 15px;
            text-align: center;
            border: 2px solid rgba(255, 140, 0, 0.2);
        }
        
        .rating-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
        }
        
        .stars-container {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-bottom: 15px;
        }
        
        .star {
            font-size: 24px;
            color: #ddd;
            cursor: pointer;
            transition: all 0.3s ease;
            user-select: none;
        }
        
        .star:hover,
        .star.active {
            color: #ffd700;
            transform: scale(1.1);
        }
        
        .star.rated {
            color: #ffd700;
        }
        
        .rating-text {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
        }
        
        .feedback-input {
            width: 100%;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 12px;
            margin-top: 10px;
            font-size: 14px;
            transition: all 0.3s ease;
            resize: vertical;
            min-height: 80px;
        }
        
        .feedback-input:focus {
            border-color: #ff8c00;
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
        }
        
        .submit-feedback-btn {
            background: linear-gradient(135deg, #ff8c00, #ff6b35);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 10px 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        
        .submit-feedback-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
        }
        
        .submit-feedback-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .feedback-submitted {
            background: rgba(40, 167, 69, 0.1);
            border-color: #28a745;
            color: #28a745;
        }
        
        .feedback-submitted .rating-title {
            color: #28a745;
        }
        
        .feedback-text {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
            border-left: 3px solid #28a745;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .feedback-text strong {
            color: #28a745;
        }
        
        /* Address Header */
        .chat-address-header {
            background: rgba(255, 140, 0, 0.1);
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 14px;
            color: #ff8c00;
            font-weight: 600;
            text-align: center;
            border-left: 3px solid #ff8c00;
        }
        
        .chat-address-header i {
            margin-right: 8px;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .problem-type {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .problem-type.road { background: #e3f2fd; color: #1976d2; }
        .problem-type.water { background: #e8f5e8; color: #388e3c; }
        .problem-type.electricity { background: #fff3e0; color: #f57c00; }
        .problem-type.sanitation { background: #fce4ec; color: #c2185b; }
        .problem-type.other { background: #f3e5f5; color: #7b1fa2; }
        
        .problem-status {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .problem-status.pending { background: #fff3e0; color: #f57c00; }
        .problem-status.in_progress { background: #e3f2fd; color: #1976d2; }
        .problem-status.resolved { background: #e8f5e8; color: #388e3c; }
        .problem-status.rejected { background: #ffebee; color: #d32f2f; }
        
        .problem-info {
            margin-bottom: 15px;
        }
        
        .problem-info h6 {
            color: #333;
            margin-bottom: 5px;
        }
        
        .problem-info p {
            color: #666;
            margin-bottom: 5px;
        }
        
        .problem-photo {
            max-width: 100%;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        
        .no-problems {
            text-align: center;
            padding: 50px 20px;
            color: #666;
        }
        
        .no-problems i {
            font-size: 48px;
            color: #ccc;
            margin-bottom: 20px;
        }
        
        .loading-problems {
            text-align: center;
            padding: 50px 20px;
            color: #666;
        }
        
        .loading-problems i {
            font-size: 48px;
            color: #ff8c00;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .stats-section {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .stat-item {
            text-align: center;
            padding: 0px;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #ff8c00;
        }
        
        .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        
        /* Pagination Styles */
        .pagination-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 30px;
            gap: 10px;
        }
        
        .pagination-info {
            color: #666;
            font-size: 14px;
            margin: 0 15px;
        }
        
        .pagination-btn {
            background: linear-gradient(135deg, #ff8c00, #ff6b35);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .pagination-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
        }
        
        .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .page-numbers {
            display: flex;
            gap: 5px;
        }
        
        .page-number {
            background: rgba(255, 255, 255, 0.8);
            color: #666;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 35px;
            text-align: center;
        }
        
        .page-number:hover {
            background: rgba(255, 140, 0, 0.1);
            border-color: #ff8c00;
            color: #ff8c00;
        }
        
        .page-number.active {
            background: linear-gradient(135deg, #ff8c00, #ff6b35);
            color: white;
            border-color: #ff8c00;
        }
        
        .page-number.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <!-- 3D Animated Background -->
    <div class="bg-3d"></div>

    <!-- Glassmorphism Header -->
    <header class="header-glass fixed-top">
        <div class="app-title">
            <div class="app-icon">
                <img src="logo.svg" alt="ShivSena Logo" style="width: 60px; height: 60px; object-fit: contain;">
            </div>
            <div class="title-text">
                <h5 class="mb-0">शिवसेना - शेवगाव शहर</h5>
                <small>लॉग इन: <?php echo htmlspecialchars($_SESSION['user_mobile']); ?></small>
            </div>
        </div>
        <div class="header-actions">
            <button class="btn-3d back-btn-header" onclick="goBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
        </div>
    </header>

    <!-- Problems Page -->
    <div class="problems-page">
        <div class="problems-container">
            <!-- Page Header -->
            <div class="page-header">
                <h3><i class="bi bi-exclamation-triangle"></i> माझ्या समस्या (<?php echo htmlspecialchars($_SESSION['user_mobile']); ?>)</h3>
                <small>आपल्या नोंदवलेल्या सर्व समस्या पहा आणि त्यांची स्थिती तपासा</small>
            </div>

            <!-- Statistics Section -->
            <div class="stats-section">
                <div class="row">
                    <div class="col-3">
                        <div class="stat-item">
                            <div class="stat-number" id="total-problems">0</div>
                            <div class="stat-label">एकूण समस्या</div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="stat-item">
                            <div class="stat-number" id="pending-problems">0</div>
                            <div class="stat-label">प्रलंबित</div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="stat-item">
                            <div class="stat-number" id="resolved-problems">0</div>
                            <div class="stat-label">सोडवले</div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="stat-item">
                            <div class="stat-number" id="in-progress-problems">0</div>
                            <div class="stat-label">प्रगतीत</div>
                        </div>
                    </div>
                </div>
            </div>



            <!-- Problems List -->
            <div id="problems-list">
                <div class="loading-problems">
                    <i class="bi bi-hourglass-split"></i>
                    <p>समस्या लोड करत आहे...</p>
                </div>
            </div>
            
            <!-- Pagination -->
            <div id="pagination-container" class="pagination-container" style="display: none;">
                <button class="pagination-btn" id="prev-btn" onclick="changePage(currentPage - 1)">
                    <i class="bi bi-chevron-left"></i> मागील
                </button>
                
                <div class="page-numbers" id="page-numbers">
                    <!-- Page numbers will be generated here -->
                </div>
                
                
                
                <button class="pagination-btn" id="next-btn" onclick="changePage(currentPage + 1)">
                    पुढील <i class="bi bi-chevron-right"></i>
                </button>
            </div>
            <div class="pagination-info" id="pagination-info" style="text-align: center;">
                    <!-- Page info will be generated here -->
                </div>
        </div>
    </div>



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="problems.js"></script>

</body>
</html> 