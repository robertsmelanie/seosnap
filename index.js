const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Add your key in .env
}));

app.post("/analyze", async (req, res) => {
    const { html } = req.body;

    if (!html) return res.status(400).send({ error: "Missing HTML content." });

    try {
        const prompt = generatePrompt(html);
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 400,
        });

        res.send({
            summary: response.data.choices[0].message.content,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "AI failed." });
    }
});

function generatePrompt(html) {
    return `You are an expert SEO assistant.

Here is an HTML page:
---
${html.slice(0, 8000)}
---

Give a concise SEO audit covering:
- Title length
- Presence of H1 tags
- Meta description quality
- Readability
- Keyword density (if any repeated phrases)
- Missing alt tags
- Suggestions to improve

Respond in bullet points.`;
}

app.listen(3000, () => console.log("SEO Audit API running on http://localhost:3000"));
