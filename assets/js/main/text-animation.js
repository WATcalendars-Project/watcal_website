window.addEventListener("DOMContentLoaded", () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const iterationsPerChar = 2;
    const scrambleSpeed = 30;

    const elements = document.querySelectorAll(".decrypt-text");

    // Measure the rendered width/height of given text in the same styling as the element
    function measureSize(el, text) {
        const clone = el.cloneNode(true);
        const cs = getComputedStyle(el);
        // Ensure it's not affecting layout
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.pointerEvents = 'none';
        clone.style.whiteSpace = cs.whiteSpace; // preserve wrapping mode
        clone.style.width = 'auto';
        clone.style.minWidth = '0';
        clone.style.maxWidth = 'none';
        clone.style.height = 'auto';
        clone.style.minHeight = '0';
        clone.style.maxHeight = 'none';
        clone.style.transform = 'none';
        clone.style.left = '-9999px';
        clone.style.right = 'auto';
        clone.style.top = '0';
        clone.style.bottom = 'auto';
        clone.textContent = text;
        document.body.appendChild(clone);
        const rect = clone.getBoundingClientRect();
        clone.remove();
        return { width: rect.width, height: rect.height };
    }

    // Fix element box so text changes don't shift layout
    function lockElementSize(el, originalText, targetText) {
        const maxLen = Math.max(originalText?.length || 0, targetText?.length || 0);
        const worstCase = 'W'.repeat(maxLen || 1); // approximate widest
        const a = measureSize(el, originalText || "");
        const b = measureSize(el, targetText || "");
        const c = measureSize(el, worstCase);
        const maxW = Math.ceil(Math.max(a.width, b.width, c.width));
        const maxH = Math.ceil(Math.max(a.height, b.height));
        const cs = getComputedStyle(el);
        // Only apply if inline formatting; keep block-level as-is
        if (cs.display === 'inline') {
            el.style.display = 'inline-block';
        }
        el.style.minWidth = maxW + 'px';
        // Keep height stable if single-line; if wrapping is allowed, omit to avoid clipping
        if ((cs.whiteSpace || '').startsWith('nowrap')) {
            el.style.minHeight = maxH + 'px';
        }
    }

    function animate(el, fromText, toText, reverse = false) {
        clearInterval(el._interval);

        const maxLen = Math.max(fromText.length, toText.length);
        const result = Array.from({ length: maxLen }, (_, i) => fromText[i] || "");
        const targetChars = Array.from({ length: maxLen }, (_, i) => toText[i] || "");

        const counters = new Array(maxLen).fill(0);
        const locked = new Array(maxLen).fill(false);

        const canCount = new Array(maxLen).fill(false);

        if (!reverse) {
            canCount[0] = true;
        } else {
            canCount[maxLen - 1] = true;
        }

        el._interval = setInterval(() => {
            for (let i = 0; i < maxLen; i++) {
                const index = reverse ? maxLen - 1 - i : i;

                if (!canCount[index]) {
                    result[index] = characters[Math.floor(Math.random() * characters.length)];
                    continue;
                }

                if (!locked[index]) {
                    if (counters[index] >= iterationsPerChar) {
                        result[index] = targetChars[index];
                        locked[index] = true;
                        if (!reverse) {
                            if (index + 1 < maxLen) {
                                canCount[index + 1] = true;
                            }
                        } else {
                            if (index - 1 >= 0) {
                                canCount[index - 1] = true;
                            }
                        }
                    } else {
                        result[index] = characters[Math.floor(Math.random() * characters.length)];
                        counters[index]++;
                    }
                } else {
                    result[index] = targetChars[index];
                }
            }

            el.textContent = result.join("");

            if (locked.every(Boolean)) {
                clearInterval(el._interval);
            }
        }, scrambleSpeed);
    }

    elements.forEach((el) => {
        const originalText = el.dataset.original;
        const targetText = el.dataset.target;

        el.textContent = originalText;

        // Prevent layout shift when text changes by locking min-width to max measured size
        lockElementSize(el, originalText, targetText);

        el.addEventListener("mouseenter", () => {
            animate(el, el.textContent, targetText, false);
        });

        el.addEventListener("mouseleave", () => {
            animate(el, el.textContent, originalText, true);
        });
    });

    // Recompute sizes on resize since fonts/containers might change
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            elements.forEach((el) => {
                const originalText = el.dataset.original || '';
                const targetText = el.dataset.target || '';
                // Reset any previous min width to measure fresh
                el.style.minWidth = '';
                el.style.minHeight = '';
                lockElementSize(el, originalText, targetText);
            });
        }, 150);
    });
});
