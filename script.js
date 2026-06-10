const passwordDisplay = document.getElementById('passwordDisplay');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lengthNum = document.getElementById('lengthNum');
const chkUpper = document.getElementById('chkUpper');
const chkLower = document.getElementById('chkLower');
const chkNumber = document.getElementById('chkNumber');
const chkSymbol = document.getElementById('chkSymbol');
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

// sync slider & number input
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

// character pools
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function getPool() {
  let pool = '';
  if (chkUpper.checked) pool += upper;
  if (chkLower.checked) pool += lower;
  if (chkNumber.checked) pool += numbers;
  if (chkSymbol.checked) pool += symbols;
  return pool;
}

// make sure at least one thing is checked
function validateCheckboxes() {
  const anyChecked = chkUpper.checked || chkLower.checked || chkNumber.checked || chkSymbol.checked;
  if (!anyChecked) {
    chkLower.checked = true;
  }
}

[chkUpper, chkLower, chkNumber, chkSymbol].forEach(cb => {
  cb.addEventListener('change', () => {
    validateCheckboxes();
  });
});

// generate password
function generate() {
  validateCheckboxes();
  const pool = getPool();
  const len = parseInt(lengthNum.value) || 16;
  let password = '';

  // guarantee at least one char from each checked pool
  const checks = [];
  if (chkUpper.checked) checks.push(upper);
  if (chkLower.checked) checks.push(lower);
  if (chkNumber.checked) checks.push(numbers);
  if (chkSymbol.checked) checks.push(symbols);

  for (const chars of checks) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  // fill the rest
  for (let i = password.length; i < len; i++) {
    password += pool[Math.floor(Math.random() * pool.length)];
  }

  // shuffle using Fisher-Yates
  const arr = password.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  password = arr.join('');

  passwordDisplay.value = password;
  updateStrength(len, checks.length);
}

// strength estimation
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

// copy to clipboard
copyBtn.addEventListener('click', async () => {
  if (!passwordDisplay.value) return;
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
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
});

generateBtn.addEventListener('click', generate);

generate();
