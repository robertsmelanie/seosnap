document.getElementById("analyzeBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractPageContent
        }, async (results) => {
            const content = results[0].result;
            const response = await fetch("https://your-api.com/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ html: content })
            });
            const result = await response.json();
            document.getElementById("result").innerText = result.summary;
        });
    });
});

function extractPageContent() {
    return document.documentElement.innerHTML;
  }