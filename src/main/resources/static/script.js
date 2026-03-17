// 🌟 PROFESSIONAL MARKDOWN PARSER - All alerts now
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

    // UI States
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
        alert("✅ AI processing complete!");

    } catch (error) {
        if (error.name === 'AbortError') {
            resultDiv.innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center; font-weight: 500;">⏰ Request timed out (30s). Try shorter content.</div>';
            alert("⏰ Request timed out (30s). Try shorter content.");
        } else {
            resultDiv.innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center; font-weight: 500;">❌ Connection error. Check API server.</div>';
            alert("❌ Connection error. Check API server.");
        }
    } finally {
        loader.style.display = "none";
        if (generateBtn) {
            generateBtn.classList.remove("loading");
            generateBtn.disabled = false;
        }
    }
}

// 🌟 Professional AI Result Formatter (UNCHANGED)
function formatAIResult(text, operation) {
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    text = text.replace(/^####\s+(.*)$/gm, '<h4 style="color: #10b981; margin: 1.5rem 0 0.5rem;">$1</h4>');
    text = text.replace(/^###\s+(.*)$/gm, '<h3 style="color: #667eea; margin: 1.5rem 0 0.75rem; font-size: 1.3rem;">$1</h3>');
    text = text.replace(/^##\s+(.*)$/gm, '<h2 style="color: #f59e0b; margin: 1.5rem 0 1rem; font-size: 1.5rem;">$1</h2>');
    text = text.replace(/^\#\s+(.*)$/gm, '<h1 style="color: #ef4444; margin: 2rem 0 1rem; font-size: 1.8rem;">$1</h1>');

    text = text.replace(/^\s*[-*+]\s+(.*)$/gm, '<li style="margin: 0.5rem 0; padding-left: 0.5rem;">$1</li>');
    text = text.replace(/(<li[^>]*>.*?<\/li>)(?=\s*<li[^>]*>|$)/gs, function(match, p1) {
        return `<ul style="margin: 1rem 0; padding-left: 1.5rem;">${p1}</ul>`;
    });

    text = text.replace(/```[\s\S]*?```/g, function(match) {
        const code = match.replace(/```/g, '').trim();
        return `<div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 1.5rem; margin: 1rem 0; font-family: monospace; font-size: 14px; border-left: 4px solid #667eea;"><code>${code}</code></div>`;
    });
    text = text.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace;">$1</code>');

    text = text.replace(/^>\s+(.*)$/gm, '<div style="color: #9ca3af; margin: 1rem 0; padding-left: 1rem; border-left: 3px solid #667eea; font-style: italic;">$1</div>');
    text = text.replace(/^[-*_]{3,}\s*$/gm, '<hr style="border: none; height: 1px; background: linear-gradient(90deg, transparent, #667eea, transparent); margin: 2rem 0;">');

    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 1rem 0;">');
    text = text.replace(/\[(.*?)\]\(([^)]+)\)/g, '<a href="$2" style="color: #60a5fa; text-decoration: none; font-weight: 500;">$1</a>');

    text = text.replace(/^([^\n<].+)$/gm, '$1<br>');

    let operationHeader = '';
    if (operation === 'summarize') {
        operationHeader = '<div style="background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600;">📝 <strong>Summary Generated</strong></div>';
    } else if (operation === 'points') {
        operationHeader = '<div style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: white; padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600;">📋 <strong>Bullet Points Extracted</strong></div>';
    } else if (operation === 'suggest') {
        operationHeader = '<div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600;">💡 <strong>Smart Suggestions</strong></div>';
    }

    return operationHeader + text;
}

// ✅ ALERTS ONLY - Copy with alert
async function copyResult() {
    const result = document.getElementById("result");
    const text = result.innerText || result.textContent;
    
    if (!text.trim()) {
        alert("❌ No content to copy!");
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        alert("✅ Copied to clipboard successfully!");
    } catch (err) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert("✅ Copied to clipboard!");
    }
}

// ✅ ALERTS ONLY - Download with alert
function downloadResult() {
    const result = document.getElementById("result");
    const text = result.innerText || result.textContent;
    const operation = document.getElementById("operation").options[document.getElementById("operation").selectedIndex].text;
    
    if (!text.trim()) {
        alert("❌ No content to download!");
        return;
    }
    
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
    
    alert(`✅ Downloaded successfully!\n\n📄 File: ${filename}\n💾 Saved to Downloads folder`);
}

// ✅ ALERTS ONLY - Share with alert
async function shareResult() {
    const result = document.getElementById("result");
    const text = (result.innerText || result.textContent).slice(0, 200) + '...';
    
    if (!text.trim()) {
        alert("❌ No content to share!");
        return;
    }
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Research Genie AI Result',
                text: text
            });
            alert("✅ Shared successfully!");
        } catch (err) {
            alert("ℹ️ Using copy as fallback...");
            await copyResult();
        }
    } else {
        alert("ℹ️ Share not supported. Using copy...");
        await copyResult();
    }
}

// ✅ REMOVED: All toast functions + styles

// Keyboard shortcuts & auto-resize (UNCHANGED)
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
