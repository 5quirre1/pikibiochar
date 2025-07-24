// ==UserScript==
// @name         biocharcount
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  adds a char counter to the bio input thingie in settings
// @author       @squirrel
// @match        https://pikidiary.lol/settings
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikidiary.lol
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function createIt(textarea) {
        const counter = document.createElement('div');
        counter.id = 'bio-char-counter';
        counter.style.cssText = `
            font-size: 12px;
            color: var(--small-color);
            position: absolute;
            top: -1px;
            right: -1px;
            background: var(--prof-section-background);
            padding: 4px 8px;
            border: 1px solid var(--prof-border);
            border-bottom: none;
            border-top-left-radius: 0;
            border-top-right-radius: 3px;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 0;
            z-index: 10;
            pointer-events: none;
            font-weight: 500;
            transition: opacity 0.2s ease;
        `;

        const textareaContainer = textarea.parentNode;
        if (textareaContainer.style.position !== 'relative') {
            textareaContainer.style.position = 'relative';
        }

        textareaContainer.appendChild(counter);
        return counter;
    }

    function update(counter, textLength, maxLength) {
        const remaining = maxLength - textLength;
        counter.textContent = `${remaining}/${maxLength}`;

        if (remaining < 50) {
            counter.style.color = '#d02222';
            counter.style.background = 'rgba(208, 34, 34, 0.1)';
        } else if (remaining < 200) {
            counter.style.color = '#ff8c00';
            counter.style.background = 'rgba(255, 140, 0, 0.1)';
        } else {
            counter.style.color = 'var(--small-color)';
            counter.style.background = 'rgba(255, 255, 255, 0.9)';
        }

        const isDark = document.body.classList.contains('dark');
        if (isDark) {
            if (remaining >= 200) {
                counter.style.background = 'rgba(34, 34, 34, 0.9)';
            }
        }
    }

    function addEventsForStuff(textarea, counter) {
        textarea.addEventListener('focus', () => {
            counter.style.opacity = '1';
        });

        textarea.addEventListener('blur', () => {
            counter.style.opacity = '0.7';
        });

        counter.style.opacity = '0.7';
    }

    function initTheCountrer() {
        const textarea = document.getElementById('bio');
        if (!textarea) return;

        const maxLength = parseInt(textarea.getAttribute('maxlength')) || 1500;

        const existingCounter = document.getElementById('bio-char-counter');
        if (existingCounter) {
            existingCounter.remove();
        }

        const counter = createIt(textarea);
        addEventsForStuff(textarea, counter);

        const handleInput = () => update(counter, textarea.value.length, maxLength);
        textarea.addEventListener('input', handleInput);

        handleInput();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheCountrer);
    } else {
        initTheCountrer();
    }

    window.addEventListener('load', initTheCountrer);
})();
