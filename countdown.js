// Countdown Timer JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Countdown timer
    const countdownDate = new Date('January 2, 2026 23:59:59').getTime();
    
    // Toshkent vaqti (GMT+5)
    const tashkentOffset = 5 * 60 * 60 * 1000; // 5 soat millisecond larda
    
    function updateCountdown() {
        const now = new Date().getTime();
        const tashkentTime = now + tashkentOffset;
        const timeLeft = countdownDate - tashkentTime;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            // DOM elementlarini yangilash
            document.getElementById('days').textContent = padZero(days);
            document.getElementById('hours').textContent = padZero(hours);
            document.getElementById('minutes').textContent = padZero(minutes);
            document.getElementById('seconds').textContent = padZero(seconds);
            
            // Countdown progress yangilash
            updateCountdownProgress(timeLeft);
        } else {
            // Vaqt tugagan
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            
            document.querySelector('.countdown-header h2').textContent = 'Ro\'yxatdan o\'tish yakunlandi!';
            document.querySelector('.section-subtitle').textContent = 'Barcha joylar band qilindi';
            
            // Progress bar to'liq
            const progressFill = document.getElementById('progress-fill');
            if (progressFill) {
                progressFill.style.width = '100%';
            }
            
            clearInterval(countdownInterval);
        }
    }
    
    function padZero(number) {
        return number.toString().padStart(2, '0');
    }
    
    function updateCountdownProgress(timeLeft) {
        const totalTime = 14 * 24 * 60 * 60 * 1000; // 14 kun millisecond larda
        const timePassed = totalTime - timeLeft;
        const progressPercentage = (timePassed / totalTime) * 100;
        
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
    }
    
    // Dastlabki yangilash
    updateCountdown();
    
    // Har sekund yangilash
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Countdown sound effect (optional)
    function playCountdownSound() {
        if (typeof Howl !== 'undefined') {
            const tickSound = new Howl({
                src: ['assets/sounds/tick.mp3'],
                volume: 0.3
            });
            
            // Faqat oxirgi 10 soniyada
            setInterval(() => {
                const timeLeft = countdownDate - (new Date().getTime() + tashkentOffset);
                const secondsLeft = Math.floor(timeLeft / 1000);
                
                if (secondsLeft <= 10 && secondsLeft > 0) {
                    tickSound.play();
                }
            }, 1000);
        }
    }
    
    // Play sound if enabled
    const soundEnabled = localStorage.getItem('soundEnabled') === 'true';
    if (soundEnabled) {
        playCountdownSound();
    }
    
    // Countdown completion celebration
    function celebrateCountdownCompletion() {
        const timeLeft = countdownDate - (new Date().getTime() + tashkentOffset);
        
        if (timeLeft <= 0 && timeLeft > -1000) {
            // Confetti effect
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
            
            // Show celebration message
            setTimeout(() => {
                showNotification('Ro\'yxatdan o\'tish yakunlandi! Turnir boshlanishini kutib turing.', 'success');
            }, 1000);
        }
    }
    
    // Check for completion every second
    setInterval(celebrateCountdownCompletion, 1000);
    
    // Countdown share functionality
    const shareButton = document.querySelector('.share-countdown');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            const timeLeft = countdownDate - (new Date().getTime() + tashkentOffset);
            const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            
            const shareText = `Humo eSport Winter Tournament 2026 ga ro'yxatdan o'tish ${daysLeft} kun qoldi! Hoziroq qo'shiling: ${window.location.href}`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Humo eSport Winter Tournament 2026',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                copyToClipboard(shareText);
                showNotification('Havola nusxalandi!', 'success');
            }
        });
    }
    
    // Countdown theme based on time left
    function updateCountdownTheme() {
        const timeLeft = countdownDate - (new Date().getTime() + tashkentOffset);
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        
        const countdownSection = document.querySelector('.countdown-section');
        if (!countdownSection) return;
        
        // Remove existing themes
        countdownSection.classList.remove('urgent', 'warning', 'normal');
        
        // Apply new theme
        if (daysLeft <= 3) {
            countdownSection.classList.add('urgent');
        } else if (daysLeft <= 7) {
            countdownSection.classList.add('warning');
        } else {
            countdownSection.classList.add('normal');
        }
    }
    
    // Update theme initially and every minute
    updateCountdownTheme();
    setInterval(updateCountdownTheme, 60000);
    
    // Countdown analytics
    function trackCountdownView() {
        const viewKey = 'countdown_view_' + new Date().toDateString();
        const views = parseInt(localStorage.getItem(viewKey) || '0');
        localStorage.setItem(viewKey, (views + 1).toString());
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'countdown_view', {
                'event_category': 'engagement',
                'event_label': 'countdown_timer'
            });
        }
    }
    
    // Track view when countdown is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackCountdownView();
            }
        });
    }, { threshold: 0.5 });
    
    const countdownElement = document.querySelector('.countdown-section');
    if (countdownElement) {
        observer.observe(countdownElement);
    }
    
    // Countdown presets for testing
    window.testCountdown = function(hours = 24) {
        const testDate = new Date().getTime() + (hours * 60 * 60 * 1000);
        countdownDate = testDate;
        updateCountdown();
        updateCountdownTheme();
    };
    
    // Export for debugging
    window.getCountdownInfo = function() {
        const now = new Date().getTime();
        const tashkentTime = now + tashkentOffset;
        const timeLeft = countdownDate - tashkentTime;
        
        return {
            countdownDate: new Date(countdownDate),
            tashkentTime: new Date(tashkentTime),
            timeLeft: timeLeft,
            days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
            hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
            formatted: `${padZero(Math.floor(timeLeft / (1000 * 60 * 60 * 24)))}:${padZero(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))}:${padZero(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)))}:${padZero(Math.floor((timeLeft % (1000 * 60)) / 1000))}`
        };
    };
});