/**
 * Angela Nakirijja Portfolio - JavaScript Functionality
 * Main application script with modular functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initSidebar();
    initSmoothScroll();
    initActiveSection();
    initCurrentYear();
    initImageFallback();
});

/**
 * Navigation Module - Mobile menu functionality
 */
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', 
                navLinks.classList.contains('active'));
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) && 
                e.target !== mobileMenuBtn && 
                !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Update on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Sidebar Module - Sidebar toggle functionality
 */
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            const isExpanded = sidebar.classList.contains('active');
            sidebarToggle.innerHTML = isExpanded ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            sidebarToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close sidebar when clicking a link
        document.querySelectorAll('.sidebar-links a').forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
                sidebarToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                e.target !== sidebarToggle && 
                !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
                sidebarToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Hide sidebar toggle on mobile
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 992) {
                sidebarToggle.style.display = 'none';
            } else {
                sidebarToggle.style.display = 'flex';
            }
        });
        
        // Initial check
        if (window.innerWidth <= 992) {
            sidebarToggle.style.display = 'none';
        }
    }
}

/**
 * Smooth Scroll Module - Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('.header-container');
                const headerHeight = header ? header.offsetHeight : 200;
                const offset = 20;
                const targetPosition = targetElement.offsetTop - headerHeight + offset;
        
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Active Section Module - Highlight active section in navigation
 */
function initActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a, .sidebar-links a');
    //const headerHeight = document.querySelector('.header-container').offsetHeight;
    
    function updateActiveSection() {
        const header = document.querySelector('.header-container');
        const headerHeight = header ? header.offsetHeight : 200;
        
        let current = '';
        const scrollPosition = window.scrollY + headerHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Initial update
    updateActiveSection();
    
    // Update on scroll
    window.addEventListener('scroll', debounce(updateActiveSection, 100));
    
    window.addEventListener('resize', debounce(updateActiveSection, 100));
    
    // Update on resize (header height might change)
    window.addEventListener('resize', () => {
        headerHeight = document.querySelector('.header-container').offsetHeight;
        updateActiveSection();
    });
}

/**
 * Current Year Module - Update copyright year
 */
function initCurrentYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Image Fallback Module - Handle broken images
 */
function initImageFallback() {
    const fallbackImage = 'https://ui-avatars.com/api/?name=Angela+Nakirijja&background=4f46e5&color=fff&size=128';
    
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.onerror = null; // Prevent infinite loop
            this.src = fallbackImage;
            this.alt = 'Profile Image - Angela Nakirijja';
        });
    });
}

/**
 * Utility Functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}