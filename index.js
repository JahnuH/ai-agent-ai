// AI Agent Studio - Main JavaScript Functionality
// Enhanced version with additional features and better organization

class AIAgentStudio {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupIntersectionObservers();
    this.setupParallaxEffects();
    this.setupEasterEggs();
  }

  // ==================== MODAL MANAGEMENT ====================
  
  setupEventListeners() {
    // Get DOM elements
    this.loginModal = document.getElementById('loginModal');
    this.signupModal = document.getElementById('signupModal');
    this.loginBtn = document.getElementById('loginBtn');
    this.signupBtn = document.getElementById('signupBtn');
    this.getStartedBtn = document.getElementById('getStartedBtn');
    this.continueGuestBtn = document.getElementById('continueGuestBtn');
    this.watchDemoBtn = document.getElementById('watchDemoBtn');

    // Modal trigger event listeners
    this.loginBtn?.addEventListener('click', () => this.openModal(this.loginModal));
    this.signupBtn?.addEventListener('click', () => this.openModal(this.signupModal));
    this.getStartedBtn?.addEventListener('click', () => this.openModal(this.signupModal));

    // Modal switch controls
    document.getElementById('switchToSignup')?.addEventListener('click', () => {
      this.closeModal(this.loginModal);
      this.openModal(this.signupModal);
    });

    document.getElementById('switchToLogin')?.addEventListener('click', () => {
      this.closeModal(this.signupModal);
      this.openModal(this.loginModal);
    });

    // Close modal controls
    document.getElementById('closeLoginModal')?.addEventListener('click', () => 
      this.closeModal(this.loginModal));
    document.getElementById('closeSignupModal')?.addEventListener('click', () => 
      this.closeModal(this.signupModal));

    // Close modals when clicking outside
    [this.loginModal, this.signupModal].forEach(modal => {
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });
    });

    // Form submissions
    document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('signupForm')?.addEventListener('submit', (e) => this.handleSignup(e));

    // Special buttons
    this.continueGuestBtn?.addEventListener('click', () => this.handleGuestMode());
    this.watchDemoBtn?.addEventListener('click', () => this.handleWatchDemo());

    // Contact form
    document.querySelector('#contact form')?.addEventListener('submit', (e) => this.handleContactForm(e));

    // Auto-fill demo credentials
    this.setupDemoCredentials();

    // Smooth scrolling for navigation
    this.setupSmoothScrolling();
  }

  openModal(modal) {
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.addModalAnimation(modal);
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  addModalAnimation(modal) {
    const modalContent = modal.querySelector('.glass-card');
    if (modalContent) {
      modalContent.style.transform = 'scale(0.9) translateY(20px)';
      modalContent.style.opacity = '0';
      
      requestAnimationFrame(() => {
        modalContent.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        modalContent.style.transform = 'scale(1) translateY(0)';
        modalContent.style.opacity = '1';
      });
    }
  }

  // ==================== FORM HANDLING ====================

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    // Validate demo credentials
    if (email === 'demo@aiagentstudio.com' && password === 'Demo123!') {
      this.showSuccess('Login successful! Redirecting to home...');
      this.closeModal(this.loginModal);
      setTimeout(() => {
        this.showLoading();
        setTimeout(() => {
          window.location.href = './home.html';
        }, 2000);
      }, 1000);
    } else {
      this.showError('Invalid credentials. Please try the demo credentials provided.');
      this.shakeForm(document.getElementById('loginForm'));
    }
  }

  handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName')?.value;
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value;
    
    // Validation
    if (password !== confirmPassword) {
      this.showError('Passwords do not match!');
      this.shakeForm(document.getElementById('signupForm'));
      return;
    }
    
    if (password.length < 6) {
      this.showError('Password must be at least 6 characters long!');
      this.shakeForm(document.getElementById('signupForm'));
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showError('Please enter a valid email address!');
      this.shakeForm(document.getElementById('signupForm'));
      return;
    }
    
    this.showSuccess(`Welcome ${name}! Account created successfully. Redirecting...`);
    this.closeModal(this.signupModal);
    setTimeout(() => {
      this.showLoading();
      setTimeout(() => {
        window.location.href = './home.html';
      }, 2000);
    }, 1000);
  }

  handleGuestMode() {
    this.showSuccess('Entering guest mode...');
    setTimeout(() => {
      this.showLoading();
      setTimeout(() => {
        window.location.href = './home.html?guest=true';
      }, 2000);
    }, 1000);
  }

  handleWatchDemo() {
    this.showSuccess('Demo video coming soon! For now, try the interactive demo.');
    setTimeout(() => {
      this.openModal(this.signupModal);
    }, 2000);
  }

  handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    this.showSuccess('Message sent! We\'ll get back to you within 24 hours.');
    form.reset();
    
    // Add form submission animation
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sent! ✓';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  setupDemoCredentials() {
    const loginEmail = document.getElementById('loginEmail');
    if (loginEmail) {
      loginEmail.addEventListener('focus', function() {
        if (!this.value) {
          setTimeout(() => {
            this.value = 'demo@aiagentstudio.com';
            const passwordField = document.getElementById('loginPassword');
            if (passwordField) {
              passwordField.value = 'Demo123!';
            }
          }, 500);
        }
      });
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  shakeForm(form) {
    if (form) {
      form.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        form.style.animation = '';
      }, 500);
    }
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    const notificationId = type === 'success' ? 'successMessage' : 'errorMessage';
    const textId = type === 'success' ? 'successText' : 'errorText';
    
    const notification = document.getElementById(notificationId);
    const textElement = document.getElementById(textId);
    
    if (notification && textElement) {
      textElement.textContent = message;
      notification.classList.remove('hidden');
      
      // Add entrance animation
      notification.style.transform = 'translateX(100%)';
      notification.style.transition = 'transform 0.3s ease-out';
      
      requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
      });
      
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          notification.classList.add('hidden');
        }, 300);
      }, 4000);
    }
  }

  showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('hidden');
    }
  }

  // ==================== ANIMATIONS & EFFECTS ====================

  initializeAnimations() {
    // Staggered entrance animations
    const animatedElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .fade-in-up');
    animatedElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
    });

    // Initialize hover effects
    this.setupHoverEffects();
    
    // Initialize typing effect
    this.setupTypingEffect();
  }

  setupHoverEffects() {
    document.querySelectorAll('.hover-lift').forEach(element => {
      element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-12px) scale(1.02)';
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      });
      
      element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', this.createRippleEffect);
    });
  }

  createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupTypingEffect() {
    const terminal = document.querySelector('.loading-dots');
    if (terminal) {
      const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              this.typeWriter(terminal, 'Processing your morning emails... ✓ Complete!', 80);
            }, 1000);
            terminalObserver.unobserve(entry.target);
          }
        });
      });
      terminalObserver.observe(terminal);
    }
  }

  typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    const type = () => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    type();
  }

  // ==================== INTERSECTION OBSERVERS ====================

  setupIntersectionObservers() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all cards for entrance animations
    document.querySelectorAll('.glass-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease-out';
      observer.observe(card);
    });

    // Counter animation
    this.setupCounterAnimations();
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }

  // ==================== PARALLAX EFFECTS ====================

  setupParallaxEffects() {
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      
      document.querySelectorAll('.float-animation').forEach((element, index) => {
        element.style.transform = `translateY(${rate + (index * 10)}px) rotate(${scrolled * 0.02}deg)`;
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  // ==================== SMOOTH SCROLLING ====================

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ==================== EASTER EGGS ====================

  setupEasterEggs() {
    // Konami Code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

    document.addEventListener('keydown', (e) => {
      konamiCode.push(e.code);
      if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
      }
      
      if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        this.activateKonamiCode();
        konamiCode = [];
      }
    });

    // Secret click combination
    this.setupSecretClicks();
  }

  activateKonamiCode() {
    this.showSuccess('🎉 Konami Code activated! You found the easter egg!');
    document.body.style.filter = 'hue-rotate(180deg)';
    document.body.style.transition = 'filter 0.5s ease';
    
    // Create confetti effect
    this.createConfetti();
    
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 3000);
  }

  setupSecretClicks() {
    let clickCount = 0;
    const logo = document.querySelector('.hero-gradient');
    
    if (logo) {
      logo.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 7) {
          this.showSuccess('🎨 Color mode activated!');
          this.activateColorMode();
          clickCount = 0;
        }
      });
    }
  }

  activateColorMode() {
    const colors = ['hue-rotate(60deg)', 'hue-rotate(120deg)', 'hue-rotate(180deg)', 'hue-rotate(240deg)', 'hue-rotate(300deg)'];
    let colorIndex = 0;
    
    const colorInterval = setInterval(() => {
      document.body.style.filter = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length;
    }, 500);
    
    setTimeout(() => {
      clearInterval(colorInterval);
      document.body.style.filter = 'none';
    }, 5000);
  }

  createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
          position: fixed;
          top: -10px;
          left: ${Math.random() * 100}vw;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          animation: confetti-fall 3s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
          confetti.remove();
        }, 3000);
      }, i * 50);
    }
  }

  // ==================== PERFORMANCE MONITORING ====================

  initPerformanceMonitoring() {
    // Monitor loading performance
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    });

    // Monitor animation performance
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = (currentTime) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        console.log('FPS:', Math.round(frameCount * 1000 / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFPS);
    };
    
    if (window.location.search.includes('debug=true')) {
      requestAnimationFrame(measureFPS);
    }
  }
}

// ==================== CSS ANIMATIONS (to be added to your CSS) ====================
const additionalCSS = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }

  .glass-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .notification-enter {
    transform: translateX(100%);
  }

  .notification-enter-active {
    transform: translateX(0);
    transition: transform 0.3s ease-out;
  }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new AIAgentStudio();
  
  // Add performance monitoring in debug mode
  if (window.location.search.includes('debug=true')) {
    app.initPerformanceMonitoring();
  }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIAgentStudio;
}