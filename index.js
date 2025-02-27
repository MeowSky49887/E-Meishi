import fetch from "node-fetch";
import express from "express";
import { makeBadge } from "badge-maker";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

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

        // Construct badge options dynamically
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

// Serve the HTML UI at the root URL "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
