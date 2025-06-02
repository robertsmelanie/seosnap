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
  
document.getElementById("analyzeBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: runSEOChecks
        }, ([{ result }]) => {
            document.getElementById("result").innerHTML = formatReport(result);
        });
    });
});

function runSEOChecks() {
    const title = document.title || "";
    const h1s = document.getElementsByTagName("h1");
    const metaDesc = document.querySelector("meta[name='description']");
    const wordCount = document.body.innerText.split(/\s+/).length;
    const images = Array.from(document.querySelectorAll("img"));
    const missingAlt = images.filter(img => !img.alt).length;

    return {
        titleLength: title.length,
        h1Count: h1s.length,
        hasMetaDescription: !!metaDesc,
        metaDescriptionLength: metaDesc ? metaDesc.content.length : 0,
        wordCount,
        imageCount: images.length,
        missingAlt
    };
}

function formatReport(data) {
    return `
      <strong>SEO Audit:</strong><br/>
      🔹 Title Length: ${data.titleLength} chars<br/>
      🔹 H1 Tags: ${data.h1Count}<br/>
      🔹 Meta Description: ${data.hasMetaDescription ? "✅ Yes" : "❌ Missing"} (${data.metaDescriptionLength} chars)<br/>
      🔹 Word Count: ${data.wordCount}<br/>
      🔹 Images: ${data.imageCount}<br/>
      🔹 Missing Alt Tags: ${data.missingAlt}<br/>
    `;
}
  