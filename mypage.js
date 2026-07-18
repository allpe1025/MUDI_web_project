document.addEventListener("DOMContentLoaded", () => {
    // 1. 임시 더미 데이터 (나중엔 필요 없음)
    const dummyPlaylists = [
        { title: "HAPPY - vibe (아주아주 긴 제목 말줄임표 테스트용)", trackCount: 20, time: "1 hr 10 min" },
        { title: "RESTFUL - vibe", trackCount: 15, time: "52 min" }
    ];

    // 통계 업데이트
    document.getElementById("stat-playlists").textContent = dummyPlaylists.length;
    document.getElementById("stat-tracks").textContent = "35";

    const container = document.getElementById("playlist-container");
    container.innerHTML = ""; // 초기화

    // 💡 1. Add Playlist 카드 렌더링 (무조건 맨 앞에!)
    const addCard = document.createElement("div");
    addCard.className = "playlist-card"; // 동일한 카드 클래스 사용
    addCard.onclick = () => location.href = 'selec.html';
    
    addCard.innerHTML = `
        <div class="card-cover add-cover">
            <span class="plus-icon">+</span>
        </div>
        <h3 class="card-title">Add Playlist</h3>
        <p class="card-stats"></p> <!-- 내용 없는 빈칸 유지 -->
    `;
    container.appendChild(addCard);

    // 💡 2. 나머지 일반 플리들 렌더링 (더미)
    dummyPlaylists.forEach(playlist => {
        const card = document.createElement("div");
        card.className = "playlist-card";
        card.onclick = () => alert(`'${playlist.title}' 상세 뷰어(result)로 연결될 예정입니다.`);
        
        card.innerHTML = `
            <div class="card-cover"></div> <!-- 나중에 background-image로 앨범커버 넣을 자리 -->
            <h3 class="card-title" title="${playlist.title}">${playlist.title}</h3>
            <p class="card-stats">${playlist.trackCount} songs, ${playlist.time}</p>
        `;
        container.appendChild(card);
    });

    // 3. 버튼 이벤트 리스너
    document.getElementById("logout-btn").addEventListener("click", () => {
        if(confirm("로그아웃 하시겠습니까?")) window.location.href = "main.html";
    });

    document.getElementById("delete-account-btn").addEventListener("click", () => {
        if(confirm("정말로 탈퇴하시겠습니까?")) {
            alert("탈퇴 처리되었습니다.");
            window.location.href = "main.html";
        }
    });
});

