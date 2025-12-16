// FOR HUMO - Main JavaScript
document.addEventListener("DOMContentLoaded", function() {
    console.log("For Humo loaded");
    
    // Remove loading screen
    const loading = document.getElementById("loading");
    if (loading) {
        setTimeout(() => {
            loading.style.opacity = "0";
            setTimeout(() => {
                loading.style.display = "none";
            }, 300);
        }, 1000);
    }
    
    // Mobile menu toggle
    const menuToggle = document.getElementById("menuToggle");
    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            const navLinks = document.querySelector(".nav-links");
            const navButtons = document.querySelector(".nav-buttons");
            
            if (navLinks.style.display === "flex") {
                navLinks.style.display = "none";
                navButtons.style.display = "none";
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                navLinks.style.display = "flex";
                navButtons.style.display = "flex";
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
                
                // Mobile styles
                navLinks.style.flexDirection = "column";
                navLinks.style.position = "absolute";
                navLinks.style.top = "100%";
                navLinks.style.left = "0";
                navLinks.style.right = "0";
                navLinks.style.background = "white";
                navLinks.style.padding = "20px";
                navLinks.style.gap = "15px";
                navLinks.style.borderBottom = "1px solid #e5e5e5";
                
                navButtons.style.position = "absolute";
                navButtons.style.top = "calc(100% + 150px)";
                navButtons.style.left = "20px";
                navButtons.style.right = "20px";
                navButtons.style.flexDirection = "column";
                navButtons.style.gap = "10px";
            }
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href === "#") return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: "smooth"
                });
                
                // Close mobile menu if open
                const menuToggle = document.getElementById("menuToggle");
                if (menuToggle.innerHTML.includes("times")) {
                    menuToggle.click();
                }
            }
        });
    });
    
    // Button clicks
    document.querySelectorAll(".btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const text = this.textContent.trim();
            
            if (text.includes("Sign In")) {
                alert("Login feature coming soon!");
            } else if (text.includes("Get Started") || text.includes("Start Competing")) {
                alert("Welcome to For Humo! Registration will be available soon.");
            } else if (text.includes("View Tournaments")) {
                alert("Tournaments page coming soon!");
            }
        });
    });
    
    // Stats counter animation
    const stats = document.querySelectorAll(".stat-number");
    const statsSection = document.querySelector(".hero-stats");
    
    if (stats.length > 0 && statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stats.forEach(stat => {
                        const target = parseInt(stat.textContent);
                        let current = 0;
                        const increment = target / 50;
                        
                        const counter = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(counter);
                            }
                            stat.textContent = Math.floor(current) + "+";
                        }, 20);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
        } else {
            navbar.style.boxShadow = "none";
        }
    });
});
