// Habib-summary — Local Storage Utilities
// ============================================================
// ذخیره و بازیابی داده‌ها در localStorage
// ============================================================

const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(`habib_${key}`, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Storage.set failed:', e);
            return false;
        }
    },

    get(key, fallback = null) {
        try {
            const val = localStorage.getItem(`habib_${key}`);
            return val ? JSON.parse(val) : fallback;
        } catch (e) {
            return fallback;
        }
    },

    remove(key) {
        localStorage.removeItem(`habib_${key}`);
    },

    clear() {
        Object.keys(localStorage)
            .filter(k => k.startsWith('habib_'))
            .forEach(k => localStorage.removeItem(k));
    }
};
