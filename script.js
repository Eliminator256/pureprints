// Slideshow Functionality
class Slideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.slide-prev');
        this.nextBtn = document.querySelector('.slide-next');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.slideDuration = 5000; // 5 seconds per slide
        
        this.init();
    }
    
    init() {
        // Start automatic slideshow
        this.startSlideshow();
        
        // Event listeners for navigation
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Event listeners for dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause slideshow on hover
        const slideshowContainer = document.querySelector('.slideshow-container');
        slideshowContainer.addEventListener('mouseenter', () => this.pauseSlideshow());
        slideshowContainer.addEventListener('mouseleave', () => this.startSlideshow());
        
        // Touch swipe support
        this.addSwipeSupport();
    }
    
    startSlideshow() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }
    
    pauseSlideshow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlideshow();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlideshow();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlideshow();
    }
    
    updateSlideshow() {
        // Remove active class from all slides and dots
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
        
        // Reset animation for slide content
        const currentContent = this.slides[this.currentSlide].querySelector('.slide-content');
        const headings = currentContent.querySelectorAll('h2, p');
        
        headings.forEach(heading => {
            heading.style.animation = 'none';
            void heading.offsetWidth; // Trigger reflow
            heading.style.animation = null;
        });
    }
    
    addSwipeSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        const slideshowContainer = document.querySelector('.slideshow-container');
        
        slideshowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slideshowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
        };
    }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Slideshow();
    
    // Active menu link is set in each page's HTML (server-side / static).
    // Removed JS-based active-assignment to avoid multiple matches.
    
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Handle dropdown menus on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        if (dropdownLink) {
            dropdownLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Scroll to hero section when scroll indicator is clicked
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Floating buttons functionality
    const backToTopBtn = document.querySelector('.back-to-top');
    const chatBtn = document.querySelector('.chat-button');
    const chatModal = document.getElementById('chatModal');
    const chatClose = document.querySelector('.chat-close');
    const chatForm = document.getElementById('chatForm');
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    const welcomeSection = document.getElementById('welcomeSection');
    const chatSection = document.getElementById('chatSection');
    
    let chatUserData = {};
    
    // Show/hide buttons on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
            chatBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
            chatBtn.classList.remove('show');
        }
    });
    
    // Back to top functionality
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Chat button functionality
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            chatModal.classList.add('active');
        });
    }
    
    // Close chat modal
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatModal.classList.remove('active');
        });
    }
    
    // Close chat when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === chatModal) {
            chatModal.classList.remove('active');
        }
    });
    
    // Handle welcome form submission
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('chatName').value;
            const email = document.getElementById('chatEmail').value;
            const phone = document.getElementById('chatPhone').value;
            
            // Store user data
            chatUserData = { name, email, phone };
            
            // Update greeting
            document.getElementById('chatUserGreeting').textContent = `Hi ${name}!`;
            
            // Switch to chat section
            welcomeSection.style.display = 'none';
            chatSection.style.display = 'flex';
            
            // Clear form
            chatForm.reset();
        });
    }
    
    // Handle message submission
    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const message = messageInput.value.trim();
            
            if (message) {
                // Add user message to chat
                addMessageToChat(message, 'user');
                
                // Send message to server
                sendChatMessage(message);
                
                // Clear input
                messageInput.value = '';
                messageInput.focus();
            }
        });
    }
    
    // Add message to chat display
    function addMessageToChat(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const p = document.createElement('p');
        p.textContent = text;
        
        messageDiv.appendChild(p);
        chatMessages.appendChild(messageDiv);
        
        // Auto scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send chat message to server
    function sendChatMessage(message) {
        const data = {
            name: chatUserData.name,
            email: chatUserData.email,
            phone: chatUserData.phone,
            message: message,
            timestamp: new Date().toLocaleString()
        };
        
        // Send to server endpoint
        fetch('send-chat.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Show bot response
                setTimeout(() => {
                    addMessageToChat('Thanks for your message! We\'ll get back to you soon.', 'bot');
                }, 500);
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
            addMessageToChat('Sorry, there was an error sending your message. Please try again.', 'bot');
        });
    }
});

// (Removed duplicate DOMContentLoaded block that referenced an undefined `observer` and
// redeclared `navLinks`. The page animations can be re-added with a proper
// IntersectionObserver if desired.)