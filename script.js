const themeToggle = document.getElementById('themeToggle');
const passwordDisplay = document.getElementById('passwordDisplay');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lengthNum = document.getElementById('lengthNum');
const chkUpper = document.getElementById('chkUpper');
const chkLower = document.getElementById('chkLower');
const chkNumber = document.getElementById('chkNumber');
const chkSymbol = document.getElementById('chkSymbol');
const chkAutoCopy = document.getElementById('chkAutoCopy');
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');
const historyList = document.getElementById('historyList');

const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

let history = [];

lengthSlider.addEventListener('input', () => {
  lengthNum.value = lengthSlider.value;
});

lengthNum.addEventListener('input', () => {
  let v = parseInt(lengthNum.value) || 6;
  if (v < 6) v = 6;
  if (v > 64) v = 64;
  lengthNum.value = v;
  lengthSlider.value = v;
});

function getPool() {
  let pool = '';
  if (chkUpper.checked) pool += upper;
  if (chkLower.checked) pool += lower;
  if (chkNumber.checked) pool += numbers;
  if (chkSymbol.checked) pool += symbols;
  return pool;
}

function validateCheckboxes() {
  const anyChecked = chkUpper.checked || chkLower.checked || chkNumber.checked || chkSymbol.checked;
  if (!anyChecked) {
    chkLower.checked = true;
  }
}

[chkUpper, chkLower, chkNumber, chkSymbol].forEach(cb => {
  cb.addEventListener('change', validateCheckboxes);
});

function updateStrength(len, types) {
  let score = 0;
  if (len >= 8) score++;
  if (len >= 12) score++;
  if (len >= 16) score++;
  if (types >= 2) score++;
  if (types >= 3) score++;
  if (types === 4) score++;

  let pct, label, color;
  if (score <= 2) {
    pct = 25; label = 'weak'; color = '#ef4444';
  } else if (score <= 4) {
    pct = 55; label = 'okay'; color = '#f59e0b';
  } else {
    pct = 100; label = 'strong'; color = '#22c55e';
  }

  strengthFill.style.width = pct + '%';
  strengthFill.style.background = color;
  strengthLabel.textContent = label;
}

async function copyToClipboard(text) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = '✅';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = '📋';
      copyBtn.classList.remove('copied');
    }, 1500);
  } catch {
    passwordDisplay.select();
    document.execCommand('copy');
    copyBtn.textContent = '✅';
    setTimeout(() => {
      copyBtn.textContent = '📋';
    }, 1500);
  }
}

function renderHistory() {
  historyList.innerHTML = '';
  history.forEach(pwd => {
    const btn = document.createElement('button');
    btn.textContent = pwd;
    btn.addEventListener('click', () => usePassword(pwd));
    historyList.appendChild(btn);
  });
}

function addToHistory(pwd) {
  if (history.includes(pwd)) return;
  history.unshift(pwd);
  if (history.length > 10) history.pop();
  renderHistory();
}

function usePassword(pwd) {
  passwordDisplay.value = pwd;
  let types = 0;
  if (/[A-Z]/.test(pwd)) types++;
  if (/[a-z]/.test(pwd)) types++;
  if (/[0-9]/.test(pwd)) types++;
  if (/[^A-Za-z0-9]/.test(pwd)) types++;
  updateStrength(pwd.length, types);
}

function generate() {
  validateCheckboxes();
  const pool = getPool();
  const len = parseInt(lengthNum.value) || 16;
  let password = '';

  const checks = [];
  if (chkUpper.checked) checks.push(upper);
  if (chkLower.checked) checks.push(lower);
  if (chkNumber.checked) checks.push(numbers);
  if (chkSymbol.checked) checks.push(symbols);

  for (const chars of checks) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  for (let i = password.length; i < len; i++) {
    password += pool[Math.floor(Math.random() * pool.length)];
  }

  const arr = password.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  password = arr.join('');

  passwordDisplay.value = password;
  updateStrength(len, checks.length);
  addToHistory(password);

  if (chkAutoCopy.checked) {
    copyToClipboard(password);
  }
}

copyBtn.addEventListener('click', () => copyToClipboard(passwordDisplay.value));

generateBtn.addEventListener('click', generate);

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  if (isDark) {
    html.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
});

generate();
