// Habib-summary — Main Application Entry
// ============================================================
// ماژول اصلی — مدیریت state، tabها، روتینگ ساده
// ============================================================

const App = {
    state: {
        currentTab: 'summaries',
        activeBookId: null,
        qIndex: 0,
        qAnswers: {},
        qFinished: false,
        mixedQuestions: [],
        mixedIndex: 0,
        mixedAnswers: {},
        mixedFinished: false,
        mixedStarted: false,
        uploadedFile: null,
        extractedText: ''
    },

    init() {
        this.cacheDom();
        this.bindEvents();
        this.render();
    },

    cacheDom() {
        this.els = {
            views: {
                summaries: document.getElementById('view-summaries'),
                questions: document.getElementById('view-questions'),
                mixed: document.getElementById('view-mixed'),
                upload: document.getElementById('view-upload')
            },
            tabBtns: document.querySelectorAll('.tab-btn'),
            booksContainer: document.getElementById('booksContainer'),
            summaryPanel: document.getElementById('summaryPanel'),
            questionBookSelect: document.getElementById('questionBookSelect'),
            questionArea: document.getElementById('questionArea'),
            mixedArea: document.getElementById('mixedArea'),
            uploadArea: document.getElementById('uploadArea')
        };
    },

    bindEvents() {
        // Tab switching
        this.els.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    },

    switchTab(tab) {
        this.state.currentTab = tab;
        this.els.tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
        Object.keys(this.els.views).forEach(key =>
            this.els.views[key].classList.remove('active')
        );
        this.els.views[tab].classList.add('active');
    },

    render() {
        // Delegates to sub-modules
        if (typeof renderBooks === 'function') renderBooks();
        if (typeof renderQuestionBookSelect === 'function') renderQuestionBookSelect();
        if (typeof renderQuestionView === 'function') renderQuestionView();
        if (typeof renderMixedView === 'function') renderMixedView();
        if (typeof renderUploadView === 'function') renderUploadView();
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
