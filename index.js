import fetch from "node-fetch";
import express from "express";
import { makeBadge } from "badge-maker";
const { generateRepoCard, generateGistCard } = require("github-card");
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/badge", async (req, res) => {
    try {
        const { message, label, labelColor, color, style, img, url, id } = req.query;
        let logoBase64;

        if (img) {
            const response = await fetch(img);
            if (!response.ok) throw new Error("Failed to fetch image");

            const buffer = await response.arrayBuffer();
            logoBase64 = "data:image/svg+xml;base64," + Buffer.from(buffer).toString("base64");
        }

        const badgeOptions = { };
        if (message && message.trim() != "") {badgeOptions.message = message} else {badgeOptions.message = "Badge"};
        if (color && color.trim() != "") badgeOptions.color = color;
        if (label && label.trim() != "") badgeOptions.label = label;
        if (labelColor && labelColor.trim() != "") badgeOptions.labelColor = labelColor;
        if (style && style.trim() != "") {badgeOptions.style = style} else {badgeOptions.message = "plastic"};
        if (logoBase64 && logoBase64.trim() != "") badgeOptions.logoBase64 = logoBase64;
        if (url && url.trim() != "") badgeOptions.links = url.split(",");
        if (id && id.trim() != "") badgeOptions.idSuffix = id;

        const badge = makeBadge(badgeOptions);
        res.type("svg").send(badge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/repo", async (req, res) => {
    try {
        const { name, cardBackground, cardBorder, titleColor, textColor, codeBackground, codeColor } = req.query;

        const theme = { }
        if (cardBackground && cardBackground.trim() != "") theme.cardBackground = cardBackground;
        if (cardBorder && cardBorder.trim() != "") theme.cardBorder = cardBorder;
        if (titleColor && titleColor.trim() != "") theme.titleColor = titleColor;
        if (textColor && textColor.trim() != "") theme.textColor = textColor;
        if (codeBackground && codeBackground.trim() != "") theme.codeBackground = codeBackground;
        if (codeColor && codeColor.trim() != "") theme.codeColor = codeColor;

        const card = await generateRepoCard(name, theme);
        res.type("svg").send(card);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/gist", async (req, res) => {
    try {
        const { id, cardBackground, cardBorder, titleColor, textColor, codeBackground, codeColor } = req.query;

        const theme = { }
        if (cardBackground && cardBackground.trim() != "") theme.cardBackground = cardBackground;
        if (cardBorder && cardBorder.trim() != "") theme.cardBorder = cardBorder;
        if (titleColor && titleColor.trim() != "") theme.titleColor = titleColor;
        if (textColor && textColor.trim() != "") theme.textColor = textColor;
        if (codeBackground && codeBackground.trim() != "") theme.codeBackground = codeBackground;
        if (codeColor && codeColor.trim() != "") theme.codeColor = codeColor;

        const card = await generateRepoCard(id, theme);
        res.type("svg").send(card);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
