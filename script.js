// Robust accessible tabs with debug logs
document.addEventListener('DOMContentLoaded', () => {
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

    if (tabs.length === 0) {
        console.warn('Tabs: no [role="tab"] found');
        return;
    }
    if (panels.length === 0) {
        console.warn('Tabs: no [role="tabpanel"] found');
        return;
    }

    function activateTab(tab, pushHash = false) {
        const panelId = tab.getAttribute('aria-controls') || tab.dataset.tab;
        // update tabs
        tabs.forEach(t => {
            const selected = t === tab;
            t.setAttribute('aria-selected', String(selected));
            t.tabIndex = selected ? 0 : -1;
        });
        // update panels
        panels.forEach(p => {
            p.hidden = p.id !== panelId;
        });
        // update hash
        if (panelId) {
            const hash = panelId.startsWith('tab-') ? panelId.replace(/^tab-/, '') : panelId;
            if (pushHash) history.pushState(null, '', `#${hash}`);
            else history.replaceState(null, '', `#${hash}`);
        }
        tab.focus({ preventScroll: true });
        console.debug('Activated tab', tab.dataset.tab || tab.id, 'panel', panelId);
    }

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab(tab, true);
        });
        tab.addEventListener('keydown', (e) => {
            const len = tabs.length;
            let newIdx = i;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') newIdx = (i + 1) % len;
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') newIdx = (i - 1 + len) % len;
            else if (e.key === 'Home') newIdx = 0;
            else if (e.key === 'End') newIdx = len - 1;
            else if (e.key === 'Enter' || e.key === ' ') { activateTab(tab, true); e.preventDefault(); return; }
            if (newIdx !== i) { activateTab(tabs[newIdx], true); e.preventDefault(); }
        });
    });

    window.addEventListener('hashchange', () => {
        const hash = location.hash.replace('#', '');
        if (!hash) return;
        const target = tabs.find(t => {
            const dt = t.dataset.tab;
            const ac = t.getAttribute('aria-controls');
            return dt === hash || ac === `tab-${hash}` || ac === hash;
        });
        if (target) activateTab(target, false);
    });

    // initial
    const initialHash = location.hash.replace('#', '');
    const initialTab = tabs.find(t => {
        const dt = t.dataset.tab;
        const ac = t.getAttribute('aria-controls');
        return (initialHash && (dt === initialHash || ac === `tab-${initialHash}` || ac === initialHash));
    }) || tabs[0];

    activateTab(initialTab, false);
});


// Theme switcher
document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.querySelectorAll('.theme-switch button');
    const root = document.documentElement;

    const saved = localStorage.getItem('theme')
    if (saved) {
        setTheme(saved);
    }

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        themeButton.forEach(btn => {
            btn.setAttribute('aria-pressed', btn.dataset.theme === theme ? 'true' : 'false');
        });

        localStorage.setItem('theme', theme)
    }

    themeButton.forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
        });
    });
});

