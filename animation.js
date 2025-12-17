// Animatsiyalar JavaScript Fayli

// Scroll animatsiyalari
document.addEventListener('DOMContentLoaded', function() {
    // Staggered animations for cards
    const cards = document.querySelectorAll('.detail-card, .requirement-card, .stat-item');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('stagger-item');
    });

    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.classList.add('typing-effect');
        }, 1000);
    }

    // Floating animation for trophy
    const trophy = document.querySelector('.floating-trophy');
    if (trophy) {
        trophy.style.animation = 'float 6s ease-in-out infinite';
    }

    // Pulse animation for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        setInterval(() => {
            button.classList.add('pulse');
            setTimeout(() => {
                button.classList.remove('pulse');
            }, 1000);
        }, 5000);
    });

    // Scroll-triggered animations
    initScrollAnimations();

    // Mouse move animations
    initMouseMoveAnimations();

    // Page transitions
    initPageTransitions();
});

// Scroll animatsiyalari
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add specific animation based on element type
                if (entry.target.classList.contains('detail-card')) {
                    entry.target.classList.add('fade-in-up');
                } else if (entry.target.classList.contains('stat-item')) {
                    entry.target.classList.add('scale-in');
                }
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.detail-card, .requirement-card, .stat-item, .time-unit, .prize-winner'
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

// Mouse move animations
function initMouseMoveAnimations() {
    document.addEventListener('mousemove', function(e) {
        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            const floatingElements = document.querySelectorAll('.float-element, .character');
            floatingElements.forEach((el, index) => {
                const speed = 0.02 * (index + 1);
                el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        }

        // Cursor trail effect
        createCursorTrail(e);
    });
}

// Cursor trail effect
function createCursorTrail(e) {
    if (window.innerWidth > 768) { // Only on desktop
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--neon-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX - 4}px;
            top: ${e.clientY - 4}px;
            opacity: 0.5;
            filter: blur(1px);
            animation: trailFade 0.5s ease forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 500);
    }
}

// Page transitions
function initPageTransitions() {
    // Add page transition styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes trailFade {
            to {
                opacity: 0;
                transform: scale(2);
            }
        }
        
        .page-transition {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--gradient-primary);
            z-index: 9999;
            transform: translateY(100%);
        }
        
        .page-transition.active {
            animation: slideUp 0.6s ease forwards;
        }
        
        @keyframes slideUp {
            to {
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Ripple effect for buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('ripple') || 
        e.target.closest('.ripple') || 
        e.target.classList.contains('cta-button')) {
        
        const button = e.target.classList.contains('cta-button') ? 
                      e.target : e.target.closest('.ripple') || e.target;
        
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Text reveal animation
function revealText(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.overflow = 'hidden';
    
    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            element.textContent += text[i];
        }, i * 50);
    }
}

// Countdown number animation
function animateCountdownNumber(element, newValue) {
    element.classList.add('number-change');
    setTimeout(() => {
        element.textContent = newValue;
        setTimeout(() => {
            element.classList.remove('number-change');
        }, 500);
    }, 250);
}

// Particle explosion effect
function createParticleExplosion(x, y, color = '#00a3ff', count = 20) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const size = 2 + Math.random() * 4;
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9998;
            animation: particleExplode 1s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleExplode {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.cos(angle) * velocity * 100}px, ${Math.sin(angle) * velocity * 100}px) scale(0);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
            style.remove();
        }, 1000);
    }
}

// Confetti effect
function createConfetti() {
    const colors = ['#00a3ff', '#8a2be2', '#00fff7', '#ff00ff', '#ffff00'];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const x = Math.random() * window.innerWidth;
        const duration = Math.random() * 3 + 2;
        
        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            top: -20px;
            left: ${x}px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            transform: rotate(${Math.random() * 360}deg);
            animation: fall ${duration}s linear forwards;
            z-index: 9997;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
    
    // Add fall animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg);
            }
        }
    `;
    
    document.head.appendChild(style);
    setTimeout(() => style.remove(), 5000);
}

// Glitch effect
function glitchEffect(element, duration = 500) {
    const originalText = element.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    
    let interval = setInterval(() => {
        let glitchedText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() > 0.9) {
                glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitchedText += originalText[i];
            }
        }
        element.textContent = glitchedText;
    }, 50);
    
    setTimeout(() => {
        clearInterval(interval);
        element.textContent = originalText;
    }, duration);
}

// Morphing text animation
function morphText(element, newText, duration = 1000) {
    const originalText = element.textContent;
    const steps = 20;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
        let morphedText = '';
        const progress = currentStep / steps;
        
        for (let i = 0; i < Math.max(originalText.length, newText.length); i++) {
            if (Math.random() < progress) {
                morphedText += newText[i] || '';
            } else {
                morphedText += originalText[i] || '';
            }
        }
        
        element.textContent = morphedText;
        currentStep++;
        
        if (currentStep > steps) {
            clearInterval(interval);
            element.textContent = newText;
        }
    }, stepTime);
}

// Wave animation for text
function waveText(element) {
    const text = element.textContent;
    element.textContent = '';
    
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.className = 'wave';
        span.style.animationDelay = `${i * 0.1}s`;
        element.appendChild(span);
    }
}

// Shimmer effect
function addShimmerEffect(element) {
    element.classList.add('shimmer');
    setTimeout(() => {
        element.classList.remove('shimmer');
    }, 2000);
}

// Flip card animation
function flipCard(card) {
    card.classList.add('flip');
    setTimeout(() => {
        card.classList.remove('flip');
    }, 600);
}

// Zoom in animation
function zoomIn(element) {
    element.classList.add('zoom-in');
    setTimeout(() => {
        element.classList.remove('zoom-in');
    }, 500);
}

// Heartbeat animation
function heartbeat(element) {
    element.classList.add('heartbeat');
    setTimeout(() => {
        element.classList.remove('heartbeat');
    }, 1000);
}

// Flash animation
function flash(element) {
    element.classList.add('flash');
    setTimeout(() => {
        element.classList.remove('flash');
    }, 2000);
}

// Rubber band animation
function rubberBand(element) {
    element.classList.add('rubber-band');
    setTimeout(() => {
        element.classList.remove('rubber-band');
    }, 1000);
}

// Shake animation
function shake(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Rotate animation
function rotate(element) {
    element.classList.add('rotate');
    setTimeout(() => {
        element.classList.remove('rotate');
    }, 2000);
}

// Fade in animation
function fadeIn(element) {
    element.classList.add('fade-in-up');
}

// Scale in animation
function scaleIn(element) {
    element.classList.add('scale-in');
}

// Bounce in animation
function bounceIn(element) {
    element.classList.add('bounce-in');
}

// Slide in from top
function slideInTop(element) {
    element.classList.add('slide-in-top');
}

// Slide in from bottom
function slideInBottom(element) {
    element.classList.add('slide-in-bottom');
}

// Gradient animation
function addGradientAnimation(element) {
    element.classList.add('gradient-animation');
}

// Neon pulse animation
function addNeonPulse(element) {
    element.classList.add('neon-pulse');
}

// Export animations for use in other files
window.Animations = {
    createParticleExplosion,
    createConfetti,
    glitchEffect,
    morphText,
    waveText,
    addShimmerEffect,
    flipCard,
    zoomIn,
    heartbeat,
    flash,
    rubberBand,
    shake,
    rotate,
    fadeIn,
    scaleIn,
    bounceIn,
    slideInTop,
    slideInBottom,
    addGradientAnimation,
    addNeonPulse,
    revealText,
    animateCountdownNumber
};

// Auto-initialize animations for specific elements
function autoInitAnimations() {
    // Add shimmer to CTA buttons
    document.querySelectorAll('.cta-button').forEach(btn => {
        setInterval(() => {
            addShimmerEffect(btn);
        }, 10000);
    });
    
    // Add pulse to important elements
    document.querySelectorAll('.card-icon, .stat-icon').forEach(icon => {
        setInterval(() => {
            heartbeat(icon);
        }, 8000);
    });
    
    // Add random glitch to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        setInterval(() => {
            if (Math.random() > 0.7) {
                glitchEffect(heroTitle, 300);
            }
        }, 10000);
    }
}

// Initialize auto animations
setTimeout(autoInitAnimations, 3000);