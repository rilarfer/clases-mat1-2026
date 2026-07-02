// Web Application Logic for Student Grades Portal with Client-Side Decryption

// Configuration for Maximum Scores
const MAX_SCORES = {
  acumulado1: 35,
  examen1: 15,
  acumulado2: 35,
  examen2: 15,
  notaFinal: 100
};

const PASSING_SCORE = 60;

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const emailInput = document.getElementById('student-email');
  const queryForm = document.getElementById('query-form');
  const queryView = document.getElementById('query-view');
  const resultsView = document.getElementById('results-view');
  const errorMsg = document.getElementById('error-msg');
  const searchBtn = document.getElementById('search-btn');
  const searchBtnText = document.getElementById('search-btn-text');
  const searchBtnSpinner = document.getElementById('search-spinner');
  
  // Results view elements
  const studentNameEl = document.getElementById('student-name');
  const studentEmailEl = document.getElementById('student-email-display');
  const statusBadge = document.getElementById('status-badge');
  const statusText = document.getElementById('status-text');
  const btnBack = document.getElementById('btn-back');
  
  // Score elements
  const finalScoreNum = document.getElementById('final-score-num');
  const finalCircleProgress = document.querySelector('.circle-progress');
  
  // Detail scores
  const scoreItems = {
    acumulado1: {
      valEl: document.getElementById('val-ac1'),
      barEl: document.getElementById('bar-ac1')
    },
    examen1: {
      valEl: document.getElementById('val-ex1'),
      barEl: document.getElementById('bar-ex1')
    },
    acumulado2: {
      valEl: document.getElementById('val-ac2'),
      barEl: document.getElementById('bar-ac2')
    },
    examen2: {
      valEl: document.getElementById('val-ex2'),
      barEl: document.getElementById('bar-ex2')
    }
  };

  // Initialize Theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // Toggle Theme
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    themeToggleBtn.innerHTML = theme === 'light' ? moonIcon : sunIcon;
  }

  // SHA-256 Hash Function
  async function hashEmail(email) {
    const msgBuffer = new TextEncoder().encode(email);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Decrypt Record using SHA-256 keystream (custom stream cipher)
  async function decryptRecord(cipherHex, email) {
    const emailBytes = new TextEncoder().encode(email);
    const keyBuffer = await crypto.subtle.digest('SHA-256', emailBytes);
    const keyBytes = new Uint8Array(keyBuffer);
    
    // Parse hex string to bytes
    const cipherBytes = new Uint8Array(cipherHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    
    let keystream = [];
    let counter = 0;
    
    while (keystream.length < cipherBytes.length) {
      const counterBytes = new TextEncoder().encode(String(counter));
      const blockInput = new Uint8Array(keyBytes.length + counterBytes.length);
      blockInput.set(keyBytes, 0);
      blockInput.set(counterBytes, keyBytes.length);
      
      const blockHashBuffer = await crypto.subtle.digest('SHA-256', blockInput);
      const blockHashBytes = new Uint8Array(blockHashBuffer);
      
      for (let b of blockHashBytes) {
        keystream.push(b);
      }
      counter++;
    }
    
    const plainBytes = new Uint8Array(cipherBytes.length);
    for (let i = 0; i < cipherBytes.length; i++) {
      plainBytes[i] = cipherBytes[i] ^ keystream[i];
    }
    
    return new TextDecoder().decode(plainBytes);
  }

  // Form Submit Handler
  queryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';
    
    const email = emailInput.value.trim().toLowerCase();
    if (!email) return;

    setLoading(true);

    try {
      const emailHash = await hashEmail(email);
      
      setTimeout(async () => {
        const encryptedRecord = window.GRADES_DB[emailHash];
        
        if (encryptedRecord) {
          try {
            // Decrypt the record using the email entered by the user
            const plainJSON = await decryptRecord(encryptedRecord, email);
            const studentGrades = JSON.parse(plainJSON);
            showGrades(studentGrades, email);
          } catch (decErr) {
            console.error("Decryption failed:", decErr);
            showError("Ocurrió un error al descifrar los datos. Verifica tu correo.");
            setLoading(false);
          }
        } else {
          showError("El correo electrónico ingresado no se encuentra registrado.");
          setLoading(false);
        }
      }, 500);
      
    } catch (err) {
      console.error(err);
      showError("Ocurrió un error al procesar la consulta. Intente nuevamente.");
      setLoading(false);
    }
  });

  // Back Button Handler
  btnBack.addEventListener('click', () => {
    resultsView.style.opacity = '0';
    resultsView.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
      resultsView.style.display = 'none';
      queryView.style.display = 'block';
      queryView.style.opacity = '0';
      queryView.style.transform = 'scale(0.96)';
      
      void queryView.offsetWidth;
      
      queryView.style.opacity = '1';
      queryView.style.transform = 'scale(1)';
      
      emailInput.value = '';
      setLoading(false);
      emailInput.focus();
    }, 400);
  });

  function setLoading(isLoading) {
    if (isLoading) {
      searchBtn.disabled = true;
      searchBtnText.textContent = "Buscando...";
      searchBtnSpinner.style.display = "block";
    } else {
      searchBtn.disabled = false;
      searchBtnText.textContent = "Consultar Notas";
      searchBtnSpinner.style.display = "none";
    }
  }

  function showError(message) {
    errorMsg.querySelector('.error-text').textContent = message;
    errorMsg.style.display = 'flex';
  }

  function showGrades(data, email) {
    studentNameEl.textContent = data.name;
    studentEmailEl.textContent = email;
    
    const isPassing = data.notaFinal >= PASSING_SCORE;
    
    if (isPassing) {
      statusBadge.className = "status-badge aprobado";
      statusBadge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Aprobado`;
      statusText.textContent = "¡Felicidades! Has aprobado la asignatura.";
      finalCircleProgress.style.stroke = "var(--success)";
    } else {
      statusBadge.className = "status-badge reprobado";
      statusBadge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> Reprobado`;
      statusText.textContent = "No has alcanzado la nota mínima aprobatoria de 60.";
      finalCircleProgress.style.stroke = "var(--danger)";
    }

    queryView.style.opacity = '0';
    queryView.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
      queryView.style.display = 'none';
      resultsView.style.display = 'block';
      resultsView.style.opacity = '0';
      resultsView.style.transform = 'scale(0.96)';
      
      void resultsView.offsetWidth;
      
      resultsView.style.opacity = '1';
      resultsView.style.transform = 'scale(1)';
      
      animateScores(data);
    }, 400);
  }

  function animateScores(data) {
    const finalScore = data.notaFinal;
    const finalMax = MAX_SCORES.notaFinal;
    const percentage = Math.min(100, Math.max(0, (finalScore / finalMax) * 100));
    
    const circumference = 439.82;
    const offset = circumference - (percentage / 100) * circumference;
    
    finalCircleProgress.style.strokeDasharray = circumference;
    finalCircleProgress.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
      finalCircleProgress.style.strokeDashoffset = offset;
    }, 150);

    animateCounter(finalScoreNum, finalScore);

    const items = [
      { key: 'acumulado1', val: data.acumulado1 },
      { key: 'examen1', val: data.examen1 },
      { key: 'acumulado2', val: data.acumulado2 },
      { key: 'examen2', val: data.examen2 }
    ];

    items.forEach(item => {
      const config = scoreItems[item.key];
      const max = MAX_SCORES[item.key];
      
      animateCounter(config.valEl, item.val);
      
      const barPercentage = Math.min(100, Math.max(0, (item.val / max) * 100));
      
      config.barEl.style.width = '0%';
      setTimeout(() => {
        config.barEl.style.width = `${barPercentage}%`;
      }, 200);
    });
  }

  function animateCounter(element, targetValue) {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(start + easeProgress * (targetValue - start));
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = targetValue;
      }
    }
    
    requestAnimationFrame(updateCounter);
  }
});
