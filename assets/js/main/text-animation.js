window.addEventListener("DOMContentLoaded", () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const iterationsPerChar = 2;
    const scrambleSpeed = 30;

    const elements = document.querySelectorAll(".decrypt-text");

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

        el.addEventListener("mouseenter", () => {
            animate(el, el.textContent, targetText, false);
        });

        el.addEventListener("mouseleave", () => {
            animate(el, el.textContent, originalText, true);
        });
    });
});
