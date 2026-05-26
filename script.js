// ── Loader ──
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loader').classList.add('hide');
      }, 1800);
    });

    // ── Custom Cursor ──
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });
    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; ring.style.width = '60px'; ring.style.height = '60px'; ring.style.borderColor = 'rgba(184,188,0,0.8)'; });
      el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; ring.style.width = '40px'; ring.style.height = '40px'; ring.style.borderColor = 'rgba(184,188,0,0.5)'; });
    });

    // ── Navbar ──
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('open');
    }));

    // ── Reveal on scroll ──
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    // ── Chatbot ──
    const RESPONSES = [
      { keywords: ['signal', 's.i.g.n.a.l', 'framework', 'methodology'], answer: `The S.I.G.N.A.L Framework is our proprietary methodology that identifies your natural skill patterns and maps them to the right career path.<br><br>It goes beyond generic advice — it decodes <b>who you are</b> so you can make confident, well-aligned career decisions. 🎯<br><br><button onclick="restartChat()" class="restart-btn">Restart</button>` },
      { keywords: ['who is this service for', 'service', 'student', 'professional'], answer: `Designed for:<br><br>• Students unsure about the right career path<br>• Graduates feeling overwhelmed by choices<br>• Working professionals seeking better alignment<br>• Anyone planning a career switch<br><br><button onclick="restartChat()" class="restart-btn">Restart</button>` },
      { keywords: ['price', 'pricing', 'cost', 'how much', '$14.99','14.99', 'fee', 'charge'], answer: `The Skill Assessment is just <b>$14.99</b> — a one-time investment that gives you clarity most people spend years searching for.<br><br><a href='https://topmate.io/decodes/2082631' target='_blank' style='color:var(--olive-glow)'>topmate.io/decodes →</a><br><br><button onclick="restartChat()" class="restart-btn">Restart</button>` },
      { keywords: ['payment', 'after', 'next step'], answer: `After payment, you'll receive an instant confirmation with access to your questionnaire.<br><br>Fill the pre-assessment form, then the S.I.G.N.A.L Assessment form — and you're all set! 🙌<br><br><button onclick="restartChat()" class="restart-btn">Restart</button>` },
      { keywords: ['test', 'tests', 'get', 'access', 'book'], answer: `<b>Skill Assessment:</b><br><a href='https://topmate.io/decodes/2082631' target='_blank' style='color:var(--olive-glow)'>Book Here →</a><br><br><b>Skill Assessment for Institutions & Employers</b><br><a href='https://topmate.io/decodes/2083915' target='_blank' style='color:var(--olive-glow)'>Book Here →</a><br><br><button onclick="restartChat()" class="restart-btn">Restart</button>` },
      { keywords: ['hi', 'hello', 'hey'], answer: `Hey there! 👋<br><br>Ask me about:<br>• Skill Assessment<br>• S.I.G.N.A.L Framework<br>• Skill Assessment for Institutions & Employers<br><br><button onclick="restartChat()" class="restart-btn">Restart</button>` }
    ];
    const FALLBACK = `I'm not sure about that. Visit our <a href='contact.html' style='color:var(--olive-glow)'>Contact Page</a> and we'll help you personally. 🙏<br><br><button onclick="restartChat()" class="restart-btn">Restart</button>`;

    const launcher = document.getElementById('chat-launcher');
    const chatWindow = document.getElementById('chat-window');
    const inputEl = document.getElementById('chat-input');
    const messagesEl = document.getElementById('chat-messages');
    const suggestEl = document.getElementById('chat-suggestions');
    let isOpen = false, typingEl = null;

    launcher.addEventListener('click', () => {
      isOpen = !isOpen;
      chatWindow.classList.toggle('open', isOpen);
      launcher.innerHTML = isOpen
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
      if (isOpen && messagesEl.children.length === 0)
        addMessage('bot', "Hey! 👋 I'm the Darsh. Ask me anything about our services.");
    });
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });

    function askQuestion(btn) {
      const text = btn.textContent.replace('→','').trim();
      suggestEl.style.display = 'none';
      handleChat(text);
    }
    function sendChatMessage() {
      const text = inputEl.value.trim();
      if (!text) return;
      inputEl.value = '';
      suggestEl.style.display = 'none';
      handleChat(text);
    }
    function handleChat(text) {
      addMessage('user', text);
      showTyping();
      setTimeout(() => { removeTyping(); addMessage('bot', getResponse(text)); }, 700);
    }
    function getResponse(text) {
      const lower = text.toLowerCase();
      for (const item of RESPONSES) if (item.keywords.some(kw => lower.includes(kw))) return item.answer;
      return FALLBACK;
    }
    function addMessage(role, html) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const div = document.createElement('div');
      div.className = `chat-msg ${role}`;
      div.innerHTML = role === 'bot'
        ? `<div class="chat-mini-avatar">🎯</div><div><div class="chat-bubble">${html}</div><div class="chat-msg-time">${now}</div></div>`
        : `<div><div class="chat-bubble">${html}</div><div class="chat-msg-time" style="text-align:right">${now}</div></div>`;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    function showTyping() {
      typingEl = document.createElement('div');
      typingEl.className = 'chat-msg bot';
      typingEl.innerHTML = `<div class="chat-mini-avatar">🎯</div><div class="chat-bubble" style="padding:10px 14px"><div class="chat-typing"><span></span><span></span><span></span></div></div>`;
      messagesEl.appendChild(typingEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    function removeTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }
    function restartChat() {
      messagesEl.innerHTML = '';
      suggestEl.style.display = 'flex';
      addMessage('bot', "Hey! 👋 I'm the Darsh. Ask me anything about our services.");
    }