export const STANDALONE_SURVEY_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Prompt', sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen pb-12">

  <div class="max-w-xl mx-auto px-4 py-6">
    <!-- Header Card -->
    <header class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <div class="flex items-center gap-2 text-indigo-600 text-xs font-semibold tracking-wider uppercase mb-1">
        <span>แบบประเมินความพึงพอใจ</span>
        <span>•</span>
        <span>Workshop Evaluation</span>
      </div>
      <h1 class="text-2xl font-bold text-slate-900 leading-tight">โครงการอบรมเชิงปฏิบัติการ</h1>
      <p class="text-sm text-slate-500 mt-1">โปรดให้คะแนนตามระดับความพึงพอใจของท่าน เพื่อนำไปพัฒนาการอบรมในครั้งต่อไป (ไม่ต้องระบุชื่อ)</p>
    </header>

    <!-- Already Submitted Screen (Hidden by default) -->
    <div id="submittedBox" class="hidden bg-white rounded-2xl shadow-sm border border-emerald-200 p-8 text-center mb-6">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
        ✓
      </div>
      <h2 class="text-xl font-bold text-slate-900 mb-2">ขอบคุณสำหรับความคิดเห็นของท่าน!</h2>
      <p class="text-slate-600 text-sm mb-6">ระบบได้รับข้อมูลการประเมินของท่านเรียบร้อยแล้ว และคะแนนได้ถูกนำไปแสดงผลบนจอสรุปทันที</p>
      <button onclick="resetSubmissionForTest()" class="text-xs text-slate-400 hover:text-slate-600 underline">
        ตอบใหม่อีกครั้ง (สำหรับทดสอบระบบ)
      </button>
    </div>

    <!-- Survey Form -->
    <form id="surveyForm" onsubmit="handleSubmit(event)" class="space-y-6">
      
      <!-- Question 1 -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">ข้อที่ 1</span>
          <span class="text-xs text-rose-500 font-medium">* จำเป็น</span>
        </div>
        <h3 class="text-base font-semibold text-slate-900 mb-1">ความเหมาะสมและความชัดเจนของเนื้อหาหลักสูตร</h3>
        <p class="text-xs text-slate-500 mb-4">เนื้อหามีความน่าสนใจ ครบถ้วน ทันสมัย และตรงตามวัตถุประสงค์การอบรม</p>
        
        <div class="grid grid-cols-5 gap-2" id="q1-group">
          <!-- Rating Buttons 1 to 5 injected via JS -->
        </div>
      </div>

      <!-- Question 2 -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">ข้อที่ 2</span>
          <span class="text-xs text-rose-500 font-medium">* จำเป็น</span>
        </div>
        <h3 class="text-base font-semibold text-slate-900 mb-1">ความรู้ความเชี่ยวชาญและการถ่ายทอดของวิทยากร</h3>
        <p class="text-xs text-slate-500 mb-4">วิทยากรอธิบายเข้าใจง่าย มีเทคนิคการสอนที่น่าติดตาม และตอบข้อซักถามได้ชัดเจน</p>
        
        <div class="grid grid-cols-5 gap-2" id="q2-group"></div>
      </div>

      <!-- Question 3 -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">ข้อที่ 3</span>
          <span class="text-xs text-rose-500 font-medium">* จำเป็น</span>
        </div>
        <h3 class="text-base font-semibold text-slate-900 mb-1">คุณภาพและความครบถ้วนของสื่อและเอกสารประกอบ</h3>
        <p class="text-xs text-slate-500 mb-4">เอกสาร สไลด์ แบบฝึกหัด หรือเครื่องมือประกอบการเรียนรู้มีประโยชน์และนำไปใช้ได้จริง</p>
        
        <div class="grid grid-cols-5 gap-2" id="q3-group"></div>
      </div>

      <!-- Question 4 -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">ข้อที่ 4</span>
          <span class="text-xs text-rose-500 font-medium">* จำเป็น</span>
        </div>
        <h3 class="text-base font-semibold text-slate-900 mb-1">ความเหมาะสมของการบริหารเวลาและสถานที่/ระบบห้องเรียน</h3>
        <p class="text-xs text-slate-500 mb-4">การจัดสรรเวลาการบรรยายและการลงมือทำ ระบบภาพ เสียง หรือห้องเรียนมีความพร้อม</p>
        
        <div class="grid grid-cols-5 gap-2" id="q4-group"></div>
      </div>

      <!-- Question 5 -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">ข้อที่ 5</span>
          <span class="text-xs text-rose-500 font-medium">* จำเป็น</span>
        </div>
        <h3 class="text-base font-semibold text-slate-900 mb-1">ความพึงพอใจในภาพรวมและประโยชน์ที่นำไปประยุกต์ใช้ได้</h3>
        <p class="text-xs text-slate-500 mb-4">ภาพรวมของหลักสูตรสร้างแรงบันดาลใจ และมั่นใจว่าสามารถนำความรู้ไปต่อยอดการทำงานได้</p>
        
        <div class="grid grid-cols-5 gap-2" id="q5-group"></div>
      </div>

      <!-- Suggestions (Optional) -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-base font-semibold text-slate-900 mb-1">ข้อเสนอแนะเพิ่มเติมเพื่อการพัฒนา (ไม่บังคับ)</h3>
        <p class="text-xs text-slate-500 mb-3">มีสิ่งที่ประทับใจ หรือข้อที่ควรปรับปรุงในครั้งต่อไปหรือไม่</p>
        <textarea id="suggestion" rows="3" placeholder="พิมพ์ความคิดเห็นหรือข้อเสนอแนะที่นี่..."
          class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition"></textarea>
      </div>

      <!-- Error notice -->
      <div id="errorNotice" class="hidden p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm text-center">
        กรุณาเลือกคะแนนให้ครบทั้ง 5 ข้อก่อนกดส่ง
      </div>

      <!-- Submit CTA Button -->
      <button type="submit" id="submitBtn"
        class="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition flex items-center justify-center text-lg gap-2">
        <span>ส่งแบบประเมิน</span>
        <span>→</span>
      </button>
    </form>
  </div>

  <!-- Firebase SDK (Compat version for single-file simplicity) -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>

  <script>
    // ==========================================
    // 1. ตั้งค่า Firebase Config ของคุณตรงนี้
    // (คัดลอกจาก Firebase Console > Project Settings)
    // ==========================================
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT",
      storageBucket: "YOUR_PROJECT.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // เริ่มต้นเชื่อมต่อ Firebase
    let database = null;
    try {
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
      }
    } catch (e) {
      console.warn("Firebase not configured yet, running in local fallback mode.", e);
    }

    const ratings = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
    const ratingLabels = { 1: "น้อยที่สุด", 2: "น้อย", 3: "ปานกลาง", 4: "มาก", 5: "มากที่สุด" };

    // สร้างปุ่มเลือกคะแนน 1-5 แบบ Mobile Touch Friendly
    function renderRatingButtons(questionId) {
      const container = document.getElementById(questionId + '-group');
      container.innerHTML = '';
      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rating-btn h-14 rounded-xl border border-slate-200 flex flex-col items-center justify-center transition-all bg-white hover:border-indigo-400 active:scale-95';
        btn.dataset.qid = questionId;
        btn.dataset.value = i;
        btn.innerHTML = \`
          <span class="text-lg font-bold text-slate-800">\${i}</span>
          <span class="text-[10px] text-slate-500">\${ratingLabels[i]}</span>
        \`;
        btn.onclick = () => selectRating(questionId, i);
        container.appendChild(btn);
      }
    }

    function selectRating(qid, value) {
      ratings[qid] = value;
      const group = document.getElementById(qid + '-group');
      const buttons = group.querySelectorAll('.rating-btn');
      buttons.forEach(btn => {
        const val = parseInt(btn.dataset.value, 10);
        if (val === value) {
          btn.className = 'rating-btn h-14 rounded-xl border-2 border-indigo-600 bg-indigo-50 text-indigo-700 flex flex-col items-center justify-center transition-all shadow-sm scale-[1.02]';
          btn.querySelector('span:first-child').className = 'text-lg font-bold text-indigo-600';
          btn.querySelector('span:last-child').className = 'text-[10px] font-semibold text-indigo-600';
        } else {
          btn.className = 'rating-btn h-14 rounded-xl border border-slate-200 flex flex-col items-center justify-center transition-all bg-white hover:border-slate-300 opacity-60';
          btn.querySelector('span:first-child').className = 'text-lg font-medium text-slate-700';
          btn.querySelector('span:last-child').className = 'text-[10px] text-slate-400';
        }
      });
      document.getElementById('errorNotice').classList.add('hidden');
    }

    // ตรวจสอบว่าเครื่องนี้เคยตอบไปแล้วหรือไม่ (ป้องกันตอบซ้ำ)
    function checkSubmittedStatus() {
      const hasSubmitted = localStorage.getItem('workshop_has_submitted');
      if (hasSubmitted) {
        document.getElementById('surveyForm').classList.add('hidden');
        document.getElementById('submittedBox').classList.remove('hidden');
      }
    }

    function resetSubmissionForTest() {
      localStorage.removeItem('workshop_has_submitted');
      document.getElementById('submittedBox').classList.add('hidden');
      document.getElementById('surveyForm').classList.remove('hidden');
      ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(renderRatingButtons);
    }

    async function handleSubmit(e) {
      e.preventDefault();
      
      // ตรวจสอบว่าเลือกครบทั้ง 5 ข้อหรือไม่
      if (!ratings.q1 || !ratings.q2 || !ratings.q3 || !ratings.q4 || !ratings.q5) {
        document.getElementById('errorNotice').classList.remove('hidden');
        window.scrollTo({ top: 300, behavior: 'smooth' });
        return;
      }

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'กำลังบันทึกข้อมูล...';

      const payload = {
        id: 'resp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        timestamp: Date.now(),
        q1: ratings.q1,
        q2: ratings.q2,
        q3: ratings.q3,
        q4: ratings.q4,
        q5: ratings.q5,
        suggestion: (document.getElementById('suggestion').value || '').trim()
      };

      try {
        if (database) {
          // บันทึกลง Firebase Realtime Database
          await database.ref('responses/' + payload.id).set(payload);
        } else {
          // ถ้ายังไม่ได้ต่อ Firebase ให้บันทึกลง LocalStorage
          const localData = JSON.parse(localStorage.getItem('workshop_pulse_responses_v1') || '[]');
          localData.unshift(payload);
          localStorage.setItem('workshop_pulse_responses_v1', JSON.stringify(localData));
        }

        // ป้องกันตอบซ้ำในเครื่องนี้
        localStorage.setItem('workshop_has_submitted', 'true');
        document.getElementById('surveyForm').classList.add('hidden');
        document.getElementById('submittedBox').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'ส่งแบบประเมิน →';
      }
    }

    // เริ่มต้นเมื่อโหลดหน้า
    window.onload = function() {
      ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(renderRatingButtons);
      checkSubmittedStatus();
    };
  </script>
</body>
</html>
`;

export const STANDALONE_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard ผลประเมินการอบรม (Realtime)</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- QRCode.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  <!-- Google Fonts: Prompt & Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Prompt', 'Plus Jakarta Sans', sans-serif; }
    .tabular-nums { font-variant-numeric: tabular-nums; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 antialiased min-h-screen p-4 md:p-8">

  <!-- Top Navigation Bar for Projector -->
  <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
    <div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          REALTIME LIVE
        </span>
        <span class="text-xs text-slate-400">อัปเดตอัตโนมัติทันทีที่มีคนตอบ</span>
      </div>
      <h1 class="text-2xl md:text-3xl font-bold text-white mt-1">Dashboard สรุปผลความพึงพอใจการอบรม</h1>
      <p class="text-sm text-slate-400">โครงการอบรมเชิงปฏิบัติการเสริมสร้างทักษะดิจิทัลแห่งอนาคต</p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3 flex-wrap">
      <button onclick="toggleFullscreen()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition">
        📺 ขยายเต็มจอ (Projector)
      </button>
      <button onclick="exportCSV()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5">
        📥 ดาวน์โหลด CSV
      </button>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
    <!-- QR Code Scan Box for Screen -->
    <div class="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col items-center justify-center text-center">
      <h3 class="text-base font-semibold text-white mb-2">สแกนเพื่อร่วมประเมิน</h3>
      <div class="bg-white p-3 rounded-xl shadow-inner mb-3">
        <canvas id="qrCanvas" class="w-40 h-40"></canvas>
      </div>
      <p class="text-xs text-slate-400">ใช้กล้องมือถือสแกน QR Code เพื่อตอบแบบสอบถาม</p>
    </div>

    <!-- KPI 1: จำนวนผู้ตอบ -->
    <div class="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
      <span class="text-xs uppercase tracking-wider text-slate-400">จำนวนผู้ตอบแบบประเมิน</span>
      <div class="my-3">
        <span id="kpiTotal" class="text-5xl font-extrabold text-white tabular-nums">0</span>
        <span class="text-lg text-slate-400 ml-2">คน</span>
      </div>
      <div class="text-xs text-emerald-400" id="kpiProgress">ข้อมูลเรียลไทม์</div>
    </div>

    <!-- KPI 2: คะแนนเฉลี่ยรวม -->
    <div class="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
      <span class="text-xs uppercase tracking-wider text-slate-400">คะแนนเฉลี่ยรวมทุกด้าน (เต็ม 5.00)</span>
      <div class="my-3">
        <span id="kpiMean" class="text-5xl font-extrabold text-indigo-400 tabular-nums">0.00</span>
        <span class="text-lg text-slate-400 ml-2">/ 5.00</span>
      </div>
      <div id="kpiLevelBadge" class="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 w-fit">
        รอข้อมูล
      </div>
    </div>

    <!-- KPI 3: ข้อเสนอแนะ -->
    <div class="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
      <span class="text-xs uppercase tracking-wider text-slate-400">ข้อเสนอแนะที่ได้รับ</span>
      <div class="my-3">
        <span id="kpiSuggestions" class="text-5xl font-extrabold text-amber-400 tabular-nums">0</span>
        <span class="text-lg text-slate-400 ml-2">ข้อความ</span>
      </div>
      <div class="text-xs text-slate-400">จากผู้เข้าร่วมอบรม</div>
    </div>
  </div>

  <!-- Main Chart & Content Section -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Chart: Donut Chart 5 Questions -->
    <div class="lg:col-span-2 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80">
      <h2 class="text-lg font-bold text-white mb-4">สัดส่วนคะแนนเฉลี่ยรายข้อ (กราฟวงกลม Donut Chart)</h2>
      <div class="h-[360px]">
        <canvas id="barChart"></canvas>
      </div>
      <!-- Interpret scale legend -->
      <div class="mt-4 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>เกณฑ์: 4.51-5.00 (มากที่สุด)</span>
        <span>3.51-4.50 (มาก)</span>
        <span>2.51-3.50 (ปานกลาง)</span>
        <span>1.51-2.50 (น้อย)</span>
        <span>1.00-1.50 (น้อยที่สุด)</span>
      </div>
    </div>

    <!-- Latest Suggestions Feed -->
    <div class="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-white">ข้อเสนอแนะล่าสุด</h2>
        <span id="suggestionCountBadge" class="text-xs text-slate-400">0 รายการ</span>
      </div>
      <div id="suggestionsList" class="space-y-3 overflow-y-auto max-h-[380px] pr-2 flex-1">
        <!-- Rendered items -->
        <p class="text-sm text-slate-500 text-center py-10">ยังไม่มีข้อเสนอแนะ</p>
      </div>
    </div>
  </div>

  <!-- Firebase SDK -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>

  <script>
    // ==========================================
    // 1. ตั้งค่า Firebase Config ของคุณตรงนี้
    // (คัดลอกจาก Firebase Console > Project Settings)
    // ==========================================
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT",
      storageBucket: "YOUR_PROJECT.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let allResponses = [];
    let myChart = null;

    // คำถาม 5 ข้อ
    const questions = [
      "1. เนื้อหาหลักสูตร",
      "2. วิทยากรถ่ายทอด",
      "3. สื่อและเอกสาร",
      "4. เวลาและสถานที่",
      "5. ภาพรวมและการนำไปใช้"
    ];

    function getLikertLevel(score) {
      if (score >= 4.51) return { label: "มากที่สุด", color: "#10b981" };
      if (score >= 3.51) return { label: "มาก", color: "#3b82f6" };
      if (score >= 2.51) return { label: "ปานกลาง", color: "#eab308" };
      if (score >= 1.51) return { label: "น้อย", color: "#f59e0b" };
      return { label: "น้อยที่สุด", color: "#ef4444" };
    }

    function initChart() {
      const ctx = document.getElementById('barChart').getContext('2d');
      myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: questions,
          datasets: [{
            label: 'คะแนนเฉลี่ย',
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              '#10b981', // เนื้อหา
              '#3b82f6', // วิทยากร
              '#6366f1', // สื่อ/เอกสาร
              '#8b5cf6', // เวลา/สถานที่
              '#ec4899'  // ภาพรวม
            ],
            borderColor: '#1e293b',
            borderWidth: 3,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#cbd5e1',
                padding: 16,
                font: { family: 'Prompt', size: 12 }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const val = context.parsed;
                  const level = getLikertLevel(val);
                  return ' คะแนน: ' + val.toFixed(2) + ' / 5.00 (' + level.label + ')';
                }
              }
            }
          }
        }
      });
    }

    function updateDashboard(responses) {
      allResponses = responses;
      const total = responses.length;

      document.getElementById('kpiTotal').innerText = total;

      if (total === 0) {
        document.getElementById('kpiMean').innerText = '0.00';
        document.getElementById('kpiLevelBadge').innerText = 'ยังไม่มีข้อมูล';
        document.getElementById('kpiSuggestions').innerText = '0';
        if (myChart) {
          myChart.data.datasets[0].data = [0, 0, 0, 0, 0];
          myChart.update();
        }
        return;
      }

      // คำนวณรายข้อ
      let sums = [0, 0, 0, 0, 0];
      responses.forEach(r => {
        sums[0] += Number(r.q1) || 0;
        sums[1] += Number(r.q2) || 0;
        sums[2] += Number(r.q3) || 0;
        sums[3] += Number(r.q4) || 0;
        sums[4] += Number(r.q5) || 0;
      });

      const means = sums.map(s => Number((s / total).toFixed(2)));
      const overallMean = Number((means.reduce((a, b) => a + b, 0) / 5).toFixed(2));
      const overallLevel = getLikertLevel(overallMean);

      document.getElementById('kpiMean').innerText = overallMean.toFixed(2);
      const badge = document.getElementById('kpiLevelBadge');
      badge.innerText = 'ระดับ ' + overallLevel.label;
      badge.style.color = overallLevel.color;

      // Update Chart
      if (myChart) {
        myChart.data.datasets[0].data = means;
        myChart.data.datasets[0].backgroundColor = means.map(m => getLikertLevel(m).color);
        myChart.update();
      }

      // Update Suggestions
      const suggestions = responses
        .filter(r => r.suggestion && r.suggestion.trim().length > 0)
        .map(r => r.suggestion.trim());

      document.getElementById('kpiSuggestions').innerText = suggestions.length;
      document.getElementById('suggestionCountBadge').innerText = suggestions.length + ' ข้อความ';

      const listContainer = document.getElementById('suggestionsList');
      if (suggestions.length === 0) {
        listContainer.innerHTML = '<p class="text-sm text-slate-500 text-center py-10">ยังไม่มีข้อเสนอแนะ</p>';
      } else {
        listContainer.innerHTML = suggestions.map((text, idx) => \`
          <div class="p-3.5 rounded-xl bg-slate-700/60 border border-slate-600/50 text-sm text-slate-200">
            "\${text}"
          </div>
        \`).join('');
      }
    }

    // QR Code Generator
    function generateQR() {
      const surveyUrl = window.location.href.replace('dashboard.html', 'survey.html');
      QRCode.toCanvas(document.getElementById('qrCanvas'), surveyUrl, {
        width: 160,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
    }

    // Fullscreen toggle for Projector
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    // CSV Exporter (UTF-8 with BOM for Thai Excel)
    function exportCSV() {
      if (allResponses.length === 0) {
        alert('ยังไม่มีข้อมูลสำหรับส่งออก');
        return;
      }
      let csv = '\\uFEFF';
      csv += 'ลำดับ,วันเวลา,ข้อ 1 (เนื้อหา),ข้อ 2 (วิทยากร),ข้อ 3 (สื่อเอกสาร),ข้อ 4 (เวลาสถานที่),ข้อ 5 (ภาพรวม),คะแนนเฉลี่ย,ข้อเสนอแนะ\\n';
      
      allResponses.forEach((r, idx) => {
        const time = new Date(r.timestamp).toLocaleString('th-TH');
        const avg = ((r.q1 + r.q2 + r.q3 + r.q4 + r.q5) / 5).toFixed(2);
        const sugg = (r.suggestion || '').replace(/"/g, '""').replace(/\\n/g, ' ');
        csv += \`\${idx + 1},"\${time}",\${r.q1},\${r.q2},\${r.q3},\${r.q4},\${r.q5},\${avg},"\${sugg}"\\n\`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'workshop_results_' + new Date().toISOString().slice(0, 10) + '.csv';
      link.click();
    }

    // Firebase Listener
    window.onload = function() {
      initChart();
      generateQR();

      try {
        if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
          firebase.initializeApp(firebaseConfig);
          const db = firebase.database();
          db.ref('responses').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const list = Object.keys(data).map(k => data[k]);
              list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
              updateDashboard(list);
            } else {
              updateDashboard([]);
            }
          });
        } else {
          // Fallback to local storage for instant demo
          const local = JSON.parse(localStorage.getItem('workshop_pulse_responses_v1') || '[]');
          updateDashboard(local);
        }
      } catch (e) {
        console.error(e);
      }
    };
  </script>
</body>
</html>
`;

export const FIREBASE_SETUP_GUIDE_THAI = `
# คู่มือการติดตั้ง Firebase Realtime Database และ Deploy ฟรี (Step-by-Step)

### 📌 ทำไมถึงเลือก Firebase Realtime Database?
- **อัปเดตทันทีแบบเสี้ยววินาที (Realtime WebSocket):** เมื่อผู้เข้าอบรมกดส่งจากมือถือ หน้าจอ Dashboard บนโปรเจกเตอร์จะขยับคะแนนขึ้นทันทีโดยไม่ต้องกดรีเฟรชหน้าเว็บ
- **ฟรี 100% (Spark Plan):** รองรับผู้เชื่อมต่อพร้อมกันสูงสุด 100 คน และพื้นที่เก็บข้อมูล 1 GB ซึ่งเพียงพอสำหรับจัดการอบรมนับร้อยครั้ง
- **ไม่ต้องล็อกอิน & ไม่เก็บชื่อ:** เหมาะสำหรับงานสัมมนาที่ต้องการผลประเมินที่ตรงไปตรงมาและรวดเร็ว

---

### ขั้นตอนที่ 1: สร้างโปรเจกต์บน Firebase Console
1. ไปที่เว็บไซต์ **[https://console.firebase.google.com/](https://console.firebase.google.com/)** และเข้าสู่ระบบด้วย Google Account
2. คลิกปุ่ม **"Add project"** (หรือสร้างโปรเจกต์)
3. ตั้งชื่อโปรเจกต์ เช่น \`workshop-feedback-2026\` แล้วคลิก **Continue**
4. ในหน้า Google Analytics สามารถเลือกปิด (Disable) หรือเปิดก็ได้ แล้วคลิก **Create project**
5. รอสักครู่จนสร้างเสร็จแล้วคลิก **Continue** เข้าสู่หน้าควบคุม

---

### ขั้นตอนที่ 2: เปิดใช้งาน Realtime Database & ตั้งค่า Rules
1. ที่เมนูด้านซ้าย เลือก **Build** > **Realtime Database**
2. คลิกปุ่ม **"Create Database"**
3. **Database location:** ให้เลือก **Singapore (asia-southeast1)** เพื่อความรวดเร็วที่สุดสำหรับผู้ใช้งานในไทย
4. **Security rules:** เลือก **"Start in test mode"** ชั่วคราว หรือคลิก Enable ได้เลย
5. เมื่อสร้างเสร็จ ให้คลิกแท็บ **"Rules"** ด้านบน แล้วเปลี่ยนโค้ดกฎความปลอดภัยให้ทุกคนสามารถอ่านและส่งคะแนนได้โดยไม่ต้องล็อกอิน:
\`\`\`json
{
  "rules": {
    "responses": {
      ".read": true,
      ".write": true
    }
  }
}
\`\`\`
6. คลิกปุ่ม **"Publish"** สีน้ำเงิน เพื่อเปิดใช้งาน

---

### ขั้นตอนที่ 3: รับค่า Firebase Config มาใส่ในโค้ด
1. คลิกที่ไอคอน **ฟันเฟือง (Project settings)** ด้านบนซ้าย
2. เลื่อนลงมาด้านล่างสุดที่หัวข้อ **"Your apps"**
3. คลิกไอคอน **เว็บ (\`</>\`)** เพื่อสร้าง Web App
4. ตั้งชื่อเล่นแอป เช่น \`Workshop Web\` แล้วคลิก **Register app**
5. คุณจะเห็นบล็อกโค้ด \`const firebaseConfig = { ... };\`
6. คัดลอกค่า \`apiKey\`, \`authDomain\`, \`databaseURL\`, \`projectId\` ฯลฯ
7. นำไปวางแทนที่ในไฟล์ทั้งสอง:
   - ไฟล์ \`survey.html\` (บรรทัดที่ 130)
   - ไฟล์ \`dashboard.html\` (บรรทัดที่ 140)

---

### ขั้นตอนที่ 4: การนำเว็บขึ้นออนไลน์ฟรี (Deploy)

คุณสามารถเลือกวิธีใดวิธีหนึ่งต่อไปนี้ได้ง่ายๆ ภายใน 3 นาที:

#### วิธีที่ A: ใช้ GitHub Pages (แนะนำที่สุด - ทำได้ฟรีตลอดกาล)
1. สร้างโฟลเดอร์ในคอมพิวเตอร์ของคุณ แล้วนำไฟล์ \`survey.html\` (เปลี่ยนชื่อเป็น \`index.html\`) และ \`dashboard.html\` ไปใส่
2. สมัครและสร้าง Repository บน **GitHub** (ตั้งเป็น Public)
3. อัปโหลดไฟล์ทั้งสองขึ้น GitHub
4. ไปที่ **Settings** > **Pages** > เลือก Branch: **main** > กด Save
5. จะได้ URL เช่น \`https://yourusername.github.io/workshop/\` เพื่อแจกผู้เข้าอบรมได้ทันที!

#### วิธีที่ B: ใช้ Netlify Drop (ลากไฟล์วางแล้วเสร็จเลยใน 10 วินาที)
1. ไปที่ **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. ลากโฟลเดอร์ที่บรรจุ \`survey.html\` และ \`dashboard.html\` ไปวาง
3. ระบบจะสร้างลิงก์สดให้คุณทันที

#### วิธีที่ C: ใช้ Firebase Hosting
\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
\`\`\`

---

### 💡 เทคนิคการใช้งานจริงในห้องอบรม
1. **ก่อนเริ่มช่วงประเมิน:** เปิดหน้า \`dashboard.html\` ขึ้นจอโปรเจกเตอร์ใหญ่
2. **กดปุ่ม "ขยายเต็มจอ (Projector)":** กราฟและ QR Code จะแสดงเด่นชัดอยู่มุมจอ
3. **แจ้งผู้เข้าอบรม:** ให้ยกมือถือขึ้นมาสแกน QR Code บนจอโปรเจกเตอร์เพื่อประเมิน
4. **สัมผัสประสบการณ์ Realtime:** เมื่อมีคนกดส่ง กราฟแท่งและตัวเลขคะแนนจะขยับขึ้นสดๆ ทันที สร้างความตื่นเต้นและมีส่วนร่วมในห้องสัมมนา
5. **จบการอบรม:** คลิกปุ่ม **"ดาวน์โหลด CSV"** เพื่อบันทึกเป็นรายงานสรุปนำเสนอผู้บริหาร
`;
