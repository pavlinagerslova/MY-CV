document.addEventListener('DOMContentLoaded', () => {

    const tabs = [...document.querySelectorAll('[role="tab"]')];
    const panels = [...document.querySelectorAll('[role="tabpanel"]')];

    if (!tabs.length || !panels.length) return;

    function activateTab(tab, updateHash = true) {
        const panelId = tab.getAttribute('aria-controls');

        tabs.forEach(t => {
            const selected = t === tab;
            t.setAttribute('aria-selected', selected);
            t.tabIndex = selected ? 0 : -1;
        });

        panels.forEach(p => {
            p.hidden = p.id !== panelId;
        });

        if (updateHash) {
            const hash = panelId.replace(/^tab-/, '');
            history.replaceState(null, '', `#${hash}`);
        }
    }

    function getTabIndex(tab) {
        return tabs.indexOf(tab);
    }

    tabs.forEach(tab => {

        tab.addEventListener('click', () => {
            activateTab(tab);
        });

        tab.addEventListener('keydown', (e) => {

            const current = getTabIndex(tab);
            let next = current;

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    next = (current + 1) % tabs.length;
                    break;

                case 'ArrowLeft':
                case 'ArrowUp':
                    next = (current - 1 + tabs.length) % tabs.length;
                    break;

                case 'Home':
                    next = 0;
                    break;

                case 'End':
                    next = tabs.length - 1;
                    break;

                case 'Enter':
                case ' ':
                    activateTab(tab);
                    return;
            }

            if (next !== current) {
                tabs[next].focus();
                e.preventDefault();
            }
        });

    });

    // inicializace z hash
    const hash = location.hash.replace('#', '');

    const initialTab =
        tabs.find(tab =>
            tab.dataset.tab === hash ||
            tab.getAttribute('aria-controls') === `tab-${hash}`
        ) || tabs[0];

    activateTab(initialTab, false);
});

// Language switcher with hash preservation
document.querySelectorAll('.lang-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const hash = window.location.hash;

        if (hash) {
            e.preventDefault();
            window.location.href = link.getAttribute('href') + hash;
        }
    });
});


// Theme switcher
document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-switch button');
    const root = document.documentElement;

    const currentTheme = root.getAttribute('data-theme');

    updateButtons(currentTheme);

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateButtons(theme);
    }

    function updateButtons(theme) {
        themeButtons.forEach(btn => {
            btn.setAttribute(
                'aria-pressed',
                btn.dataset.theme === theme ? 'true' : 'false'
            );
        });
    }

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
        });
    });
});

// //Display image in its own size
// document.addEventListener('DOMContentLoaded', () => {
//     const images = document.querySelectorAll('.images img');
//     images.forEach(img => {
//         img.addEventListener('click', () => {
//             const src = img.getAttribute('src');
//             const alt = img.getAttribute('alt') || '';
//             const newWindow = window.open(src, '_blank');
//             if (newWindow) {
//                 newWindow.document.title = alt;
//             }
//         });
//     });
// });