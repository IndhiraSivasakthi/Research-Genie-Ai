// 🌟 COMPLETE WORKING SCRIPT - NO ERRORS
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Toast styles (runs first)
if (!document.querySelector('style[data-toast]')) {
    const toastStyle = document.createElement('style');
    toastStyle.setAttribute('data-toast', 'true');
    toastStyle.textContent = `
        .toast {
            position: fixed; top: 2rem; right: -400px;
            padding: 1rem 1.5rem; border-radius: 12px;
            color: white; font-weight: 500; z-index: 10000;
            opacity: 0; transition: all 0.3s ease;
            backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);
        }
        .toast-success { background: rgba(16, 185, 129, 0.95); }
        .toast-info { background: rgba(102, 126, 234, 0.95); }
        .toast-error { background: rgba(239, 68, 68, 0.95); }
    `;
    document.head.appendChild(toastStyle);
}

// 🌟 FIXED: Professional Markdown Parser
async function sendRequest() {
    const content = document.getElementById("content").value.trim();
    const operation = document.getElementById("operation").value;
    const loader = document.getElementById("loader");
    const resultDiv = document.getElementById("result");
    const generateBtn = document.getElementById("generateBtn");
    const resultCard = document.getElementById("resultCard");

    if (!content) {
        showToast("Please paste some content first!", "error");
        return;
    }

    loader.style.display = "block";
    resultDiv.innerHTML = "";
    if (resultCard) resultCard.style.display = "none";
    if (generateBtn) {
        generateBtn.classList.add("loading");
        generateBtn.disabled = true;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch("/api/research/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, operation }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        let result = await response.text();
        result = formatAIResult(result, operation); // ✅ FIXED regex

        resultDiv.innerHTML = result;
        if (resultCard) {
            resultCard.style.display = "block";
            resultCard.scrollIntoView({ behavior: 'smooth' });
        }
        showToast("✨ AI processing complete!", "success");

    } catch (error) {
        if (error.name === 'AbortError') {
            resultDiv.innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center; font-weight: 500;">⏰ Request timed out (30s). Try shorter content.</div>';
        } else {
            resultDiv.innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center; font-weight: 500;">❌ Connection error. Check API server.</div>';
        }
        showToast("Something went wrong! 😞", "error");
    } finally {
        loader.style.display = "none";
        if (generateBtn) {
            generateBtn.classList.remove("loading");
            generateBtn.disabled = false;
        }
    }
}

// ✅ FIXED: Clean regex patterns (NO double backslashes)
function formatAIResult(text, operation) {
    // 1. Clean up multiple newlines
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n');

    // 2. Bold & italic
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 3. Headings
    text = text.replace(/^####\s+(.*)$/gm, '<h4 style="color: #10b981; margin: 1.5rem 0 0.5rem;">$1</h4>');
    text = text.replace(/^###\s+(.*)$/gm, '<h3 style="color: #667eea; margin: 1.5rem 0 0.75rem;">$1</h3>');
    text = text.replace(/^##\s+(.*)$/gm, '<h2 style="color: #f59e0b; margin: 1.5rem 0 1rem;">$1</h2>');
    text = text.replace(/^\#\s+(.*)$/gm, '<h1 style="color: #ef4444; margin: 2rem 0 1rem;">$1</h1>');

    // 4. Lists
    text = text.replace(/^\s*[-*+]\s+(.*)$/gm, '<li style="margin: 0.5rem 0;">$1</li>');
    text = text.replace(/(<li[^>]*>.*?<\/li>)(?=\s*<li|$)/gs, '<ul style="margin: 1rem 0; padding-left: 1.5rem;">$1</ul>');

    // 5. Code blocks & inline code
    text = text.replace(/```[\s\S]*?```/g, match => {
        const code = match.replace(/```/g, '').trim();
        return `<pre style="background: rgba(0,0,0,0.4); border-radius: 12px; padding: 1.5rem; margin: 1rem 0; overflow-x: auto; font-family: monospace; border-left: 4px solid #667eea;"><code>${code}</code></pre>`;
    });
    text = text.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace;">$1</code>');

    // 6. Blockquotes
    text = text.replace(/^>\s+(.*)$/gm, '<blockquote style="color: #9ca3af; margin: 1rem 0; padding: 1rem; border-left: 4px solid #667eea; background: rgba(255,255,255,0.05);"> $1 </blockquote>');

    // 7. Horizontal rules
    text = text.replace(/^[-*_]{3,}\s*$/gm, '<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #667eea, transparent); margin: 2rem 0;">');

    // 8. Links & Images
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">');
    text = text.replace(/\[(.*?)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #60a5fa; text-decoration: none; font-weight: 500; padding: 0.2rem 0.4rem; border-radius: 4px; transition: background 0.2s;">$1</a>');

    // 9. Line breaks
    text = text.replace(/^([^\n<].+)$/gm, '$1<br>');

    // 10. Operation headers
    let operationHeader = '';
    if (operation === 'summarize') {
        operationHeader = '<div style="background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">📝 <strong>Summary Generated</strong></div>';
    } else if (operation === 'points') {
        operationHeader = '<div style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: white; padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600; box-shadow: 0 4px 12px rgba(59,130,246,0.3);">📋 <strong>Bullet Points Extracted</strong></div>';
    } else if (operation === 'suggest') {
        operationHeader = '<div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600; box-shadow: 0 4px 12px rgba(245,158,11,0.3);">💡 <strong>Smart Suggestions</strong></div>';
    }

    return operationHeader + text;
}

// FIXED: Single copyResult with alert
async function copyResult() {
    const result = document.getElementById("result");
    if (!result || !result.textContent.trim()) {
        alert("❌ No content to copy!");
        return;
    }

    const text = result.innerText || result.textContent;
    
    try {
        await navigator.clipboard.writeText(text);
        alert("✅ Copied to clipboard successfully!");
        showToast("Copied! 📋", "success");
    } catch (err) {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert("✅ Copied to clipboard!");
            showToast("Copied! 📋", "success");
        } catch {
            document.body.removeChild(textArea);
            alert("⚠️ Failed to copy. Please select text manually.");
        }
    }
}

// FIXED: Single downloadResult with alert
function downloadResult() {
    const result = document.getElementById("result");
    if (!result || !result.textContent.trim()) {
        alert("❌ No content to download!");
        return;
    }

    const text = result.innerText || result.textContent;
    const operation = document.getElementById("operation").options[document.getElementById("operation").selectedIndex].text;
    const filename = `ResearchGenie_${operation.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.txt`;
    
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ Downloaded!\n\n📄 File: ${filename}\n💾 Saved to Downloads folder`);
    showToast("Downloaded successfully! 💾", "success");
}

// Share function
async function shareResult() {
    const result = document.getElementById("result");
    if (!result) return;
    
    const text = (result.innerText || result.textContent).slice(0, 200) + '...';
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Research Genie AI Result',
                text: text
            });
            showToast("Shared! 📤", "success");
        } catch (err) {
            await copyResult();
        }
    } else {
        await copyResult();
    }
}

// Keyboard shortcuts & auto-resize
document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');
    if (content) {
        content.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') sendRequest();
        });
        content.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
});
