// 🌟 COMPLETE SCRIPT - ALERTS ONLY (No Toasts)
async function sendRequest() {
    const content = document.getElementById("content").value.trim();
    const operation = document.getElementById("operation").value;
    const loader = document.getElementById("loader");
    const resultDiv = document.getElementById("result");
    const generateBtn = document.getElementById("generateBtn");
    const resultCard = document.getElementById("resultCard");

    if (!content) {
        alert("❌ Please paste some content first!");
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
        result = formatAIResult(result, operation);

        resultDiv.innerHTML = result;
        if (resultCard) {
            resultCard.style.display = "block";
            resultCard.scrollIntoView({ behavior: 'smooth' });
        }
        alert("✅ ✨ AI processing complete!");

    } catch (error) {
        if (error.name === 'AbortError') {
            resultDiv.innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center; font-weight: 500;">⏰ Request timed out (30s). Try shorter content.</div>';
            alert("⏰ Request timed out (30s)!");
        } else {
            resultDiv.innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center; font-weight: 500;">❌ Connection error. Check API server.</div>';
            alert("❌ Connection error! Check API server.");
        }
    } finally {
        loader.style.display = "none";
        if (generateBtn) {
            generateBtn.classList.remove("loading");
            generateBtn.disabled = false;
        }
    }
}

// ✅ CLEAN Markdown Parser
function formatAIResult(text, operation) {
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Headings
    text = text.replace(/^####\s+(.*)$/gm, '<h4 style="color: #10b981;">$1</h4>');
    text = text.replace(/^###\s+(.*)$/gm, '<h3 style="color: #667eea;">$1</h3>');
    text = text.replace(/^##\s+(.*)$/gm, '<h2 style="color: #f59e0b;">$1</h2>');
    text = text.replace(/^\#\s+(.*)$/gm, '<h1 style="color: #ef4444;">$1</h1>');

    // Lists
    text = text.replace(/^\s*[-*+]\s+(.*)$/gm, '<li style="margin: 0.5rem 0;">$1</li>');
    text = text.replace(/(<li>.*?<\/li>)(?=\s*<li|$)/gs, '<ul style="margin: 1rem 0; padding-left: 1.5rem;">$1</ul>');

    // Code
    text = text.replace(/```[\s\S]*?```/g, match => {
        const code = match.replace(/```/g, '').trim();
        return `<pre style="background: rgba(0,0,0,0.4); border-radius: 12px; padding: 1.5rem; margin: 1rem 0; overflow-x: auto; font-family: monospace;"><code>${code}</code></pre>`;
    });
    text = text.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px;">$1</code>');

    // Blockquotes
    text = text.replace(/^>\s+(.*)$/gm, '<blockquote style="color: #9ca3af; margin: 1rem 0; padding: 1rem; border-left: 4px solid #667eea;">$1</blockquote>');

    // Links
    text = text.replace(/\[(.*?)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #60a5fa; font-weight: 500;">$1</a>');

    text = text.replace(/^([^\n<].+)$/gm, '$1<br>');

    // Headers
    let operationHeader = '';
    if (operation === 'summarize') operationHeader = '<div style="background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600;">📝 <strong>Summary Generated</strong></div>';
    else if (operation === 'points') operationHeader = '<div style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: white; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600;">📋 <strong>Bullet Points</strong></div>';
    else if (operation === 'suggest') operationHeader = '<div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600;">💡 <strong>Suggestions</strong></div>';

    return operationHeader + text;
}

// ✅ COPY - Alert Only
async function copyResult() {
    const result = document.getElementById("result");
    if (!result?.textContent?.trim()) {
        alert("❌ No content to copy!");
        return;
    }

    const text = result.innerText || result.textContent;
    
    try {
        await navigator.clipboard.writeText(text);
        alert("✅ Copied to clipboard successfully! 📋");
    } catch {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert("✅ Copied to clipboard! 📋");
    }
}

// ✅ DOWNLOAD - Alert Only  
function downloadResult() {
    const result = document.getElementById("result");
    if (!result?.textContent?.trim()) {
        alert("❌ No content to download!");
        return;
    }

    const text = result.innerText || result.textContent;
    const operation = document.getElementById("operation")?.selectedOptions?.text || "Result";
    const filename = `ResearchGenie_${operation.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.txt`;
    
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    
    alert(`✅ Downloaded successfully!\n\n📄 File: ${filename}\n💾 Saved to Downloads folder`);
}

// ✅ SHARE - Alert Only
async function shareResult() {
    const result = document.getElementById("result");
    if (!result?.textContent?.trim()) {
        alert("❌ No content to share!");
        return;
    }

    const text = (result.innerText || result.textContent).slice(0, 200) + '...';
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Research Genie AI Result',
                text: text
            });
            alert("✅ Shared successfully! 📤"); // ✅ SHARE SUCCESS
            return;
        } catch {
            alert("⚠️ Share failed - copying instead...");
        }
    } else {
        alert("📱 Share not supported - copying to clipboard...");
    }
    
    // Fallback copy
    await copyResult();
}

// ✅ KEYBOARD SHORTCUTS
document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');
    if (content) {
        content.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                sendRequest();
            }
        });
        content.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
});
