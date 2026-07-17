document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initTypingAnimation();
  initMouseGlow();
  initCardHoverEffects();
  initScrollReveal();
  initButtonRipples();
  initFormValidation();
  initBackToTop();
});

/* 1. Loading Screen & Percentage Counter */
function initLoader() {
  const loader = document.getElementById('loading-screen');
  const percentText = document.querySelector('.loader-percent');
  const loaderBar = document.querySelector('.loader-bar');
  
  if (!loader || !percentText || !loaderBar) return;

  document.body.classList.add('loading');
  
  let progress = 0;
  const duration = 2000; // 2 seconds loader duration
  const intervalTime = 20; // Upwards ticks every 20ms
  const step = 100 / (duration / intervalTime);

  const timer = setInterval(() => {
    progress += step;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      
      // Complete loading animation
      setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.classList.remove('loading');
      }, 300);
    }
    
    const displayVal = Math.floor(progress);
    percentText.textContent = `${displayVal}%`;
    loaderBar.style.width = `${displayVal}%`;
  }, intervalTime);
}

/* 2. Sticky Navbar, Scroll Progress & Mobile Menu */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const scrollProgress = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (!navbar) return;

  let lastScrollTop = 0;
  const scrollThreshold = 50;

  // Scroll Actions: Sticky navbar, hide/show, progress indicator
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 1. Scroll Progress Bar Update
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (windowHeight > 0) {
      const scrollPercentage = (scrollTop / windowHeight) * 100;
      if (scrollProgress) {
        scrollProgress.style.width = `${scrollPercentage}%`;
      }
    }

    // 2. Add border/background when scrolled
    if (scrollTop > 20) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }

    // 3. Hide on scroll down, show on scroll up
    if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });

  // Mobile Drawer Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('loading'); // Prevent background scroll when menu is active
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('loading');
      }
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('loading');
      });
    });
  }

  // Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.parentElement.classList.add('active');
          } else {
            link.parentElement.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.35, rootMargin: "-80px 0px -20% 0px" });

  sections.forEach(section => activeLinkObserver.observe(section));
}

/* 3. Typing Animation (Hero Section) */
function initTypingAnimation() {
  const typingSpan = document.querySelector('.hero-typewriter');
  if (!typingSpan) return;

  const words = ['Frontend Developer', 'JavaScript Developer', 'Responsive Web Developer'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 150; // Typing speed

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      delay = 60; // Deleting speed
    } else {
      typingSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      delay = 120; // Typing speed
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      delay = 1800; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400; // Pause before typing next word
    }

    setTimeout(type, delay);
  }

  // Start typing loop
  setTimeout(type, 1000);
}

/* 4. Mouse Glow Interactive Background */
function initMouseGlow() {
  const canvas = document.getElementById('mouse-glow-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  function drawGlow() {
    // Smooth lerp movement
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    ctx.clearRect(0, 0, width, height);

    // Dynamic gradient glow following cursor
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
    gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.03)');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(drawGlow);
  }

  drawGlow();
}

/* 5. Card Hover Effects: 3D Tilt & Interactive Light Beam */
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.premium-card');

  cards.forEach(card => {
    // 1. Mouse Move for Glow positioning
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 2. 3D Tilt calculation
      const width = rect.width;
      const height = rect.height;
      
      const centerX = rect.left + width / 2;
      const centerY = rect.top + height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Max tilt angle
      const maxTilt = 6; 
      const rotateX = -((mouseY / height) * maxTilt).toFixed(2);
      const rotateY = ((mouseX / width) * maxTilt).toFixed(2);
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    // Reset when mouse leaves
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* 6. Scroll Reveal Animation & Progress Fill */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-element');
  const skillFills = document.querySelectorAll('.skill-progress-fill');
  const learningFill = document.querySelector('.learning-progress-fill');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // Trigger only once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(element => revealObserver.observe(element));

  // Trigger skill progress fills when skill section is in view
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillFills.forEach(fill => {
            const percent = fill.getAttribute('data-percent');
            fill.style.width = `${percent}%`;
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsSection);
  }

  // Trigger currently learning progress fill
  const learningSection = document.getElementById('learning');
  if (learningSection && learningFill) {
    const learningObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const percent = learningFill.getAttribute('data-percent');
          learningFill.style.width = `${percent}%`;
          learningObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    learningObserver.observe(learningSection);
  }
}

/* 7. Button Click Ripples */
function initButtonRipples() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* 8. Contact Form Validation & Toast Feedback */
function initFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input');
  
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        input.classList.remove('is-invalid');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    inputs.forEach(input => {
      const value = input.value.trim();
      const name = input.getAttribute('name');

      if (value === '') {
        input.classList.add('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.textContent = 'This field is required.';
        }
        isValid = false;
      } else if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          input.classList.add('is-invalid');
          const feedback = input.nextElementSibling;
          if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = 'Please enter a valid email address.';
          }
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }
      } else if (value.length < 3) {
        input.classList.add('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.textContent = 'Must be at least 3 characters.';
        }
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      }
    });

    if (isValid) {
      showToast('Thank you! Your message was sent successfully.');
      form.reset();
      inputs.forEach(input => {
        input.classList.remove('is-valid');
      });
    }
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast toast-success';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* 9. Back To Top Button */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
