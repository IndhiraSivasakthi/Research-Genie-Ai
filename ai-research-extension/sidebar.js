// Load selected text when popup opens
window.onload = function () {
    chrome.storage.local.get(["selectedText"], function (data) {
        if (data.selectedText) {
            document.getElementById("text").value = data.selectedText;
        }
    });
};

// Call backend API
async function callAPI(operation) {
    const content = document.getElementById("text").value.trim();
    if (!content) {
        document.getElementById("result").innerHTML = "Please select or enter text!";
        return;
    }

    document.getElementById("result").innerHTML = "Processing...";

    try {
        const response = await fetch("http://localhost:8080/api/research/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: content, operation: operation })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.text();

        // Show result nicely
        document.getElementById("result").innerHTML = formatResult(result, operation);
    } catch (err) {
        document.getElementById("result").innerHTML = "Error: " + err;
    }
}

// Functions for buttons
function summarize() { callAPI("summarize"); }
function points() { callAPI("points"); }
function suggest() { callAPI("suggest"); }

// Format bullet points and bold titles
function formatResult(text, operation) {
    if (operation === "points") {
        // Convert plain text bullets to HTML bullets if they have • or newlines
        const lines = text.split(/\r?\n/);
        return "<ul>" + lines.map(line => `<li>${line.replace(/^\s*[-•*]\s*/, "")}</li>`).join("") + "</ul>";
    } else if (operation === "summarize" || operation === "suggest") {
        return `<p style="text-align:justify;">${text}</p>`;
    } else {
        return text;
    }
}