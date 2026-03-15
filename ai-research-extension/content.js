console.log("AI Research extension loaded");

let sidebar;

// ---------- CREATE SIDEBAR ----------
function createSidebar() {

    if (sidebar) return;

    sidebar = document.createElement("div");
    sidebar.id = "ai-sidebar";

    sidebar.innerHTML = `
        <div class="ai-header">
            <span>🤖 AI Research Assistant</span>
            <button id="ai-close">X</button>
        </div>

        <textarea id="ai-text" placeholder="Selected text appears here"></textarea>

        <div class="ai-buttons">
            <button id="summarize">Summarize</button>
            <button id="points">Bullet Points</button>
            <button id="suggest">Suggestions</button>
        </div>

        <div class="ai-actions">
            <button id="copyResult">Copy</button>
            <button id="downloadResult">Download</button>
        </div>

        <div id="ai-result"></div>
    `;

    document.body.appendChild(sidebar);

    // Close sidebar
    document.getElementById("ai-close").onclick = () => {
        sidebar.style.display = "none";
    };

    // Button actions
    document.getElementById("summarize").onclick = () => callAPI("summarize");
    document.getElementById("points").onclick = () => callAPI("points");
    document.getElementById("suggest").onclick = () => callAPI("suggest");

    document.getElementById("copyResult").onclick = copyResult;
    document.getElementById("downloadResult").onclick = downloadResult;
}


// ---------- DETECT SELECTED TEXT ----------
document.addEventListener("mouseup", () => {

    const selectedText = window.getSelection().toString().trim();

    if (selectedText.length > 20) {

        createSidebar();

        sidebar.style.display = "block";

        document.getElementById("ai-text").value = selectedText;
    }
});


// ---------- CALL SPRING BOOT API ----------
async function callAPI(operation) {

    const text = document.getElementById("ai-text").value.trim();

    const resultDiv = document.getElementById("ai-result");

    if (!text) {
        resultDiv.innerHTML = "<p>Please enter or select text.</p>";
        return;
    }

    resultDiv.innerHTML = "<p>⏳ Processing AI response...</p>";

    try {

        const response = await fetch("http://localhost:8080/api/research/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: text,
                operation: operation
            })
        });

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const result = await response.text();

        resultDiv.innerHTML = formatOutput(result, operation);

    } catch (err) {

        console.error(err);

        resultDiv.innerHTML = "<p style='color:red;'>❌ Error calling API</p>";
    }
}


// ---------- COPY RESULT ----------
function copyResult() {

    const resultDiv = document.getElementById("ai-result");

    const text = resultDiv.innerText;

    if (!text) {
        alert("No result to copy");
        return;
    }

    navigator.clipboard.writeText(text);

    alert("✅ Result copied to clipboard!");
}


// ---------- DOWNLOAD RESULT ----------
function downloadResult() {

    const resultDiv = document.getElementById("ai-result");

    const text = resultDiv.innerText;

    if (!text) {
        alert("No result to download");
        return;
    }

    const blob = new Blob([text], { type: "text/plain" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "AI_Research_Result.txt";


    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}


// ---------- FORMAT OUTPUT ----------
function formatOutput(text, operation) {

    // Convert **bold**
    text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // ---------- BULLET POINTS ----------
    if (operation === "points") {

        const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");

        let html = "<ul>";

        lines.forEach(line => {

            // remove *, -, • symbols at start
            line = line.replace(/^[*\-•]\s*/, "");

            // remove markdown italic *
            line = line.replace(/\*(.*?)\*/g, "$1");

            // remove double **
            line = line.replace(/\*\*(.*?)\*\*/g, "$1");

            if (line.includes(":")) {

                let parts = line.split(":");

                let title = parts.shift().trim();
                let desc = parts.join(":").trim();

                html += `<li><b>${title}</b>: ${desc}</li>`;

            } else {

                html += `<li>${line}</li>`;
            }
        });

        html += "</ul>";

        return html;
    }

    // ---------- SUGGESTIONS ----------
    if (operation === "suggest") {

        const lines = text.split(/\r?\n/);

        let html = "";
        let listOpen = false;

        lines.forEach(line => {

            line = line.trim();

            // italic
            line = line.replace(/\*(.*?)\*/g, "<i>$1</i>");

            // headings
            if (line.startsWith("#")) {

                if (listOpen) {
                    html += "</ul>";
                    listOpen = false;
                }

                const heading = line.replace(/^#+/, "").trim();

                html += `<h3 style="margin-top:12px;"><b>${heading}</b></h3>`;
            }

            // bullet points
            else if (/^[-*•]\s/.test(line)) {

                if (!listOpen) {
                    html += "<ul>";
                    listOpen = true;
                }

                line = line.replace(/^[-*•]\s*/, "");

                if (line.includes(":")) {

                    let parts = line.split(":");

                    let title = parts.shift().trim();
                    let desc = parts.join(":").trim();

                    html += `<li><b>${title}</b>: ${desc}</li>`;

                } else {

                    html += `<li>${line}</li>`;
                }
            }

            // normal paragraph
            else if (line !== "") {

                if (listOpen) {
                    html += "</ul>";
                    listOpen = false;
                }

                html += `<p style="text-align:justify;">${line}</p>`;
            }
        });

        if (listOpen) html += "</ul>";

        return html;
    }


    // ---------- SUMMARY ----------
    return `<p style="text-align:justify;">${text}</p>`;
}

git init
git add .
git commit -m "AI Research API"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-research-api.git
git push -u origin main