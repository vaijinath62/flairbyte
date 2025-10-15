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
    <title>शिवसेना - शेवगाव तालुका</title>
    

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="styles.css" rel="stylesheet">
    <style>
        .stats-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 15px 35px rgba(255, 140, 0, 0.2);
            border: 1px solid rgba(255, 140, 0, 0.3);
        }
        
        .stat-item {
            text-align: center;
            padding: 0px;
        }
        
        .stat-number {
            font-size: 28px;
            font-weight: bold;
            color: #ff8c00;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 12px;
            color: #666;
            font-weight: 500;
        }
        
        .profile-circle {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 140, 0, 0.3)
        }
        
        .profile-circle:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 35px rgba(255, 140, 0, 0.3);
        }
        
        .profile-image {
            width: 100%;
            height: auto;
            border-radius: 15px;
            object-fit: cover;
            box-shadow: 0 8px 25px rgba(255, 140, 0, 0.2);
            border: 2px solid rgba(255, 140, 0, 0.3);
        }
        
        .profile-section {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 12px;
        }
        
        .profile-name {
            color: #333;
            font-size: 14px;
            font-weight: 600;
            text-align: left;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .profile-section-main {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 15px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 15px 35px rgba(255, 140, 0, 0.2);
            border: 1px solid rgba(255, 140, 0, 0.3);
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
                <h5 class="mb-0">शिवसेना - शेवगाव तालुका</h5>
                <small>लॉग इन: <?php echo htmlspecialchars($_SESSION['user_mobile']); ?></small>
            </div>
        </div>
        <div class="header-actions">
            <button class="btn-3d btn-logout" id="logout-btn" title="Logout">
                <i class="bi bi-box-arrow-right"></i>
            </button>
        </div>
    </header>

    <!-- Main 3D Content -->
    <main class="main-3d">
        <!-- Dashboard Page -->
        <div id="dashboard-page" class="page-3d active">
            <div class="container-fluid">
                <!-- Welcome Section - Image Slider -->
                <div class="welcome-section mb-4">
                    <div class="slider-container">
                        <div class="slider-wrapper">
                            <div class="slider-slide active">
                                <img src="banner.jpg" alt="Shiv Sena Rally" class="slider-image">
                                <div class="slider-overlay">
                                    <!-- <div class="slider-content">
                                        <h4>शिवसेना - शेवगाव तालुका</h4>
                                        <p>जय महाराष्ट्र! 🚩</p>
                                    </div> -->
                                </div>
                            </div>
                            <div class="slider-slide">
                                <img src="b.jpg" alt="Party Meeting" class="slider-image">
                                <div class="slider-overlay">
                                    <div class="slider-content">
                                        <h4>मा. आशुतोष राजश्री दत्तात्रय डहाळे</h4>
                                        <p>शेवगाव तालुका प्रमुख</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Slider Navigation -->
                        <div class="slider-nav">
                            <button class="slider-dot active" data-slide="0"></button>
                            <button class="slider-dot" data-slide="1"></button>
                        </div>
                        
                        <!-- Slider Controls -->
                        <!-- <button class="slider-btn slider-prev">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <button class="slider-btn slider-next">
                            <i class="bi bi-chevron-right"></i>
                        </button> -->
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="row g-3 mb-4">
                    <div class="col-6">
                        <div class="card-3d card-primary" id="new-problem-card">
                            <div class="card-content">
                                <div class="card-icon">
                                    <i class="bi bi-plus-circle"></i>
                                </div>
                                <div class="card-info">
                                    <div class="card-label">नवीन समस्या नोंदवा</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="card-3d card-success">
                            <div class="card-content">
                                <div class="card-icon">
                                    <i class="bi bi-clock-history"></i>
                                </div>
                                <div class="card-info">
                                    <div class="card-label">नोंदवलेल्या समस्या पहा</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Additional Menu Cards -->
                <div class="row g-3 mb-4">
                    <div class="col-6">
                        <div class="card-3d card-warning">
                            <div class="card-content">
                                <div class="card-icon">
                                    <i class="bi bi-chat-dots"></i>
                                </div>
                                <div class="card-info">
                                    <div class="card-label">आपला अभिप्राय द्या</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="card-3d card-info" id="view-abhipray-card">
                            <div class="card-content">
                                <div class="card-icon">
                                    <i class="bi bi-chat-square-text"></i>
                                </div>
                                <div class="card-info">
                                    <div class="card-label">दिलेले अभिप्राय पहा</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Problem Registration Form -->
                <div class="problem-form-container" id="problem-form" style="display: none;">
                    <div class="form-card">
                        <div class="form-header">
                            <h5><i class="bi bi-file-earmark-text"></i> नवीन समस्या नोंदवा</h5>
                            <button class="close-form-btn" id="close-form">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <form class="problem-form">
                            <div class="form-group">
                                <div class="floating-input">
                                    <input type="text" id="name" name="name" required>
                                    <label for="name">आपले नाव</label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <div class="floating-input">
                                    <input type="tel" id="phone" name="phone" required>
                                    <label for="phone">मोबाईल / व्हॉट्सअॅप नंबर</label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <div class="floating-input">
                                    <select id="village" name="village" required>
                                        <option value=""></option>
                                        <option value="shevgaon">शेवगाव</option>
                                        <option value="adhodi">अधोडी</option>
                                        <option value="akhatwade">अखटवाडे</option>
                                        <option value="akhegaon_titarfa">अखेगाव तितरफा</option>
                                        <option value="amrapur">अमरापूर</option>
                                        <option value="antarwali_bk">अंतरवली बीके</option>
                                        <option value="antarwali_khurd">अंतरवली खुर्द</option>
                                        <option value="avhane_bk">अव्हाणे बीके</option>
                                        <option value="avhane_kd">अव्हाणे केडी</option>
                                        <option value="aapegaon">आपेगाव</option>
                                        <option value="bhavinimgaon">भावी निंबगाव</option>
                                        <option value="bodhegaon">बोधेगाव</option>
                                        <option value="balamtakali">बलमटकली</option>
                                        <option value="belgaon">बेळगाव</option>
                                        <option value="baktarpur">बक्तरपूर</option>
                                        <option value="bodkhe">बोडखे</option>
                                        <option value="badgahavan">बडगहावन</option>
                                        <option value="bhatkudgaon">भटकुडगाव</option>
                                        <option value="bhagur">भगूर</option>
                                        <option value="chapadgaon">चापडगाव</option>
                                        <option value="chedechandga">चेडेचंदगा</option>
                                        <option value="dadegaon">दडेगाव</option>
                                        <option value="dahifal_new">दहिफळ नवे</option>
                                        <option value="dahifal_old">दहिफळ जुने</option>
                                        <option value="dahigaon_ne">दहिगाव ने</option>
                                        <option value="dahigaon_she">दहिगाव शे</option>
                                        <option value="deotakli">देवटकली</option>
                                        <option value="dhorjagaon_she">धोरजगाव शे</option>
                                        <option value="dhorjalgaon_ne">धोरजलगाव ने</option>
                                        <option value="dhorsade">धोरसाडे</option>
                                        <option value="divate">दिवटे</option>
                                        <option value="dhumagad_tanda">धुमगड तांडा</option>
                                        <option value="dhorhingani">धोरहिंगणी</option>
                                        <option value="erandgaon">एरंडगाव</option>
                                        <option value="gadewadi">गदेवाडी</option>
                                        <option value="gaikwadjalgaon">गायकवाडजलगाव</option>
                                        <option value="ghotan">घोटण</option>
                                        <option value="golegaon">गोळेगाव</option>
                                        <option value="garadwadi">गरडवाडी</option>
                                        <option value="hasanapur">हसनापूर</option>
                                        <option value="hatgaon">हटगाव</option>
                                        <option value="hingangaon_ne">हिंगणगाव ने</option>
                                        <option value="joharpur">जोहरपूर</option>
                                        <option value="karhetakali">करहेटकली</option>
                                        <option value="khadaka">खडका</option>
                                        <option value="khamgaon">खामगाव</option>
                                        <option value="khampimpri_new">खंपिंप्री नवे</option>
                                        <option value="khampimpri_old">खंपिंप्री जुने</option>
                                        <option value="khanapur">खानापूर</option>
                                        <option value="kharadgaon">खरडगाव</option>
                                        <option value="khuntephal">खुंटेफळ</option>
                                        <option value="kol_gaon">कोळ गाव</option>
                                        <option value="konoshi">कोनोशी</option>
                                        <option value="kurudgaon">कुरुडगाव</option>
                                        <option value="ladjalgaon">लडजलगाव</option>
                                        <option value="lakhamapuri">लखमापुरी</option>
                                        <option value="lolegaon">लोळेगाव</option>
                                        <option value="lakhephal">लखेफळ</option>
                                        <option value="maalegaon_ne">माळेगाव ने</option>
                                        <option value="madake">माडके</option>
                                        <option value="majaleshahar">मजळेशहर</option>
                                        <option value="malegaon_she">माळेगाव शे</option>
                                        <option value="mangrul_bk">मंगरुळ बीके</option>
                                        <option value="mangrul_kd">मंगरुळ केडी</option>
                                        <option value="mungi">मुंगी</option>
                                        <option value="malkapur">मलकापूर</option>
                                        <option value="nagalwadi_tanda">नगळवाडी तांडा</option>
                                        <option value="nagalwadi">नगळवाडी</option>
                                        <option value="najik_babhulgaon">नजीक बाभुळगाव</option>
                                        <option value="nimbe">निंबे</option>
                                        <option value="nandurvihire">नंदुरविहिरे</option>
                                        <option value="pingewadi">पिंगेवाडी</option>
                                        <option value="prabhuwadgaon">प्रभुवाडगाव</option>
                                        <option value="ranegaon">रणेगाव</option>
                                        <option value="ranjani">रणजणी</option>
                                        <option value="rakshi">रक्षी</option>
                                        <option value="salwadgaon">सळवाडगाव</option>
                                        <option value="samangaon">समंगाव</option>
                                        <option value="shahartkali">शहरटकली</option>
                                        <option value="shekte_bk">शेकटे बीके</option>
                                        <option value="shekte_kd">शेकटे केडी</option>
                                        <option value="shingori">शिंगोरी</option>
                                        <option value="sonesangavi">सोनेसंगवी</option>
                                        <option value="sonvihir">सोनविहीर</option>
                                        <option value="sukali">सुकळी</option>
                                        <option value="sultanpur_bk">सुलतानपूर बीके</option>
                                        <option value="sultanpur_kd">सुलतानपूर केडी</option>
                                        <option value="shobhanagar">शोभनगर</option>
                                        <option value="sevanagar">सेवानगर</option>
                                        <option value="sule_pimpalgaon">सुळे पिंपळगाव</option>
                                        <option value="sahapur">सहापूर</option>
                                        <option value="sahajanpur">सहजनपूर</option>
                                        <option value="tajnapur">ताजनापूर</option>
                                        <option value="talni">तळणी</option>
                                        <option value="thakurnimgaon">ठाकूर निंबगाव</option>
                                        <option value="thakurpimpalgaon">ठाकूर पिंपळगाव</option>
                                        <option value="thate">थाटे</option>
                                        <option value="vijaipur">विजापूर</option>
                                        <option value="wadgaon">वडगाव</option>
                                        <option value="wadule_bk">वडुळे बीके</option>
                                        <option value="wadule_kd">वडुळे केडी</option>
                                        <option value="wagholi">वाघोळी</option>
                                        <option value="warkhed">वरखेड</option>
                                        <option value="warur_bk">वरूर बीके</option>
                                        <option value="warur_kd">वरूर केडी</option>
                                        <option value="other">इतर</option>
                                    </select>
                                    <label for="village">गाव</label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <div class="floating-input">
                                    <input type="text" id="address" name="address" required>
                                    <label for="address">पत्ता</label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <div class="floating-input">
                                    <input type="number" id="family-members" name="family-members" min="1" max="50" required>
                                    <label for="family-members">कुटुंबातील व्यक्तींची संख्या</label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <div class="floating-input">
                                    <select id="problem-type" name="problem-type" required>
                                        <option value=""></option>
                                        <option value="road">रस्ते समस्या</option>
                                        <option value="water">पाणी समस्या</option>
                                        <option value="electricity">वीज समस्या</option>
                                        <option value="sanitation">स्वच्छता समस्या</option>
                                        <option value="other">इतर</option>
                                    </select>
                                    <label for="problem-type">समस्येचा प्रकार</label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <div class="floating-input">
                                    <textarea id="description" name="description" rows="4" required></textarea>
                                    <label for="description">समस्येचे तपशील</label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <div class="floating-input">
                                    <input type="file" id="photo" name="photo" accept="image/*">
                                    <label for="photo">फोटो अपलोड करा</label>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="submit-btn">
                                    <i class="bi bi-send"></i> समस्या नोंदवा
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Statistics Section -->
                <div class="section-title">
                    <h5><i class="bi bi-bar-chart"></i> माझ्या समस्या</h5>
                </div>
                <div class="stats-section">
                    <div class="row g-3 mb-4">
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
                <!-- Profile Section -->
                <div style="display: flex; justify-content: center; padding: 0px;">
                    <img src="banner.jpg" loading="lazy" alt="Ashutosh Dahale" class="profile-image">                    
                </div>
            </div>
            
            
        </div>
    </main>

    <!-- Abhipray Nondva Modal -->
    <div id="abhipray-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content abhipray-modal">
            <div class="modal-header">
                <h5><i class="bi bi-chat-dots"></i> अभिप्राय नोंदवा</h5>
                <button class="close-modal-btn" id="close-abhipray-modal">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="feedback-note">
                    <i class="bi bi-info-circle"></i>
                    <p>आपला सामान्य अभिप्राय द्या</p>
                </div>
                
                <div class="form-group">
                    <div class="floating-input">
                        <input type="text" id="abhipray-name" name="abhipray-name" required>
                        <label for="abhipray-name">आपले नाव</label>
                    </div>
                </div>
                
                <div class="form-group">
                    <div class="floating-input">
                        <input type="tel" id="abhipray-mobile" name="abhipray-mobile" required readonly>
                        <label for="abhipray-mobile">मोबाईल नंबर</label>
                    </div>
                </div>
                
                <div class="form-group">
                    <div class="floating-input">
                        <select id="abhipray-village" name="abhipray-village" required>
                            <option value=""></option>
                            <option value="shevgaon">शेवगाव</option>
                            <option value="adhodi">अधोडी</option>
                            <option value="akhatwade">अखटवाडे</option>
                            <option value="akhegaon_titarfa">अखेगाव तितरफा</option>
                            <option value="amrapur">अमरापूर</option>
                            <option value="antarwali_bk">अंतरवली बीके</option>
                            <option value="antarwali_khurd">अंतरवली खुर्द</option>
                            <option value="avhane_bk">अव्हाणे बीके</option>
                            <option value="avhane_kd">अव्हाणे केडी</option>
                            <option value="aapegaon">आपेगाव</option>
                            <option value="bhavinimgaon">भावी निंबगाव</option>
                            <option value="bodhegaon">बोधेगाव</option>
                            <option value="balamtakali">बलमटकली</option>
                            <option value="belgaon">बेळगाव</option>
                            <option value="baktarpur">बक्तरपूर</option>
                            <option value="bodkhe">बोडखे</option>
                            <option value="badgahavan">बडगहावन</option>
                            <option value="bhatkudgaon">भटकुडगाव</option>
                            <option value="bhagur">भगूर</option>
                            <option value="chapadgaon">चापडगाव</option>
                            <option value="chedechandga">चेडेचंदगा</option>
                            <option value="dadegaon">दडेगाव</option>
                            <option value="dahifal_new">दहिफळ नवे</option>
                            <option value="dahifal_old">दहिफळ जुने</option>
                            <option value="dahigaon_ne">दहिगाव ने</option>
                            <option value="dahigaon_she">दहिगाव शे</option>
                            <option value="deotakli">देवटकली</option>
                            <option value="dhorjagaon_she">धोरजगाव शे</option>
                            <option value="dhorjalgaon_ne">धोरजलगाव ने</option>
                            <option value="dhorsade">धोरसाडे</option>
                            <option value="divate">दिवटे</option>
                            <option value="dhumagad_tanda">धुमगड तांडा</option>
                            <option value="dhorhingani">धोरहिंगणी</option>
                            <option value="erandgaon">एरंडगाव</option>
                            <option value="gadewadi">गदेवाडी</option>
                            <option value="gaikwadjalgaon">गायकवाडजलगाव</option>
                            <option value="ghotan">घोटण</option>
                            <option value="golegaon">गोळेगाव</option>
                            <option value="garadwadi">गरडवाडी</option>
                            <option value="hasanapur">हसनापूर</option>
                            <option value="hatgaon">हटगाव</option>
                            <option value="hingangaon_ne">हिंगणगाव ने</option>
                            <option value="joharpur">जोहरपूर</option>
                            <option value="karhetakali">करहेटकली</option>
                            <option value="khadaka">खडका</option>
                            <option value="khamgaon">खामगाव</option>
                            <option value="khampimpri_new">खंपिंप्री नवे</option>
                            <option value="khampimpri_old">खंपिंप्री जुने</option>
                            <option value="khanapur">खानापूर</option>
                            <option value="kharadgaon">खरडगाव</option>
                            <option value="khuntephal">खुंटेफळ</option>
                            <option value="kol_gaon">कोळ गाव</option>
                            <option value="konoshi">कोनोशी</option>
                            <option value="kurudgaon">कुरुडगाव</option>
                            <option value="ladjalgaon">लडजलगाव</option>
                            <option value="lakhamapuri">लखमापुरी</option>
                            <option value="lolegaon">लोळेगाव</option>
                            <option value="lakhephal">लखेफळ</option>
                            <option value="maalegaon_ne">माळेगाव ने</option>
                            <option value="madake">माडके</option>
                            <option value="majaleshahar">मजळेशहर</option>
                            <option value="malegaon_she">माळेगाव शे</option>
                            <option value="mangrul_bk">मंगरुळ बीके</option>
                            <option value="mangrul_kd">मंगरुळ केडी</option>
                            <option value="mungi">मुंगी</option>
                            <option value="malkapur">मलकापूर</option>
                            <option value="nagalwadi_tanda">नगळवाडी तांडा</option>
                            <option value="nagalwadi">नगळवाडी</option>
                            <option value="najik_babhulgaon">नजीक बाभुळगाव</option>
                            <option value="nimbe">निंबे</option>
                            <option value="nandurvihire">नंदुरविहिरे</option>
                            <option value="pingewadi">पिंगेवाडी</option>
                            <option value="prabhuwadgaon">प्रभुवाडगाव</option>
                            <option value="ranegaon">रणेगाव</option>
                            <option value="ranjani">रणजणी</option>
                            <option value="rakshi">रक्षी</option>
                            <option value="salwadgaon">सळवाडगाव</option>
                            <option value="samangaon">समंगाव</option>
                            <option value="shahartkali">शहरटकली</option>
                            <option value="shekte_bk">शेकटे बीके</option>
                            <option value="shekte_kd">शेकटे केडी</option>
                            <option value="shingori">शिंगोरी</option>
                            <option value="sonesangavi">सोनेसंगवी</option>
                            <option value="sonvihir">सोनविहीर</option>
                            <option value="sukali">सुकळी</option>
                            <option value="sultanpur_bk">सुलतानपूर बीके</option>
                            <option value="sultanpur_kd">सुलतानपूर केडी</option>
                            <option value="shobhanagar">शोभनगर</option>
                            <option value="sevanagar">सेवानगर</option>
                            <option value="sule_pimpalgaon">सुळे पिंपळगाव</option>
                            <option value="sahapur">सहापूर</option>
                            <option value="sahajanpur">सहजनपूर</option>
                            <option value="tajnapur">ताजनापूर</option>
                            <option value="talni">तळणी</option>
                            <option value="thakurnimgaon">ठाकूर निंबगाव</option>
                            <option value="thakurpimpalgaon">ठाकूर पिंपळगाव</option>
                            <option value="thate">थाटे</option>
                            <option value="vijaipur">विजापूर</option>
                            <option value="wadgaon">वडगाव</option>
                            <option value="wadule_bk">वडुळे बीके</option>
                            <option value="wadule_kd">वडुळे केडी</option>
                            <option value="wagholi">वाघोळी</option>
                            <option value="warkhed">वरखेड</option>
                            <option value="warur_bk">वरूर बीके</option>
                            <option value="warur_kd">वरूर केडी</option>
                            <option value="other">इतर</option>
                        </select>
                        <label for="abhipray-village">गाव</label>
                    </div>
                </div>
                
                <div class="form-group">
                    <div class="floating-input">
                        <textarea id="abhipray-text" name="abhipray-text" rows="4" placeholder="आपला अभिप्राय लिहा..." required></textarea>
                        <label for="abhipray-text">अभिप्राय</label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="submit-btn" id="submit-abhipray-btn">
                        <i class="bi bi-send"></i> अभिप्राय पाठवा
                    </button>
                </div>
                
                <div id="loading-feedback" style="display: none; text-align: center; padding: 20px;">
                    <i class="bi bi-arrow-clockwise" style="font-size: 24px; animation: spin 1s linear infinite;"></i>
                    <p>लोड होत आहे...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- View Abhipray Modal -->
    <div id="view-abhipray-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content view-abhipray-modal">
            <div class="modal-header">
                <h5><i class="bi bi-chat-square-text"></i> दिलेले अभिप्राय</h5>
                <button class="close-modal-btn" id="close-view-abhipray-modal">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="abhipray-list" id="abhipray-list">
                    <div class="loading-abhipray">
                        <i class="bi bi-hourglass-split"></i>
                        <p>अभिप्राय लोड करत आहे...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 3D Bottom Navigation -->
    <!-- <nav class="nav-3d">
        <div class="nav-container">
        </div>
    </nav> -->

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>

</body>
</html>