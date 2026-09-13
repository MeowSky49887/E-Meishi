**Example**

```js
const { generateRepoCard, generateGistCard } = require("github-card");

(async () => {
    // Generate Repository Card
    const repoCard = await generateRepoCard("VOICEVOX, "voicevox");
    console.log(repoCard);

    // Generate Gist Card
    const gistCard = await generateGistCard("3b0f206927c5fe8fd9b5c3cd830d500f");
    console.log(gistCard);

    // Generate HF Space Card
    const spaceCard = await generateGistCard("MeowSky49887", "VOICEVOX-Engine");
    console.log(spaceCard);
})();
```
