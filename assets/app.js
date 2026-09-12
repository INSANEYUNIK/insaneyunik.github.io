// ==========================================
// 1. PARTICLES BACKGROUND CANVAS
// ==========================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let particles = [];
let mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

// ==========================================
// MOUSE SPOTLIGHT EFFECT
// ==========================================
const spotlight = document.getElementById('mouse-spotlight');
let spotlightActive = false;

window.addEventListener('mousemove', (e) => {
  if (!spotlight) return;

  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;

  spotlight.style.setProperty('--mouse-x', `${x}%`);
  spotlight.style.setProperty('--mouse-y', `${y}%`);

  if (!spotlightActive) {
    spotlightActive = true;
    spotlight.style.opacity = '1';
  }
});

window.addEventListener('mouseleave', () => {
  if (spotlight) {
    spotlightActive = false;
    spotlight.style.opacity = '0';
  }
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
    this.color = Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(236, 72, 153, 0.4)';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

    // Mouse interaction
    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const directionX = dx / distance;
        const directionY = dy / distance;
        this.x -= directionX * force * 3;
        this.y -= directionY * force * 3;
      }
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 80);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 110) {
        const opacity = (1 - distance / 110) * 0.2;
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  connectParticles();
  requestAnimationFrame(animateParticles);
}

if (canvas) {
  initParticles();
  animateParticles();
}

// ==========================================
// 2. MOBILE MENU TOGGLE
// ==========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// ==========================================
// 3. ABOUT CIRCULAR BUTTONS INTERACTION
// ==========================================
const circleQuotes = {
  Developer: "💻 Turning coffee into clean, working code since day one!",
  Designer: "🎨 Obsessed with sleek UI, gorgeous gradients & smooth UX.",
  Creator: "⚡ Building cool experiments, games, and web apps for fun!"
};

document.querySelectorAll('.circle-item').forEach(item => {
  item.addEventListener('click', () => {
    const label = item.querySelector('.circle-label').textContent;
    const quote = circleQuotes[label] || `✨ You clicked ${label}!`;

    // Visual bounce
    item.style.transform = 'scale(1.15) rotate(8deg)';
    setTimeout(() => {
      item.style.transform = '';
    }, 300);

    // Create floating message toast
    showToast(quote);
  });
});

function showToast(message) {
  let toast = document.getElementById('fun-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fun-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.background = 'var(--surface)';
    toast.style.color = 'var(--text)';
    toast.style.padding = '14px 24px';
    toast.style.borderRadius = '999px';
    toast.style.border = '2px solid var(--primary)';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
    toast.style.zIndex = '10000';
    toast.style.fontWeight = '600';
    toast.style.fontSize = '0.95rem';
    toast.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    toast.style.pointerEvents = 'none';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 2800);
}

// ==========================================
// 4. FEATURED INTERACTIVE PROJECTS
// ==========================================
const projects = [
  {
    id: "calc",
    title: "Mini Calculator",
    emoji: "🧮",
    description: "A fully working pocket calculator built right into the card. Try doing some math!",
    tags: ["JavaScript", "Interactive", "Math"],
    status: "Playable",
    widget: `
      <div class="interactive-widget">
        <input type="text" class="calc-display" id="calc-display" value="0" readonly />
        <div class="calc-grid">
          <button class="calc-btn" onclick="calcInput('C')">C</button>
          <button class="calc-btn" onclick="calcInput('/')">/</button>
          <button class="calc-btn" onclick="calcInput('*')">×</button>
          <button class="calc-btn op" onclick="calcInput('DEL')">⌫</button>
          <button class="calc-btn" onclick="calcInput('7')">7</button>
          <button class="calc-btn" onclick="calcInput('8')">8</button>
          <button class="calc-btn" onclick="calcInput('9')">9</button>
          <button class="calc-btn op" onclick="calcInput('-')">-</button>
          <button class="calc-btn" onclick="calcInput('4')">4</button>
          <button class="calc-btn" onclick="calcInput('5')">5</button>
          <button class="calc-btn" onclick="calcInput('6')">6</button>
          <button class="calc-btn op" onclick="calcInput('+')">+</button>
          <button class="calc-btn" onclick="calcInput('1')">1</button>
          <button class="calc-btn" onclick="calcInput('2')">2</button>
          <button class="calc-btn" onclick="calcInput('3')">3</button>
          <button class="calc-btn op" onclick="calcEqual()">=</button>
          <button class="calc-btn" style="grid-column: span 2" onclick="calcInput('0')">0</button>
          <button class="calc-btn" style="grid-column: span 2" onclick="calcInput('.')">.</button>
        </div>
      </div>
    `
  },
  {
    id: "guesser",
    title: "Number Guesser",
    emoji: "🎲",
    description: "I'm thinking of a secret number between 1 and 100. Can you guess it?",
    tags: ["Game", "Logic", "State"],
    status: "Playable",
    widget: `
      <div class="interactive-widget guesser-container">
        <div class="guesser-hint" id="guesser-hint">🤔 Enter a guess (1-100)...</div>
        <div class="guesser-input-row">
          <input type="number" class="guesser-input" id="guesser-input" min="1" max="100" placeholder="e.g. 42" />
          <button class="guesser-btn" onclick="checkGuess()">Guess</button>
          <button class="calc-btn" onclick="resetGuesser()" title="New Game">🔄</button>
        </div>
      </div>
    `
  },
  {
    id: "jokes",
    title: "Dad Joke Generator",
    emoji: "😂",
    description: "Need a quick laugh or an eye-roll? Generate curated developer & dad jokes on demand.",
    tags: ["Humor", "API", "Fun"],
    status: "Interactive",
    widget: `
      <div class="interactive-widget">
        <div class="widget-output" id="joke-output">Why do programmers prefer dark mode? Because light attracts bugs! 🐛</div>
        <button class="widget-action-btn" onclick="nextJoke()">🎲 Tell Me Another</button>
      </div>
    `
  },
  {
    id: "clicker",
    title: "Click Speed Test",
    emoji: "⚡",
    description: "How fast can you click in 5 seconds? Test your reflexes and set a high score!",
    tags: ["Game", "Speed", "Timer"],
    status: "Playable",
    widget: `
      <div class="interactive-widget">
        <div class="widget-output" id="clicker-output">Ready? Click Start to begin!</div>
        <button class="widget-action-btn" id="clicker-btn" onclick="handleClicker()">🚀 Start 5s Test</button>
      </div>
    `
  },
  {
    id: "mood",
    title: "Mood Tracker",
    emoji: "😊",
    description: "Track your coding vibe. Click your current mood to see your dev energy level!",
    tags: ["React", "State", "Vibes"],
    status: "Interactive",
    widget: `
      <div class="interactive-widget">
        <div class="widget-output" id="mood-output">Current Vibe: Ready to build cool stuff 🚀</div>
        <div style="display: flex; gap: 8px; justify-content: center; margin-top: 8px;">
          <button class="calc-btn" onclick="setMood('☕ High Caffeine', 'Supercharged and ready to code!')">☕</button>
          <button class="calc-btn" onclick="setMood('🔥 In The Zone', 'Unstoppable flow state!')">🔥</button>
          <button class="calc-btn" onclick="setMood('🐛 Bug Hunting', 'Searching for that missing semicolon...')">🐛</button>
          <button class="calc-btn" onclick="setMood('😴 Sleepy', 'Need coffee immediately!')">😴</button>
        </div>
      </div>
    `
  },
  {
    id: "excuse",
    title: "Dev Excuse Generator",
    emoji: "🤷‍♂️",
    description: "When code doesn't work, blame something else with AI-grade developer excuses.",
    tags: ["Humor", "DevLife"],
    status: "Interactive",
    widget: `
      <div class="interactive-widget">
        <div class="widget-output" id="excuse-output">"It works on my machine!" 💻</div>
        <button class="widget-action-btn" onclick="nextExcuse()">🔄 Generate Excuse</button>
      </div>
    `
  }
];

// Render projects
function renderProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  const projectsHTML = projects.map(project => `
    <div class="project-card">
      <div class="project-image">${project.emoji}</div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
        <span class="project-status">✨ ${project.status}</span>
        ${project.widget || ''}
      </div>
    </div>
  `).join('');

  projectsGrid.innerHTML = projectsHTML;
}

// ==========================================
// 5. MINI CALCULATOR LOGIC
// ==========================================
let calcState = '0';

window.calcInput = function(val) {
  const display = document.getElementById('calc-display');
  if (!display) return;

  if (val === 'C') {
    calcState = '0';
  } else if (val === 'DEL') {
    calcState = calcState.length > 1 ? calcState.slice(0, -1) : '0';
  } else {
    if (calcState === '0' && !isNaN(val)) {
      calcState = val;
    } else {
      calcState += val;
    }
  }
  display.value = calcState;
};

window.calcEqual = function() {
  const display = document.getElementById('calc-display');
  if (!display) return;

  try {
    // Sanitized math calculation
    const sanitized = calcState.replace(/[^0-9+\-*/.]/g, '');
    const result = Function(`'use strict'; return (${sanitized})`)();
    calcState = String(Number(result.toFixed(6)));
    display.value = calcState;
  } catch (e) {
    display.value = 'Error';
    calcState = '0';
  }
};

// ==========================================
// 6. RANDOM NUMBER GUESSER LOGIC
// ==========================================
let secretNumber = Math.floor(Math.random() * 100) + 1;
let guessAttempts = 0;

window.checkGuess = function() {
  const input = document.getElementById('guesser-input');
  const hint = document.getElementById('guesser-hint');
  if (!input || !hint) return;

  const val = parseInt(input.value, 10);
  if (isNaN(val) || val < 1 || val > 100) {
    hint.textContent = "⚠️ Enter a number between 1 and 100!";
    hint.style.color = "var(--warning)";
    return;
  }

  guessAttempts++;

  if (val === secretNumber) {
    hint.textContent = `🎉 WOW! You guessed ${secretNumber} in ${guessAttempts} tries!`;
    hint.style.color = "var(--success)";
    showToast(`🏆 Number Guesser Champion! Tries: ${guessAttempts}`);
  } else if (val < secretNumber) {
    hint.textContent = `📈 Too low! (${val}) Try higher! ⬆️`;
    hint.style.color = "var(--primary)";
  } else {
    hint.textContent = `📉 Too high! (${val}) Try lower! ⬇️`;
    hint.style.color = "var(--secondary)";
  }
  input.value = '';
  input.focus();
};

window.resetGuesser = function() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  guessAttempts = 0;
  const hint = document.getElementById('guesser-hint');
  if (hint) {
    hint.textContent = "🔄 New secret number generated (1-100)!";
    hint.style.color = "var(--text)";
  }
};

// ==========================================
// 7. DAD JOKES LOGIC
// ==========================================
const jokesList = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "There are 10 types of people: those who understand binary, and those who don't. 🤖",
  "Why did the developer go broke? Because they used up all their cache! 💸",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍺",
  "Why do Java programmers have to wear glasses? Because they don't C#! 👓",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
  "Real programmers count from 0. 🔢"
];

let jokeIndex = 0;
window.nextJoke = function() {
  jokeIndex = (jokeIndex + 1) % jokesList.length;
  const output = document.getElementById('joke-output');
  if (output) output.textContent = jokesList[jokeIndex];
};

// ==========================================
// 8. CLICK SPEED TEST LOGIC
// ==========================================
let clickCount = 0;
let clickTimer = null;
let isTesting = false;

window.handleClicker = function() {
  const btn = document.getElementById('clicker-btn');
  const output = document.getElementById('clicker-output');
  if (!btn || !output) return;

  if (!isTesting) {
    // Start game
    isTesting = true;
    clickCount = 0;
    btn.textContent = "🔥 CLICK ME FAST!";
    output.textContent = "⏳ 5 seconds left... Clicks: 0";

    let timeLeft = 5;
    clickTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        output.textContent = `⏳ ${timeLeft}s left... Clicks: ${clickCount}`;
      } else {
        clearInterval(clickTimer);
        isTesting = false;
        const cps = (clickCount / 5).toFixed(1);
        output.textContent = `🏆 Score: ${clickCount} clicks (${cps} CPS)!`;
        btn.textContent = "🔄 Try Again";
        showToast(`⚡ High Speed: ${clickCount} clicks in 5s!`);
      }
    }, 1000);
  } else {
    // Increment click
    clickCount++;
    output.textContent = `🔥 Clicks: ${clickCount}!`;
  }
};

// ==========================================
// 9. MOOD & EXCUSE LOGIC
// ==========================================
window.setMood = function(mood, desc) {
  const output = document.getElementById('mood-output');
  if (output) {
    output.textContent = `${mood}: ${desc}`;
  }
};

const excuses = [
  '"It works on my machine!" 💻',
  '"That\'s not a bug, it\'s an undocumented feature!" 🪄',
  '"Someone must have pushed to main without testing!" 🤦‍♂️',
  '"It was working yesterday before the update!" 📅',
  '"The API docs were lying to me!" 📜',
  '"I blame solar flares and cosmic radiation." ☀️'
];
let excuseIdx = 0;
window.nextExcuse = function() {
  excuseIdx = (excuseIdx + 1) % excuses.length;
  const output = document.getElementById('excuse-output');
  if (output) output.textContent = excuses[excuseIdx];
};

// ==========================================
// 10. SMOOTH SCROLLING & OBSERVER
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
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

// Observe sections for fade in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// Update footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Initialize all projects
renderProjects();

// ==========================================
// EMAIL HANDLER WITH FALLBACK
// ==========================================
const emailBtn = document.getElementById('email-action-btn');
if (emailBtn) {
  emailBtn.addEventListener('click', function(e) {
    const email = 'INSANEYUNIK@GMAIL.COM';
    const subject = 'Hello Yunik';
    const body = "Hi Yunik,%0A%0AI'd like to get in touch!";
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    // Try native mailto first
    window.location.href = mailtoLink;

    // Fallback: Show options if mailto isn't configured
    setTimeout(() => {
      const wantsWebmail = confirm(
        "If your email client didn't open, would you like to use Gmail web instead?\n\n" +
        "Click OK for Gmail web, or Cancel to copy the email address."
      );

      if (wantsWebmail) {
        // Open Gmail web compose
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent('Hello Yunik')}&body=${encodeURIComponent("Hi Yunik,\n\nI'd like to get in touch!")}`;
        window.open(gmailUrl, '_blank');
      } else {
        // Copy email to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(() => {
            showToast(`📋 Email copied: ${email}`);
          }).catch(() => {
            showToast(`📧 Email: ${email}`);
          });
        } else {
          showToast(`📧 Email: ${email}`);
        }
      }
    }, 1500);

    e.preventDefault();
  });
}
