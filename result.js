document.addEventListener("DOMContentLoaded", () => {
    const storedMoods = sessionStorage.getItem("mudiSelectedMoods");
    const storedTrackCount = sessionStorage.getItem("mudiTrackCount");
    
    const selectedMoods = storedMoods ? JSON.parse(storedMoods) : ["Mood"];
    const baseTrackCount = storedTrackCount ? parseInt(storedTrackCount, 10) : 20;
    
    const totalTrackCount = baseTrackCount + 5; 

    const moodData = {
        "Happy": { icon: "☀️", rgb: "242, 163, 94" }, "Excited": { icon: "⚡", rgb: "242, 163, 94" }, 
        "Confident": { icon: "✨", rgb: "242, 163, 94" }, "Driving": { icon: "🚗", rgb: "242, 163, 94" },
        "Fluttery": { icon: "💗", rgb: "233, 135, 173" }, "In Love": { icon: "💕", rgb: "233, 135, 173" }, 
        "Heartbroken": { icon: "🥀", rgb: "233, 135, 173" }, "Nostalgic": { icon: "📼", rgb: "233, 135, 173" }, 
        "Sentimental": { icon: "🎞️", rgb: "233, 135, 173" }, "Comforted": { icon: "🫂", rgb: "233, 135, 173" },
        "Restful": { icon: "🌿", rgb: "111, 203, 183" }, "Peaceful": { icon: "🍃", rgb: "111, 203, 183" }, 
        "Focused": { icon: "🎧", rgb: "111, 203, 183" }, "Tired": { icon: "🥱", rgb: "111, 203, 183" },
        "Depressed": { icon: "🌧️", rgb: "116, 143, 201" }, "Sad": { icon: "💧", rgb: "116, 143, 201" }, 
        "Lonely": { icon: "🌙", rgb: "116, 143, 201" }, "Drained": { icon: "🪫", rgb: "116, 143, 201" }, 
        "Rainy Day": { icon: "☂️", rgb: "116, 143, 201" },
        "Angry": { icon: "🔥", rgb: "165, 122, 226" }, "Stressed": { icon: "💥", rgb: "165, 122, 226" }, 
        "Anxious": { icon: "🫧", rgb: "165, 122, 226" }, "Tense": { icon: "〰️", rgb: "165, 122, 226" }, 
        "Late Night": { icon: "🌌", rgb: "165, 122, 226" }, "Dreamy": { icon: "☁️", rgb: "165, 122, 226" }
    };

    if (selectedMoods.length > 0 && selectedMoods[0] !== "Mood") {
        let r = 0, g = 0, b = 0, validCount = 0;
        selectedMoods.forEach(mood => {
            if (moodData[mood]) {
                const [mr, mg, mb] = moodData[mood].rgb.split(', ').map(Number);
                r += mr; g += mg; b += mb;
                validCount++;
            }
        });
        if (validCount > 0) {
            const mixedRgb = `${Math.round(r/validCount)}, ${Math.round(g/validCount)}, ${Math.round(b/validCount)}`;
            document.documentElement.style.setProperty('--accent-rgb', mixedRgb);
            document.documentElement.style.setProperty('--accent', `rgb(${mixedRgb})`);
        }
    }

    const emotionsContainer = document.getElementById("selected-emotions-container");
    if (emotionsContainer) {
        emotionsContainer.innerHTML = selectedMoods.map(mood => {
            const data = moodData[mood] || { icon: "✨", rgb: "167, 139, 250" }; 
            return `<span class="selected-chip" style="--chip-rgb: ${data.rgb};"><span aria-hidden="true">${data.icon}</span> ${mood}</span>`;
        }).join("");
    }
    
    if (selectedMoods.length > 0 && selectedMoods[0] !== "Mood") {
        document.querySelector(".playlist-title").textContent = `${selectedMoods[0].toUpperCase()} - vibe`;
    }

    const realSamples = [
        { name: "Don't Stop 'Til You Get Enough", duration: "237", artist: { name: "Michael Jackson" }, albumName: "Off The Wall", image: [{}, {}, { "#text": "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png" }] },
        { name: "Lose My Mind (feat. Doja Cat)", duration: "209", artist: { name: "Don Toliver, Doja Cat" }, albumName: "Lose My Mind", image: [{}, {}, { "#text": "https://lastfm.freetls.fastly.net/i/u/174s/4a96cbd8b46e442fc41c2b86b821562f.png" }] },
        { name: "Heat Waves", duration: "239", artist: { name: "Glass Animals" }, albumName: "Dreamland", image: [{}, {}, { "#text": "https://lastfm.freetls.fastly.net/i/u/174s/5a96cbd8b46e442fc41c2b86b821562f.png" }] }
    ];

    const dummyTracks = Array.from({ length: totalTrackCount }, (_, index) => {
        if (index < realSamples.length) return realSamples[index];
        return { 
            name: `Title ${index + 1}`, 
            duration: "210",
            artist: { name: `Artist ${index + 1}` }, 
            albumName: `Album ${index + 1}`, 
            image: [{}, {}, { "#text": "" }] 
        };
    });

    const trackContainer = document.getElementById("track-container");
    if (!trackContainer) return; 
    trackContainer.innerHTML = ""; 

    const formatTime = (seconds) => {
        if (!seconds || seconds === "0") return "--:--";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const updateTrackNumbers = () => {
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach((item, i) => {
            const indexSpan = item.querySelector('.index-num');
            if (indexSpan) indexSpan.textContent = i + 1;
        });
    };

    const updatePlaylistStats = () => {
        const activeTracks = document.querySelectorAll('.track-item:not(.extra-track)');
        const songCount = activeTracks.length;
        
        let totalSeconds = 0;
        activeTracks.forEach(track => {
            totalSeconds += parseInt(track.dataset.duration || 0, 10);
        });

        const totalHours = Math.floor(totalSeconds / 3600);
        const totalMins = Math.floor((totalSeconds % 3600) / 60);
        const timeString = totalHours > 0 ? `${totalHours} hr ${totalMins} min` : `${totalMins} min`;

        const statsData = document.getElementById("playlist-stats-data");
        if (statsData) {
            statsData.textContent = `${songCount} songs, ${timeString}`;
        }
    };

    dummyTracks.forEach((track, index) => {
        if (index === baseTrackCount) {
            const divider = document.createElement("div");
            divider.className = "extra-divider";
            divider.innerHTML = `<div class="divider-line"></div><h3 class="divider-title">More for your mood</h3>`;
            trackContainer.appendChild(divider);
        }

        const trackElement = document.createElement("div");
        trackElement.className = "track-item";
        if (index >= baseTrackCount) trackElement.classList.add("extra-track");

        trackElement.dataset.duration = track.duration;

        const imageUrl = track.image[2] && track.image[2]["#text"] ? track.image[2]["#text"] : "";

        const actionHtml = index < baseTrackCount ? 
            `<button class="delete-btn" title="Remove track">×</button>` : 
            `<button class="add-icon-btn" title="Add track">+</button>`;

        trackElement.innerHTML = `
            <div class="col-index">
                <span class="index-num">${index + 1}</span>
                <svg class="hover-play-icon" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>
            </div>
            <div class="col-title">
                ${imageUrl ? `<img src="${imageUrl}" alt="Album" class="track-img">` : `<div class="dummy-img"></div>`}
                <div class="track-info">
                    <span class="track-name">${track.name}</span>
                    <span class="track-artist">${track.albumName}</span> 
                </div>
            </div>
            <div class="col-artist">${track.artist.name}</div>
            <div class="col-time">${formatTime(track.duration)}</div>
            <div class="col-action">${actionHtml}</div>
        `;
        trackContainer.appendChild(trackElement);
    });

    updatePlaylistStats();

    trackContainer.addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".delete-btn");
        const addBtn = e.target.closest(".add-icon-btn");
        const trackItem = e.target.closest(".track-item");

        if (deleteBtn) {
            trackItem.style.opacity = '0';
            setTimeout(() => {
                trackItem.remove();
                updateTrackNumbers();
                updatePlaylistStats();
            }, 200); 
        } else if (addBtn) {
            const divider = document.querySelector(".extra-divider");
            trackItem.style.opacity = '0';
            setTimeout(() => {
                trackContainer.insertBefore(trackItem, divider);
                trackItem.classList.remove("extra-track");
                
                const actionCol = trackItem.querySelector(".col-action");
                actionCol.innerHTML = `<button class="delete-btn" title="Remove track">×</button>`;
                trackItem.style.opacity = '1';
                
                updateTrackNumbers();
                updatePlaylistStats();
            }, 200);
        }
    });
});

