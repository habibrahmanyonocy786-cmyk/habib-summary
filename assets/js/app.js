// Habib-summary — Unified Application Controller
// ============================================================

window.$ = window.$ || (s => document.querySelector(s));
window.$$ = window.$$ || (s => document.querySelectorAll(s));

function fmtNum(n) {
  try { return n.toLocaleString('fa-IR') } catch(e) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }
}

const Habib = {
  // ---- Data ----
  books: [
    { id:'atomic', title:'کتاب عادات اتمی (Atomic Habits)', author:'جیمز کلیر (James Clear)',
      emoji:'⚛️', color:'from-blue-500 to-indigo-600',
      summary:'کتاب عادات اتمی اثر جیمز کلیر بر این اصل استوار است که تغییرات کوچک و تدریجی (یک درصد بهتر هر روز) به نتایج بزرگ و پایدار منجر می‌شوند. کلیر چهار قانون تغییر رفتار را معرفی می‌کند: آشکارسازی، جذاب‌سازی، آسان‌سازی، و رضایت‌بخشی. او تأکید می‌کند به جای تمرکز بر اهداف، بر سیستم‌ها و هویت خود تمرکز کنید.',
      questions:[
        { q:'بر اساس کتاب عادات اتمی، قانون اول تغییر رفتار چیست؟', options:['آشکارسازی (Make it Obvious)','جذاب‌سازی (Make it Attractive)','آسان‌سازی (Make it Easy)','رضایت‌بخشی (Make it Satisfying)'], correct:0 },
        { q:'جیمز کلیر به جای تمرکز بر اهداف، بر چه چیزی تأکید می‌کند؟', options:['نتیجه نهایی','سیستم‌ها و هویت','تلاش بیشتر','انضباط شخصی'], correct:1 },
        { q:'مفهوم "عادت اتمی" به چه معناست؟', options:['عادت‌های بسیار سخت','تغییرات کوچک که در طول زمان نتایج بزرگ ایجاد می‌کنند','عادت‌هایی که به انرژی اتمی نیاز دارند','ترک عادت‌های بد در یک روز'], correct:1 }
      ]},
    { id:'richdad', title:'کتاب پدر پولدار پدر بی‌پول (Rich Dad Poor Dad)', author:'رابرت کیوساکی (Robert Kiyosaki)',
      emoji:'💰', color:'from-amber-500 to-yellow-600',
      summary:'رابرت کیوساکی در این کتاب دو دیدگاه متضاد نسبت به پول را روایت می‌کند: دیدگاه "پدر بی‌پول" (پدر واقعی او که تحصیلکرده اما از نظر مالی ورشکست بود) و "پدر پولدار" (پدر دوستش که ثروتمند بود). اصل کلیدی این است که افراد ثروتمند به جای کار کردن برای پول، پول را برای خود کار می‌گذارند.',
      questions:[
        { q:'به گفته کیوساکی، "دارایی" (Asset) چیست؟', options:['چیزی که ارزش آن افزایش می‌یابد','چیزی که پول به جیب شما می‌آورد','چیزی که می‌توانید بفروشید','خانه شخصی شما'], correct:1 },
        { q:'مفهوم "مسابقه موش‌ها" (Rat Race) در کتاب چیست؟', options:['رقابت برای کسب مقام بهتر در کار','چرخه بی‌پایان کار کردن برای پرداخت قبوض و هزینه‌ها','مسابقه برای ثروتمند شدن','رقابت بین پدر پولدار و پدر بی‌پول'], correct:1 },
        { q:'به نظر کیوساکی، افراد ثروتمند چه کاری انجام می‌دهند؟', options:['پس‌انداز می‌کنند','پول را برای خود کار می‌گذارند','سخت‌تر از دیگران کار می‌کنند','مدرک تحصیلی بالاتری می‌گیرند'], correct:1 }
      ]},
    { id:'habits7', title:'کتاب هفت عادت مردم مؤثر (7 Habits)', author:'استیون کاوی (Stephen Covey)',
      emoji:'🌟', color:'from-emerald-500 to-teal-600',
      summary:'استیون کاوی در این کتاب هفت عادت را معرفی می‌کند که افراد مؤثر برای موفقیت شخصی و حرفه‌ای به کار می‌گیرند. سه عادت اول (پیش‌فعالی، هدف‌گرایی در پایان، اولویت‌بندی) مربوط به پیروزی شخصی هستند. سه عادت بعدی (برنده-برنده اندیشی، اول گوش دادن بعد صحبت کردن، هم‌افزایی) به پیروزی جمعی مربوط می‌شوند. عادت هفتم (تیز کردن اره) به بهبود و تجدید قوا اشاره دارد.',
      questions:[
        { q:'عادت "پیش‌فعالی" (Proactivity) یعنی چه؟', options:['سریع عمل کردن','مسئولیت‌پذیری در قبال انتخاب‌ها و واکنش‌ها','فعالیت بدنی منظم','پیش‌بینی آینده'], correct:1 },
        { q:'عادت "با هدف نهایی شروع کن" بر چه اساسی است؟', options:['تعیین اهداف سالانه','داشتن چشم‌انداز و مأموریت شخصی','پایان دادن به کارها','برنامه‌ریزی روزانه'], correct:1 },
        { q:'منظور از "هم‌افزایی" (Synergize) در کتاب چیست؟', options:['کار گروهی ساده','ترکیب نقاط قوت افراد برای نتیجه‌ای بهتر از مجموع فردی','رقابت سازنده','تقسیم کار'], correct:1 }
      ]}
  ],

  // ---- State ----
  state: {
    tab: 'summaries',
    activeBook: null,
    qIdx: 0, qAns: {}, qDone: false,
    mQuestions: [], mIdx: 0, mAns: {}, mDone: false, mStarted: false,
    articles: [], selectedArticle: null,
    file: null, extractedText: ''
  },

  // ---- Init ----
  init() {
    this.cache();
    this.bind();
    this.render();
    this.loadArticles();
  },

  cache() {
    this.els = {
      views: {
        summaries: $('#view-summaries'),
        questions: $('#view-questions'),
        mixed: $('#view-mixed'),
        articles: $('#view-articles'),
        upload: $('#view-upload')
      },
      tabs: $$('.tab-btn'),
      books: $('#books'),
      summary: $('#summary'),
      qSelect: $('#qBookSelect'),
      qArea: $('#qArea'),
      mixed: $('#mixed'),
      articles: $('#articles'),
      upload: $('#upload')
    };
  },

  bind() {
    this.els.tabs.forEach(b => b.addEventListener('click', () => this.switchTab(b.dataset.tab)));
  },

  switchTab(tab) {
    this.state.tab = tab;
    this.els.tabs.forEach(b => { b.classList.toggle('active', b.dataset.tab === tab); });
    Object.keys(this.els.views).forEach(k => this.els.views[k].classList.toggle('active', k === tab));
    if (tab === 'articles') this.renderArticles();
    if (tab === 'upload') this.renderUpload();
  },

  render() {
    this.renderBooks();
    this.renderQSelect();
    this.renderQView();
    this.renderMixed();
    this.renderUpload();
  },

  // ============================================================
  // 1. BOOK SUMMARIES
  // ============================================================
  renderBooks() {
    this.els.books.innerHTML = this.books.map(b => `
      <div class="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow" onclick="Habib.showBook('${b.id}')">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">${b.emoji}</span>
          <div>
            <h3 class="font-bold text-gray-800 text-sm">${b.title}</h3>
            <p class="text-gray-500 text-xs">${b.author}</p>
          </div>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">${b.summary.substring(0, 120)}...</p>
      </div>
    `).join('');
  },

  showBook(id) {
    const b = this.books.find(x => x.id === id);
    if (!b) return;
    this.els.summary.innerHTML = `
      <div class="bg-white rounded-xl border border-gray-200 p-5 mt-4">
        <button class="float-left text-gray-400 hover:text-gray-600 text-sm" onclick="Habib.els.summary.innerHTML=''">✕</button>
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">${b.emoji}</span>
          <div>
            <h3 class="font-bold text-gray-800 text-lg">${b.title}</h3>
            <p class="text-gray-500 text-sm">${b.author}</p>
          </div>
        </div>
        <p class="text-gray-700 leading-8 text-justify text-base">${b.summary}</p>
      </div>
    `;
    this.els.summary.scrollIntoView({ behavior:'smooth', block:'start' });
  },

  // ============================================================
  // 2. QUESTIONS
  // ============================================================
  renderQSelect() {
    this.els.qSelect.innerHTML = this.books.map(b => `
      <button class="px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${this.state.activeBook === b.id ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}"
        onclick="Habib.startQ('${b.id}')">${b.emoji} ${b.title.substring(0, 25)}</button>
    `).join('');
  },

  startQ(id) {
    this.state.activeBook = id;
    this.state.qIdx = 0; this.state.qAns = {}; this.state.qDone = false;
    this.renderQSelect();
    this.renderQView();
  },

  renderQView() {
    const b = this.books.find(x => x.id === this.state.activeBook);
    if (!b) { this.els.qArea.innerHTML = '<div class="text-center py-12 text-gray-500">لطفاً یک کتاب را انتخاب کنید</div>'; return; }
    if (this.state.qDone) { this.renderQResult(b); return; }

    const q = b.questions[this.state.qIdx];
    const total = b.questions.length;
    const sel = this.state.qAns[this.state.qIdx];
    const pct = (this.state.qIdx / total) * 100;

    this.els.qArea.innerHTML = `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex justify-between text-sm text-gray-500 mb-2"><span>${b.emoji} ${b.title}</span><span class="font-bold">${this.state.qIdx+1}/${total}</span></div>
        <div class="progress-bar mb-4"><div class="fill" style="width:${pct}%"></div></div>
        <h3 class="font-bold text-gray-800 mb-4 text-base">${q.q}</h3>
        <div class="space-y-2">${q.options.map((o,i) => `<button class="option-btn ${sel===i?'selected':''}" onclick="Habib.selectQ(${i})"><span class="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-200 text-xs font-bold ml-2 ${sel===i?'bg-gray-800 text-white':''}">${String.fromCharCode(65+i)}</span>${o}</button>`).join('')}</div>
        <div class="flex justify-between mt-5 pt-4 border-t border-gray-100">
          <button class="px-4 py-2 rounded-lg text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 ${this.state.qIdx===0?'opacity-0':''}" onclick="if(Habib.state.qIdx>0){Habib.state.qIdx--;Habib.renderQView()}">قبلی</button>
          <button class="px-4 py-2 rounded-lg text-sm text-white ${sel!==undefined?'bg-gray-800 hover:bg-gray-700':'bg-gray-300 cursor-not-allowed'}" ${sel===undefined?'disabled':''} onclick="Habib.nextQ(${total})">${this.state.qIdx+1===total?'پایان':'بعدی'}</button>
        </div>
      </div>`;
  },

  selectQ(i) { if (!this.state.qDone) { this.state.qAns[this.state.qIdx] = i; this.renderQView(); } },

  nextQ(total) {
    if (this.state.qIdx+1 === total) { this.state.qDone = true; this.renderQView(); }
    else { this.state.qIdx++; this.renderQView(); }
  },

  renderQResult(b) {
    const total = b.questions.length;
    let correct = 0;
    const items = b.questions.map((q,i) => {
      const u = this.state.qAns[i];
      const ok = u === q.correct;
      if (ok) correct++;
      return `<div class="p-3 ${ok?'bg-emerald-50 border-emerald-200':'bg-red-50 border-red-200'} rounded-lg border text-sm"><p class="font-medium mb-1">${i+1}. ${q.q}</p><p class="${ok?'text-emerald-700':'text-red-600'}">پاسخ شما: ${u!==undefined?q.options[u]:'پاسخی داده نشده'}</p>${!ok?`<p class="text-emerald-700">پاسخ صحیح: ${q.options[q.correct]}</p>`:''}</div>`;
    }).join('');
    const pct = (correct/total)*100;
    this.els.qArea.innerHTML = `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-center mb-4"><span class="text-4xl">${pct===100?'🏆':pct>=66?'🌟':pct>=33?'📖':'💪'}</span><h3 class="text-xl font-bold mt-2">${correct} از ${total}</h3></div>
        <div class="space-y-3">${items}</div>
        <div class="flex gap-3 mt-5 pt-4 border-t border-gray-100">
          <button class="flex-1 py-2.5 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700" onclick="Habib.startQ('${b.id}')">شروع مجدد</button>
          <button class="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200" onclick="Habib.state.activeBook=null;Habib.state.qIdx=0;Habib.state.qAns={};Habib.state.qDone=false;Habib.renderQSelect();Habib.renderQView()">کتاب دیگر</button>
        </div>
      </div>`;
  },

  // ============================================================
  // 3. MIXED TEST
  // ============================================================
  startMixed() {
    const all = [];
    this.books.forEach(b => b.questions.forEach(q => all.push({...q, bookTitle:b.title, emoji:b.emoji})));
    for (let i=all.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [all[i],all[j]]=[all[j],all[i]]; }
    this.state.mQuestions = all.slice(0,5);
    this.state.mIdx = 0; this.state.mAns = {}; this.state.mDone = false; this.state.mStarted = true;
    this.renderMixed();
  },

  renderMixed() {
    if (!this.state.mStarted) {
      this.els.mixed.innerHTML = `<div class="text-center py-16 bg-white rounded-xl border border-gray-200"><div class="text-5xl mb-4">🧪</div><h3 class="text-xl font-bold text-gray-800 mb-2">آزمون ترکیبی</h3><p class="text-gray-500 mb-6">۵ سوال تصادفی از تمام کتاب‌ها</p><button class="px-6 py-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700" onclick="Habib.startMixed()">شروع آزمون</button></div>`;
      return;
    }
    if (this.state.mDone) { this.renderMixedResult(); return; }

    const q = this.state.mQuestions[this.state.mIdx];
    const total = this.state.mQuestions.length;
    const sel = this.state.mAns[this.state.mIdx];
    this.els.mixed.innerHTML = `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex justify-between text-sm text-gray-500 mb-2"><span>${q.emoji} ${q.bookTitle}</span><span class="font-bold">${this.state.mIdx+1}/${total}</span></div>
        <div class="progress-bar mb-4"><div class="fill" style="width:${(this.state.mIdx/total)*100}%"></div></div>
        <h3 class="font-bold text-gray-800 mb-4 text-base">${q.q}</h3>
        <div class="space-y-2">${q.options.map((o,i) => `<button class="option-btn ${sel===i?'selected':''}" onclick="if(!Habib.state.mDone){Habib.state.mAns[Habib.state.mIdx]=i;Habib.renderMixed()}"><span class="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-200 text-xs font-bold ml-2 ${sel===i?'bg-gray-800 text-white':''}">${String.fromCharCode(65+i)}</span>${o}</button>`).join('')}</div>
        <div class="flex justify-between mt-5 pt-4 border-t border-gray-100">
          <button class="px-4 py-2 rounded-lg text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 ${this.state.mIdx===0?'opacity-0':''}" onclick="if(Habib.state.mIdx>0){Habib.state.mIdx--;Habib.renderMixed()}">قبلی</button>
          <button class="px-4 py-2 rounded-lg text-sm ${sel!==undefined?'bg-gray-800 text-white hover:bg-gray-700':'bg-gray-300 text-gray-500 cursor-not-allowed'}" ${sel===undefined?'disabled':''} onclick="if(sel!==undefined){if(Habib.state.mIdx+1===total){Habib.state.mDone=true;Habib.renderMixed()}else{Habib.state.mIdx++;Habib.renderMixed()}}">${this.state.mIdx+1===total?'پایان':'بعدی'}</button>
        </div>
      </div>`;
  },

  renderMixedResult() {
    const total = this.state.mQuestions.length;
    let correct = 0;
    const items = this.state.mQuestions.map((q,i) => {
      const u = this.state.mAns[i];
      const ok = u === q.correct;
      if (ok) correct++;
      return `<div class="p-3 ${ok?'bg-emerald-50 border-emerald-200':'bg-red-50 border-red-200'} rounded-lg border text-sm"><div class="text-xs text-gray-500">${q.emoji} ${q.bookTitle}</div><p class="font-medium mb-1">${i+1}. ${q.q}</p><p class="${ok?'text-emerald-700':'text-red-600'}">پاسخ شما: ${u!==undefined?q.options[u]:'پاسخی داده نشده'}</p>${!ok?`<p class="text-emerald-700">پاسخ صحیح: ${q.options[q.correct]}</p>`:''}</div>`;
    }).join('');
    this.els.mixed.innerHTML = `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-center mb-4"><span class="text-4xl">${correct===total?'🏆':correct>=3?'🌟':correct>=2?'📖':'💪'}</span><h3 class="text-xl font-bold mt-2">${correct} از ${total}</h3></div>
        <div class="space-y-3">${items}</div>
        <button class="w-full py-2.5 rounded-lg bg-gray-800 text-white text-sm font-medium mt-4 hover:bg-gray-700" onclick="Habib.state.mStarted=false;Habib.state.mDone=false;Habib.state.mQuestions=[];Habib.state.mIdx=0;Habib.state.mAns={};Habib.renderMixed()">شروع مجدد</button>
      </div>`;
  },

  // ============================================================
  // 4. ECONOMIC ARTICLES
  // ============================================================
  async loadArticles() {
    try {
      const res = await fetch('data.json');
      const data = await res.json();
      this.state.articles = data.articles;
      if (this.state.tab === 'articles') this.renderArticles();
    } catch(e) {
      console.warn('Failed to load articles:', e);
    }
  },

  renderArticles() {
    const arts = this.state.articles;
    if (!arts.length) {
      this.els.articles.innerHTML = '<div class="text-center py-12 text-gray-500">در حال بارگذاری مقالات...</div>';
      return;
    }
    const cats = [...new Set(arts.map(a => a.category))];
    this.els.articles.innerHTML = `
      <div class="flex flex-wrap gap-2 mb-4">
        <button class="tag tag-neutral" onclick="Habib.filterArticles('all')" id="af-all">همه (${arts.length})</button>
        ${cats.map(c => `<button class="tag tag-neutral" onclick="Habib.filterArticles('${c}')" id="af-${c}">${c.replace('_',' ')} (${arts.filter(a=>a.category===c).length})</button>`).join('')}
      </div>
      <div id="articlesList" class="space-y-3">${arts.map(a => Habib.articleCard(a)).join('')}</div>
      <div id="articleDetail" class="hidden"></div>
    `;
  },

  articleCard(a) {
    const tagClass = `tag-${a.sentiment}`;
    return `<div class="article-card" onclick="Habib.showArticle('${a.id}')">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h4 class="font-bold text-gray-800 text-sm leading-snug mb-1">${a.title}</h4>
          <p class="text-gray-500 text-xs">${a.source} • ${a.published_at.substring(0,10)}</p>
        </div>
        <span class="tag ${tagClass} shrink-0">${a.sentiment}</span>
      </div>
      <p class="text-gray-600 text-sm mt-2 leading-relaxed">${a.summary}</p>
      <div class="flex flex-wrap gap-1 mt-2">${a.tags.map(t => `<span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#${t}</span>`).join('')}</div>
    </div>`;
  },

  filterArticles(cat) {
    const arts = cat === 'all' ? this.state.articles : this.state.articles.filter(a => a.category === cat);
    document.getElementById('articlesList').innerHTML = arts.length ? arts.map(a => Habib.articleCard(a)).join('') : '<p class="text-gray-400 text-center py-8">نتیجه‌ای یافت نشد</p>';
    document.querySelectorAll('[id^="af-"]').forEach(b => b.className = 'tag tag-neutral');
    const btn = document.getElementById(`af-${cat}`);
    if (btn) btn.className = 'tag tag-negative';
  },

  showArticle(id) {
    const a = this.state.articles.find(x => x.id === id);
    if (!a) return;
    document.getElementById('articlesList').classList.add('hidden');
    document.getElementById('articleDetail').classList.remove('hidden');
    document.getElementById('articleDetail').innerHTML = `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <button class="text-gray-400 hover:text-gray-600 text-sm mb-3" onclick="document.getElementById('articlesList').classList.remove('hidden');document.getElementById('articleDetail').classList.add('hidden')">← بازگشت به لیست</button>
        <div class="flex items-center justify-between mb-3"><h3 class="font-bold text-gray-800 text-lg">${a.title}</h3><span class="tag tag-${a.sentiment}">${a.sentiment}</span></div>
        <p class="text-gray-500 text-xs mb-4">${a.source} • ${a.published_at.substring(0,10)} • <a href="${a.url}" target="_blank" class="text-blue-600 hover:underline">مشاهده منبع</a></p>
        <p class="text-gray-700 leading-8">${a.summary}</p>
        <div class="flex flex-wrap gap-1 mt-4">${a.tags.map(t => `<span class="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded">#${t}</span>`).join('')}</div>
        <p class="text-xs text-gray-400 mt-4">دسته: ${a.category.replace('_',' ')}</p>
      </div>`;
  },

  // ============================================================
  // 5. UPLOAD & SUMMARIZE
  // ============================================================
  renderUpload() {
    this.els.upload.innerHTML = `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200" id="dropZone">
          <div class="text-4xl mb-3" id="dropIcon">📄</div>
          <h3 class="font-bold text-gray-700 mb-1">آپلود فایل کتاب</h3>
          <p class="text-gray-500 text-sm mb-4">فایل را اینجا رها کنید یا کلیک کنید</p>
          <p class="text-xs text-gray-400 mb-4">PDF, DOCX, JPEG, PNG — حداکثر ۵۰ مگابایت</p>
          <button class="px-5 py-2.5 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700" onclick="document.getElementById('fileInput').click()">انتخاب فایل</button>
          <input type="file" id="fileInput" accept=".pdf,.docx,.doc,.jpg,.jpeg,.png" class="hidden">
          <div id="fileInfo" class="hidden mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div class="flex items-center gap-3"><span id="fileIcon" class="text-2xl">📕</span><div class="flex-1 min-w-0"><p id="fileName" class="font-medium text-gray-800 truncate text-sm"></p><p id="fileSize" class="text-xs text-gray-500"></p></div>
            <button class="text-red-400 hover:text-red-600 text-sm" id="removeFileBtn">✕</button></div>
          </div>
        </div>
        <div id="processingArea" class="hidden mt-4"></div>
        <div id="resultArea" class="hidden mt-4"></div>
      </div>`;
    this.initDropZone();
  },

  initDropZone() {
    const zone = document.getElementById('dropZone');
    const input = document.getElementById('fileInput');
    document.querySelector('button[onclick*="fileInput.click()"]')?.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (f) this.handleFileSelect(f);
    });

    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.style.borderColor = '#1e3a5f'; zone.style.background = '#eef4ff'; document.getElementById('dropIcon').textContent = '📥'; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor = '#d1d5db'; zone.style.background = 'transparent'; document.getElementById('dropIcon').textContent = '📄'; });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.style.borderColor = '#d1d5db'; zone.style.background = 'transparent';
      document.getElementById('dropIcon').textContent = '📄';
      const f = e.dataTransfer.files[0];
      if (f) this.handleFileSelect(f);
    });

    document.getElementById('removeFileBtn')?.addEventListener('click', () => this.resetUpload());
  },

  resetUpload() {
    this.state.file = null;
    this.state.extractedText = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('fileInfo').classList.add('hidden');
    document.getElementById('resultArea')?.classList.add('hidden');
    document.getElementById('processingArea')?.classList.add('hidden');
    document.getElementById('dropIcon').textContent = '📄';
  },

  handleFileSelect(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const valid = ['pdf','docx','doc','jpg','jpeg','png'];
    if (!valid.includes(ext)) { alert('فرمت پشتیبانی نمی‌شود'); return; }
    if (file.size > 50*1024*1024) { alert('حجم فایل بیش از ۵۰ مگابایت'); return; }
    this.state.file = file;
    document.getElementById('fileIcon').textContent = ext==='pdf'?'📕':ext.startsWith('doc')?'📘':'🖼️';
    document.getElementById('fileName').textContent = file.name;
    const kb = (file.size/1024).toFixed(1);
    document.getElementById('fileSize').textContent = kb > 1024 ? `${(file.size/(1024*1024)).toFixed(1)} مگابایت` : `${kb} کیلوبایت`;
    document.getElementById('fileInfo').classList.remove('hidden');
    this.processFile(file);
  },

  async processFile(file) {
    const pa = document.getElementById('processingArea');
    const ra = document.getElementById('resultArea');
    pa.classList.remove('hidden');
    ra.classList.add('hidden');
    pa.innerHTML = `<div class="text-center py-6 bg-gray-50 rounded-lg"><div class="flex justify-center gap-2 mb-3"><span class="pulse-loader"></span><span class="pulse-loader"></span><span class="pulse-loader"></span></div><p class="text-gray-700 font-medium" id="procStatus">در حال استخراج متن...</p></div>`;

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      let text = '';
      if (ext === 'pdf') {
        const buf = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({data:buf}).promise;
        for (let i=1; i<=pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const c = await page.getTextContent();
          text += c.items.map(x => x.str).join(' ') + '\n';
        }
      } else if (ext.startsWith('doc')) {
        const buf = await file.arrayBuffer();
        const r = await mammoth.extractRawText({arrayBuffer:buf});
        text = r.value;
      } else if (['jpg','jpeg','png'].includes(ext)) {
        const url = URL.createObjectURL(file);
        const {data} = await Tesseract.recognize(url, 'fas');
        text = data.text;
        URL.revokeObjectURL(url);
      }
      this.state.extractedText = text.trim();
      if (!text.trim()) { pa.innerHTML = '<div class="text-center py-6 bg-red-50 rounded-lg text-red-700">متنی استخراج نشد</div>'; return; }

      document.getElementById('procStatus').textContent = 'در حال خلاصه‌سازی...';
      const summary = typeof Summarizer !== 'undefined' ? Summarizer.generate(text) : {text: text.substring(0,500), words: 80, ratio: 0.5};
      pa.classList.add('hidden');
      this.showResult(text, summary);
    } catch(err) {
      pa.innerHTML = `<div class="text-center py-6 bg-red-50 rounded-lg text-red-700"><p>خطا: ${err.message}</p><button class="mt-3 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm" onclick="Habib.renderUpload()">تلاش مجدد</button></div>`;
    }
  },

  copySummary(btn) {
    navigator.clipboard.writeText(document.getElementById('summaryContent').textContent).then(() => {
      btn.textContent = '✅ کپی شد';
      setTimeout(() => { btn.innerHTML = 'کپی خلاصه'; }, 2000);
    });
  },

  showResult(original, summary) {
    const ra = document.getElementById('resultArea');
    const origWords = original.split(/\s+/).filter(w => w.length > 0).length;
    ra.classList.remove('hidden');
    ra.innerHTML = `
      <div class="space-y-4">
        <div class="bg-gray-800 rounded-xl p-5 text-white text-center">
          <div class="text-4xl mb-2">📝</div>
          <h3 class="text-lg font-bold">خلاصه کتاب</h3>
          <div class="flex justify-center gap-4 mt-3 text-sm">
            <div class="bg-white/10 rounded-lg px-3 py-2"><span class="block text-lg font-bold">${fmtNum(origWords)}</span><span class="text-white/60 text-xs">کلمه اصلی</span></div>
            <div class="bg-white/10 rounded-lg px-3 py-2"><span class="block text-lg font-bold">${fmtNum(summary.words)}</span><span class="text-white/60 text-xs">کلمه خلاصه</span></div>
            <div class="bg-white/10 rounded-lg px-3 py-2"><span class="block text-lg font-bold">${(summary.ratio*100).toFixed(1)}%</span><span class="text-white/60 text-xs">نسبت</span></div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h4 class="font-bold text-gray-800 mb-3">خلاصه</h4>
          <p class="text-gray-700 leading-8" id="summaryContent">${summary.text}</p>
        </div>
        <div class="flex gap-3">
          <button class="flex-1 py-2.5 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700" onclick="Habib.copySummary(this)">کپی خلاصه</button>
          <button class="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200" onclick="Habib.state.file=null;Habib.state.extractedText='';Habib.renderUpload()">فایل جدید</button>
        </div>
      </div>`;
  }
};

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => Habib.init());
