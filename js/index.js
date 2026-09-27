const img = document.getElementById('jsParallaxImg');
  
window.addEventListener('scroll', () => {
  // 獲取圖片外殼相對於目前視窗頂部的距離
  const parentRect = img.parentElement.getBoundingClientRect();
  
  // 計算圖片何時進入視窗
  if (parentRect.top < window.innerHeight && parentRect.bottom > 0) {
    // 計算移動進度，0 代表剛進入畫面，1 代表完全離開畫面
    const progress = (window.innerHeight - parentRect.top) / (window.innerHeight + parentRect.height);
    
    // 最大移動距離（因為圖片高 130%，多出 30%，所以最多往上移 30% 的高度）
    const maxMove = parentRect.height * 0.7; 
    
    // 計算目前的往上偏移量
    const yOffset = progress * maxMove;
    
    // 讓圖片產生往上的位移（初始先往下貼，再慢慢往上拉）
    img.style.transform = `translateY(${yOffset}px)`;
  }
});
    let currentCharIndex = 0;
    const charSlides = document.querySelectorAll('.char-slide');
    const charDotBtns = document.querySelectorAll('.char-dot-btn');
    const totalChars = charSlides.length;

    function switchChar(index) {
      currentCharIndex = index;
      charSlides.forEach((slide, idx) => {
        if(idx === currentCharIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      charDotBtns.forEach((btn, idx) => {
        if(idx === currentCharIndex) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    function nextChar() {
      let next = (currentCharIndex + 1) % totalChars;
      switchChar(next);
    }

    function prevChar() {
      let prev = (currentCharIndex - 1 + totalChars) % totalChars;
      switchChar(prev);
    }

    let currentSbPage = 0;
    const sbPages = document.querySelectorAll('.sb-page');
    const sbPageBtns = document.querySelectorAll('.sb-page-btn');
    const totalSbPages = sbPages.length;

    function switchSbPage(pageIndex) {
      currentSbPage = pageIndex;
      sbPages.forEach((page, idx) => {
        if (idx === currentSbPage) {
          page.classList.add('active');
        } else {
          page.classList.remove('active');
        }
      });

      sbPageBtns.forEach((btn, idx) => {
        if (idx === currentSbPage) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    function nextSbPage() {
      let next = (currentSbPage + 1) % totalSbPages;
      switchSbPage(next);
    }

    function prevSbPage() {
      let prev = (currentSbPage - 1 + totalSbPages) % totalSbPages;
      switchSbPage(prev);
    }
      // 監聽滑鼠移動事件
  window.addEventListener('mousemove', (e) => {
    // 限制生成頻率：每 3 次移動才產生 1 個粒子，避免過多元素導致網頁變卡
    if (Math.random() > 0.2) return;

    createParticle(e.clientX, e.clientY);
  });

  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // 隨機計算粒子最後飄散的方向與距離 (瓦解速度)
    const vx = (Math.random() - 0.5) * 60 + 'px';
    const vy = (Math.random() - 0.5) * 60 + 'px';

    // 利用 CSS 變數將滑鼠座標與飄散方向傳給 CSS
    particle.style.setProperty('--x', `${x - 5}px`); // 減 5 是為了讓粒子中心對準游標
    particle.style.setProperty('--y', `${y - 5}px`);
    particle.style.setProperty('--vx', vx);
    particle.style.setProperty('--vy', vy);

    // 隨機微調粒子的大小，看起來更自然
    const size = Math.random() * 8 + 6;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    document.body.appendChild(particle);

    // 當動畫結束後，立刻將元素從網頁中移除，釋放記憶體
    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }
  const canvas = document.getElementById('trail-canvas');
  const ctx = canvas.getContext('2d');

  // 儲存滑鼠軌跡點的陣列
  let points = [];
  
  // 線條設定參數（可自由調整）
  const CONFIG = {
    maxLength: 25,       // 線條的最大長度（節點數量），數字越大拖尾越長
    startWidth: 5,       // 線條起點的粗細（像素）
    color: '#ffc4006e',    // 線條顏色（支援 16 進位、rgb、或漸層）
    fadeSpeed: 0.8      // 消失速度
  };

  // 初始化畫布尺寸，並監聽視窗縮放
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // 監聽滑鼠移動，紀錄座標
  window.addEventListener('mousemove', (e) => {
    points.push({
      x: e.clientX,
      y: e.clientY,
      age: 0
    });

    // 限制陣列長度，避免拖尾無限延長
    if (points.length > CONFIG.maxLength) {
      points.shift();
    }
  });

  // 動畫主循環（使用 requestAnimationFrame 優化流暢度）
  function animate() {
    // 每次畫新畫面日前，先清空舊畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      // 用平滑的二次貝茲曲線連接各個點，讓線條看起來有流線感
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }

      // 設定線條樣式：圓潤的接頭與端點
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = CONFIG.color;

      // 讓線條從尾端到頭端「漸變變粗」
      for (let i = 1; i < points.length; i++) {
        ctx.lineWidth = (i / points.length) * CONFIG.startWidth;
      }
      
      ctx.stroke();
    }

    // 隨著時間讓線條點漸漸老化消失（處理滑鼠停下來時的淡出）
    for (let i = 0; i < points.length; i++) {
      points[i].age += CONFIG.fadeSpeed;
    }
    // 移除太舊的點
    points = points.filter(p => p.age < 15);

    requestAnimationFrame(animate);
  }

  // 啟動動畫
  animate();
  const card0 = document.getElementById('card0');

  // 控制晃動幅度的「權重」
  // 數字越大，晃動範圍越大；數字越小，晃動越微弱
  const MOVEMENT_STRENGTH0 = 50; 

  window.addEventListener('mousemove', (e) => {
    // 1. 計算滑鼠相對於「視窗中心點」的距離比例
    // e.clientX / window.innerWidth 會得到 0 ~ 1 之間的數字
    // 減去 0.5 後，中心點為 0，最左/最上是 -0.5，最右/最下是 0.5
    const pageX = (e.clientX / window.innerWidth) - 0.2;
    const pageY = (e.clientY / window.innerHeight) - 0.2;

    // 2. 將比例乘以強度，計算出最終要位移的像素（px）
    const moveX = pageX * MOVEMENT_STRENGTH0;
    const moveY = pageY * MOVEMENT_STRENGTH0;

    // 3. 使用 requestAnimationFrame 確保在瀏覽器刷新畫面的最佳時機套用位移
    requestAnimationFrame(() => {
      card0.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });
  const card = document.getElementById('card');

  // 控制晃動幅度的「權重」
  // 數字越大，晃動範圍越大；數字越小，晃動越微弱
  const MOVEMENT_STRENGTH = 200; 

  window.addEventListener('mousemove', (e) => {
    // 1. 計算滑鼠相對於「視窗中心點」的距離比例
    // e.clientX / window.innerWidth 會得到 0 ~ 1 之間的數字
    // 減去 0.5 後，中心點為 0，最左/最上是 -0.5，最右/最下是 0.5
    const pageX = (e.clientX / window.innerWidth) - 0.5;
    const pageY = (e.clientY / window.innerHeight) - 0.5;

    // 2. 將比例乘以強度，計算出最終要位移的像素（px）
    const moveX = pageX * MOVEMENT_STRENGTH;
    const moveY = pageY * MOVEMENT_STRENGTH;

    // 3. 使用 requestAnimationFrame 確保在瀏覽器刷新畫面的最佳時機套用位移
    requestAnimationFrame(() => {
      card.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });
  const card1 = document.getElementById('card1');

  // 控制晃動幅度的「權重」
  // 數字越大，晃動範圍越大；數字越小，晃動越微弱
  const MOVEMENT_STRENGTH1 = 30; 

  window.addEventListener('mousemove', (e) => {
    // 1. 計算滑鼠相對於「視窗中心點」的距離比例
    // e.clientX / window.innerWidth 會得到 0 ~ 1 之間的數字
    // 減去 0.5 後，中心點為 0，最左/最上是 -0.5，最右/最下是 0.5
    const pageX = (e.clientX / window.innerWidth) - 0.5;
    const pageY = (e.clientY / window.innerHeight) - 0.5;

    // 2. 將比例乘以強度，計算出最終要位移的像素（px）
    const moveX = pageX * MOVEMENT_STRENGTH1;
    const moveY = pageY * MOVEMENT_STRENGTH1;

    // 3. 使用 requestAnimationFrame 確保在瀏覽器刷新畫面的最佳時機套用位移
    requestAnimationFrame(() => {
      card1.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });
  const card2 = document.getElementById('card2');

  // 控制晃動幅度的「權重」
  // 數字越大，晃動範圍越大；數字越小，晃動越微弱
  const MOVEMENT_STRENGTH2 = 30; 

  window.addEventListener('mousemove', (e) => {
    // 1. 計算滑鼠相對於「視窗中心點」的距離比例
    // e.clientX / window.innerWidth 會得到 0 ~ 1 之間的數字
    // 減去 0.5 後，中心點為 0，最左/最上是 -0.5，最右/最下是 0.5
    const pageX = (e.clientX / window.innerWidth) - 0.5;
    const pageY = (e.clientY / window.innerHeight) - 0.5;

    // 2. 將比例乘以強度，計算出最終要位移的像素（px）
    const moveX = pageX * MOVEMENT_STRENGTH2;
    const moveY = pageY * MOVEMENT_STRENGTH2;

    // 3. 使用 requestAnimationFrame 確保在瀏覽器刷新畫面的最佳時機套用位移
    requestAnimationFrame(() => {
      card2.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });
  const card3 = document.getElementById('card3');

  // 控制晃動幅度的「權重」
  // 數字越大，晃動範圍越大；數字越小，晃動越微弱
  const MOVEMENT_STRENGTH3 = 50; 

  window.addEventListener('mousemove', (e) => {
    // 1. 計算滑鼠相對於「視窗中心點」的距離比例
    // e.clientX / window.innerWidth 會得到 0 ~ 1 之間的數字
    // 減去 0.5 後，中心點為 0，最左/最上是 -0.5，最右/最下是 0.5
    const pageX = (e.clientX / window.innerWidth) - 0.5;
    const pageY = (e.clientY / window.innerHeight) - 0.5;

    // 2. 將比例乘以強度，計算出最終要位移的像素（px）
    const moveX = pageX * MOVEMENT_STRENGTH3;
    const moveY = pageY * MOVEMENT_STRENGTH3;

    // 3. 使用 requestAnimationFrame 確保在瀏覽器刷新畫面的最佳時機套用位移
    requestAnimationFrame(() => {
      card3.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });
  const card4 = document.getElementById('card4');

  // 控制晃動幅度的「權重」
  // 數字越大，晃動範圍越大；數字越小，晃動越微弱
  const MOVEMENT_STRENGTH4 = 100; 

  window.addEventListener('mousemove', (e) => {
    // 1. 計算滑鼠相對於「視窗中心點」的距離比例
    // e.clientX / window.innerWidth 會得到 0 ~ 1 之間的數字
    // 減去 0.5 後，中心點為 0，最左/最上是 -0.5，最右/最下是 0.5
    const pageX = (e.clientX / window.innerWidth) - 0.5;
    const pageY = (e.clientY / window.innerHeight) - 0.5;

    // 2. 將比例乘以強度，計算出最終要位移的像素（px）
    const moveX = pageX * MOVEMENT_STRENGTH4;
    const moveY = pageY * MOVEMENT_STRENGTH4;

    // 3. 使用 requestAnimationFrame 確保在瀏覽器刷新畫面的最佳時機套用位移
    requestAnimationFrame(() => {
      card4.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });

  // 1. 自動拆解文字並注入 CSS 變數 --i
const textContainer = document.getElementById('wave-text');
const text = textContainer.innerText;
textContainer.innerHTML = ''; // 清空原本的純文字

text.split('').forEach((letter, index) => {
  const span = document.createElement('span');
  span.innerText = letter;
  span.style.setProperty('--i', index + 1); // 第一個字是 1，第二個是 2...
  textContainer.appendChild(span);
});

// 2. 建立視窗偵測器 (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // 當這個字串區塊有 30% 進入畫面時
    if (entry.isIntersecting) {
      entry.target.classList.add('active'); // 加上 active 觸發跳動
      
    }
  });
}, {
  threshold: 0.3 // 調整觸發時機（0.3 代表文字露出 30% 就觸發）
});

// 開始監聽目標
observer.observe(textContainer);