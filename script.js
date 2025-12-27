// script.js
/********************************************
 *   드래그 & 드롭 기본 변수
 ********************************************/
const stickers = document.querySelectorAll('.sticker-wrap');
const dropzones = document.querySelectorAll('.dropzone'); // ✅ dropzone 2개(과세/면세)
const stickerPalette = document.querySelector('.stickers');
const resetBtn = document.querySelector('.reset');

let dragClone = null, draggedSticker = null, offsetX = 0, offsetY = 0;

/* 연속 클릭 방지 */
let effectLock = false;


/********************************************
 *   드래그 & 드롭
 ********************************************/
stickers.forEach(sticker => {
  sticker.style.touchAction = "none";

  sticker.addEventListener('pointerdown', e => {
    draggedSticker = sticker;

    const rect = sticker.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    dragClone = sticker.cloneNode(true);
    dragClone.classList.add('drag-clone');
    dragClone.style.position = 'fixed';
    dragClone.style.pointerEvents = 'none';
    dragClone.style.zIndex = 1000;
    dragClone.style.left = e.clientX - offsetX + 'px';
    dragClone.style.top = e.clientY - offsetY + 'px';
    dragClone.style.transform = 'scale(1.1)';
    dragClone.style.opacity = '0.9';
    document.body.appendChild(dragClone);

    sticker.style.visibility = 'hidden';
    e.preventDefault();
  });
});

document.addEventListener('pointermove', e => {
  if (dragClone) {
    dragClone.style.left = e.clientX - offsetX + 'px';
    dragClone.style.top = e.clientY - offsetY + 'px';
  }

  dropzones.forEach(zone => {
    const r = zone.getBoundingClientRect();
    const inside =
      e.clientX > r.left && e.clientX < r.right &&
      e.clientY > r.top && e.clientY < r.bottom;
    zone.classList.toggle('_active', inside);
  });
});

document.addEventListener('pointerup', e => {
  if (!dragClone || !draggedSticker) return;

  let dropped = false;

  dropzones.forEach(zone => {
    const r = zone.getBoundingClientRect();

    if (
      e.clientX > r.left && e.clientX < r.right &&
      e.clientY > r.top && e.clientY < r.bottom
    ) {
      zone.querySelector('.drop-content').appendChild(draggedSticker);
      dropped = true;
    }
    zone.classList.remove('_active');
  });

  draggedSticker.style.visibility = 'visible';
  dragClone.remove();
  dragClone = null;

  if (!dropped) stickerPalette.appendChild(draggedSticker);

  draggedSticker = null;
  updateTotal();
});


/********************************************
 *   합계 계산
 ********************************************/
function updateTotal() {
  dropzones.forEach(zone => {
    const s = zone.querySelectorAll('.drop-content .sticker-wrap');
    let t = 0;
    s.forEach(e => t += Number(e.dataset.price));
    zone.querySelector('.total').textContent = `총합: ₩${t.toLocaleString()}`;
  });
}


/********************************************
 *   초기화
 ********************************************/
resetBtn.addEventListener('click', () => {
  const all = document.querySelectorAll('.sticker-wrap');
  all.forEach(s => stickerPalette.appendChild(s));
  updateTotal();

  calcValue = '';
  calcDisplay.value = '';
  answerInput.value = '';
});


/********************************************
 *   계산기
 ********************************************/
const calcDisplay = document.querySelector('.calc-display');
const calcButtons = document.querySelectorAll('.calc-btn');
let calcValue = '';

calcButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    let val = btn.dataset.value;

    if (val === 'C') {
      calcValue = '';
    } else if (val === '=') {
      try {
        calcValue = eval(
          calcValue.replace(/÷/g, '/').replace(/×/g, '*')
        ).toString();
      } catch {
        calcValue = '';
        calcDisplay.value = '';
        return;
      }
    } else {
      calcValue += val;
    }

    calcDisplay.value = calcValue;
  });
});


/********************************************
 *   정답 체크
 ********************************************/
const answerInput = document.querySelector('.answer-input');
const checkBtn = document.querySelector('.check-btn');

checkBtn.addEventListener('click', () => {
  if (effectLock) return;

  if (answerInput.value === '205500') {
    showCorrectText();
    fireworkBurstSequence();
  } else if (answerInput.value === '2008') {
    alert("( ﾟ▽ﾟ)/");
  } else if (answerInput.value === '0000') {
    alert("Correct Answer = ₩205,500");
  } else {
    showWrongText();
  }
});


/********************************************
 *   정답 텍스트 (원래 후광 그대로)
 ********************************************/
function showCorrectText() {
  effectLock = true;

  const text = document.createElement('div');
  text.textContent = '정답';
  text.style.position = 'fixed';
  text.style.top = '50%';
  text.style.left = '50%';
  text.style.transform = 'translate(-50%, -50%)';
  text.style.fontSize = '120px';
  text.style.fontWeight = '900';
  text.style.color = '#fff';

  text.style.textShadow =
    '0 0 25px #00e6b8, 0 0 50px #00ffee, 0 0 80px #00bfa5';

  text.style.opacity = '0';
  text.style.transition = 'opacity 0.5s';
  text.style.zIndex = 9999;
  document.body.appendChild(text);

  requestAnimationFrame(() => text.style.opacity = '1');
  setTimeout(() => {
    text.style.opacity = '0';
    setTimeout(() => text.remove(), 600);
    effectLock = false;
  }, 2000);
}


/********************************************
 *   오답 텍스트 + 흔들림
 ********************************************/
function showWrongText() {
  effectLock = true;

  const text = document.createElement('div');
  text.textContent = '오답';
  text.style.position = 'fixed';
  text.style.top = '50%';
  text.style.left = '50%';
  text.style.transform = 'translate(-50%, -50%)';
  text.style.fontSize = '120px';
  text.style.fontWeight = '900';
  text.style.color = '#fff';
  text.style.textShadow =
    '0 0 40px #ff4444, 0 0 80px #ff2222, 0 0 120px #cc0000';
  text.style.zIndex = 9999;
  text.style.opacity = '0';
  text.style.transition = 'opacity 0.3s';

  document.body.appendChild(text);

  setTimeout(() => text.style.opacity = '1', 10);

  setTimeout(() => {
    text.style.opacity = '0';
    setTimeout(() => text.remove(), 400);
    effectLock = false;
  }, 1200);

  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 500);
}


/********************************************
 *   폭죽 생성 (CSS 기반)
 ********************************************/
function spawnFirework() {
  const fw = document.createElement('div');
  fw.className = 'fw-root';

  fw.style.left = `${Math.random() * window.innerWidth}px`;
  fw.style.top = `${window.innerHeight * (0.3 + Math.random() * 0.3)}px`;

  document.body.appendChild(fw);

  const count = 100; // 파티클 개수

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'fw-particle';

    const angle = (Math.PI * 2 * i) / count;
    const distance = 120 + Math.random() * 120;

    p.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    p.style.setProperty('--y', `${Math.sin(angle) * distance}px`);

    const o = Math.floor(200 + Math.random() * 55);
    p.style.background = `rgb(255,${o},120)`;
    p.style.boxShadow = `0 0 10px rgb(255,${o},120)`;

    fw.appendChild(p);
  }

  setTimeout(() => fw.remove(), 3500);
}

function fireworkBurstSequence() {
  spawnFirework();
  setTimeout(spawnFirework, 200);
  setTimeout(spawnFirework, 400);
  setTimeout(spawnFirework, 600);
  setTimeout(spawnFirework, 800);
  setTimeout(spawnFirework, 1000);
  setTimeout(spawnFirework, 1200);
  setTimeout(spawnFirework, 1400);
}


/********************************************
 *   폭죽 + 흔들림 CSS (JS에서 삽입)
 ********************************************/
const style = document.createElement('style');
style.textContent = `
.fw-root {
  position: fixed;
  pointer-events: none;
  width: 6px;
  height: 6px;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
.fw-particle {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: fw-explode 3.5s ease-out forwards;
}
@keyframes fw-explode {
  0% {
    transform: translate(0,0) scale(1.2);
    opacity: 1;
  }
  40% {
    transform: translate(var(--x), var(--y)) scale(0.8);
    opacity: 0.9;
  }
  75% {
    transform: translate(var(--x), calc(var(--y) + 60px)) scale(0.5);
    opacity: 0.5;
  }
  100% {
    transform: translate(var(--x), calc(var(--y) + 120px)) scale(0.2);
    opacity: 0;
  }
}
@keyframes shakeAnim {
  0% { transform: translateX(0); }
  20% { transform: translateX(-15px); }
  40% { transform: translateX(15px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}
body.shake {
  animation: shakeAnim 0.45s ease-in-out;
}
`;
document.head.appendChild(style);