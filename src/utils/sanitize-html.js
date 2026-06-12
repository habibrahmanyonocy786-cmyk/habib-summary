// Habib-summary — HTML Sanitizer
// ============================================================
// پاکسازی و اعتبارسنجی HTML خروجی Mammoth.js و سایر منابع
// ============================================================

const Sanitizer = {
    allowedTags: ['p', 'br', 'b', 'i', 'u', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'pre', 'code', 'hr', 'span', 'div'],

    sanitize(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        this._cleanNode(doc.body);
        return doc.body.innerHTML;
    },

    _cleanNode(node) {
        const children = [...node.children];
        children.forEach(child => {
            if (!this.allowedTags.includes(child.tagName.toLowerCase())) {
                child.replaceWith(...child.childNodes);
            } else {
                this._cleanNode(child);
            }
        });
    },

    stripHtml(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }
};
