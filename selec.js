const emotionTagMap = {
    "Happy": ["happy", "fun", "catchy", "pop", "dance", "indie pop", "synthpop", "Uplifting"],
    "Excited": ["Energetic", "dance", "party", "Disco", "electropop", "club", "funky", "eurodance"],
    "Fluttery": ["Love", "romantic", "beautiful", "indie pop", "dream pop", "rnb", "soul", "soft rock"],
    "Confident": ["Hip-Hop", "rap", "trap", "rock", "hard rock", "funk", "Energetic", "cool"],
    "Depressed": ["sad", "melancholy", "melancholic", "depressive", "Mellow", "acoustic", "piano", "singer-songwriter"],
    "Sad": ["sad", "Ballad", "emotional", "acoustic", "piano", "Mellow", "singer-songwriter", "folk"],
    "Lonely": ["melancholy", "sad", "acoustic", "indie", "indie folk", "folk", "Mellow", "piano"],
    "Nostalgic": ["nostalgic", "80s", "90s", "oldies", "classic rock", "folk rock", "acoustic", "soft rock"],
    "Angry": ["angry", "aggressive", "metal", "hard rock", "punk", "hardcore", "industrial", "noise"],
    "Stressed": ["aggressive", "rock", "alternative rock", "Nu Metal", "metalcore", "punk rock", "dubstep", "trap"],
    "Anxious": ["dark", "dark ambient", "ambient", "cinematic", "post-rock", "minimal", "piano", "experimental"],
    "Tense": ["electronic", "techno", "industrial", "dark electro", "cinematic", "epic", "Drum and bass", "trance"],
    "Tired": ["chill", "chillout", "relaxing", "Lo-Fi", "ambient", "downtempo", "lounge", "easy listening"],
    "Restful": ["relaxing", "relax", "chill", "acoustic", "jazz", "lounge", "easy listening", "new age"],
    "Peaceful": ["calm", "ambient", "piano", "new age", "neoclassical", "instrumental", "soft", "easy listening"],
    "Focused": ["instrumental", "Classical", "ambient", "piano", "minimal", "electronic", "contemporary classical", "Soundtrack"],
    "In Love": ["Love", "romantic", "rnb", "soul", "smooth", "sexy", "beautiful", "Ballad"],
    "Heartbroken": ["sad", "Ballad", "emotional", "melancholy", "acoustic", "piano", "emo", "Mellow"],
    "Late Night": ["night", "chill", "Dreamy", "downtempo", "trip-hop", "rnb", "indie", "ambient"],
    "Dreamy": ["Dreamy", "dream pop", "shoegaze", "ambient", "ethereal", "psychedelic", "atmospheric", "trip-hop"],
    "Drained": ["Lo-Fi", "chill", "chillout", "Mellow", "downtempo", "ambient", "acoustic", "easy listening"],
    "Comforted": ["Ballad", "acoustic", "piano", "Mellow", "beautiful", "singer-songwriter", "soft rock", "folk"],
    "Driving": ["pop", "indie pop", "rock", "classic rock", "electronic", "synthpop", "funk", "80s"],
    "Rainy Day": ["jazz", "piano", "acoustic", "Ballad", "melancholy", "Mellow", "chill", "ambient"],
    "Sentimental": ["emotional", "indie", "acoustic", "Ballad", "rnb", "soul", "melancholy", "beautiful"]
};

const moodStyles = [
    ["☀️", "#ffbd70"], ["⚡", "#ff756f"], ["💗", "#ef78a7"], ["✨", "#9f8cff"],
    ["🌧️", "#768fd0"], ["💧", "#6f8dc5"], ["🌙", "#8791aa"], ["📼", "#d29b67"],
    ["🔥", "#e55e55"], ["💥", "#e26d62"], ["🫧", "#b77ae8"], ["〰️", "#9675da"],
    ["🥱", "#7f9ca8"], ["🌿", "#6fd6c3"], ["🍃", "#75c9ad"], ["🎧", "#6aa9ff"],
    ["💕", "#ed779d"], ["🥀", "#9e7696"], ["🌌", "#7778ca"], ["☁️", "#8e7de0"],
    ["🪫", "#7e8999"], ["🫂", "#c09286"], ["🚗", "#ee945f"], ["☂️", "#748fb5"],
    ["🎞️", "#ba82a9"]
];

const moodCategories = [
    {
        title: "Energy",
        color: "#f2a35e",
        moods: ["Happy", "Excited", "Confident", "Driving"]
    },
    {
        title: "Love & Emotion",
        color: "#e987ad",
        moods: ["Fluttery", "In Love", "Heartbroken", "Nostalgic", "Sentimental", "Comforted"]
    },
    {
        title: "Calm & Focus",
        color: "#6fcbb7",
        moods: ["Restful", "Peaceful", "Focused", "Tired"]
    },
    {
        title: "Blue Mood",
        color: "#748fc9",
        moods: ["Depressed", "Sad", "Lonely", "Drained", "Rainy Day"]
    },
    {
        title: "Intense & Atmospheric",
        color: "#a57ae2",
        moods: ["Angry", "Stressed", "Anxious", "Tense", "Late Night", "Dreamy"]
    }
];

const tagList = document.querySelector(".tag-list");
const counter = document.querySelector("#selected-count");
const selectedList = document.querySelector(".selected-list");
const recommendButton = document.querySelector(".recommend-button");
const statusMessage = document.querySelector(".status-message");
const root = document.documentElement;
const MAX_SELECTIONS = 3;

const moodIcons = Object.fromEntries(
    Object.keys(emotionTagMap).map((emotion, index) => [emotion, moodStyles[index][0]])
);

moodCategories.forEach((category) => {
    const group = document.createElement("section");
    group.className = "mood-group";
    group.style.setProperty("--group-color", category.color);
    group.innerHTML = `<h2 class="group-title">${category.title}</h2><div class="group-tags"></div>`;

    const groupTags = group.querySelector(".group-tags");
    category.moods.forEach((emotion) => {
        const button = document.createElement("button");
        button.className = "mood-tag";
        button.type = "button";
        button.dataset.mood = emotion;
        button.dataset.color = category.color;
        button.setAttribute("aria-pressed", "false");
        button.innerHTML = `<span class="mood-icon" aria-hidden="true">${moodIcons[emotion]}</span>${emotion}<span class="check-icon" aria-hidden="true">✓</span>`;
        groupTags.append(button);
    });

    tagList.append(group);
});

const tags = [...document.querySelectorAll(".mood-tag")];

const hexToRgb = (hex) => [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
const mixColors = (colors) => {
    const sum = colors.reduce((total, color) => {
        const rgb = hexToRgb(color);
        return total.map((value, index) => value + rgb[index]);
    }, [0, 0, 0]);
    return sum.map((value) => Math.round(value / colors.length));
};

const getSelected = () => tags.filter((tag) => tag.classList.contains("selected"));

const renderSelectedMoods = (selected) => {
    if (!selected.length) {
        selectedList.innerHTML = '<span class="empty-selection">Nothing selected yet</span>';
        return;
    }

    selectedList.innerHTML = selected.map((tag) => {
        const rgb = hexToRgb(tag.dataset.color).join(", ");
        return `<span class="selected-chip" style="--chip-rgb: ${rgb}"><span aria-hidden="true">${moodIcons[tag.dataset.mood]}</span>${tag.dataset.mood}</span>`;
    }).join("");
};

const updateInterface = () => {
    const selected = getSelected();
    counter.textContent = selected.length;
    recommendButton.disabled = selected.length === 0;
    renderSelectedMoods(selected);

    const rgb = selected.length
        ? mixColors(selected.map((tag) => tag.dataset.color))
        : [167, 139, 250];
    root.style.setProperty("--accent-rgb", rgb.join(", "));
    root.style.setProperty("--accent", `rgb(${rgb.join(", ")})`);
};

tags.forEach((tag) => tag.addEventListener("click", () => {
    const isSelected = tag.classList.contains("selected");
    if (!isSelected && getSelected().length >= MAX_SELECTIONS) {
        statusMessage.textContent = "You can choose up to 3 moods.";
        window.setTimeout(() => { statusMessage.textContent = ""; }, 1800);
        return;
    }

    tag.classList.toggle("selected");
    tag.setAttribute("aria-pressed", String(!isSelected));
    statusMessage.textContent = "";
    updateInterface();
}));

recommendButton.addEventListener("click", () => {
    const emotions = getSelected().map((tag) => tag.dataset.mood);
    const musicTags = [...new Set(emotions.flatMap((emotion) => emotionTagMap[emotion]))];
    sessionStorage.setItem("mudiSelectedMoods", JSON.stringify(emotions));
    sessionStorage.setItem("mudiMusicTags", JSON.stringify(musicTags));
    statusMessage.textContent = `Finding music for your ${emotions.join(", ")} mood.`;
});
