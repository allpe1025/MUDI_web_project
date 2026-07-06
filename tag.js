const fs = require("fs");

// data/emotionTags.js
const emotionTagMap = {
  "행복": [
    "happy",
    "fun",
    "catchy",
    "pop",
    "dance",
    "indie pop",
    "synthpop",
    "Uplifting"
  ],

  "신남": [
    "Energetic",
    "dance",
    "party",
    "Disco",
    "electropop",
    "club",
    "funky",
    "eurodance"
  ],

  "설렘": [
    "Love",
    "romantic",
    "beautiful",
    "indie pop",
    "dream pop",
    "rnb",
    "soul",
    "soft rock"
  ],

  "자신감": [
    "Hip-Hop",
    "rap",
    "trap",
    "rock",
    "hard rock",
    "funk",
    "Energetic",
    "cool"
  ],

  "우울": [
    "sad",
    "melancholy",
    "melancholic",
    "depressive",
    "Mellow",
    "acoustic",
    "piano",
    "singer-songwriter"
  ],

  "슬픔": [
    "sad",
    "Ballad",
    "emotional",
    "acoustic",
    "piano",
    "Mellow",
    "singer-songwriter",
    "folk"
  ],

  "외로움": [
    "melancholy",
    "sad",
    "acoustic",
    "indie",
    "indie folk",
    "folk",
    "Mellow",
    "piano"
  ],

  "추억": [
    "nostalgic",
    "80s",
    "90s",
    "oldies",
    "classic rock",
    "folk rock",
    "acoustic",
    "soft rock"
  ],

  "화남": [
    "angry",
    "aggressive",
    "metal",
    "hard rock",
    "punk",
    "hardcore",
    "industrial",
    "noise"
  ],

  "스트레스": [
    "aggressive",
    "rock",
    "alternative rock",
    "Nu Metal",
    "metalcore",
    "punk rock",
    "dubstep",
    "trap"
  ],

  "불안": [
    "dark",
    "dark ambient",
    "ambient",
    "cinematic",
    "post-rock",
    "minimal",
    "piano",
    "experimental"
  ],

  "긴장": [
    "electronic",
    "techno",
    "industrial",
    "dark electro",
    "cinematic",
    "epic",
    "Drum and bass",
    "trance"
  ],

  "피곤": [
    "chill",
    "chillout",
    "relaxing",
    "Lo-Fi",
    "ambient",
    "downtempo",
    "lounge",
    "easy listening"
  ],

  "휴식": [
    "relaxing",
    "relax",
    "chill",
    "acoustic",
    "jazz",
    "lounge",
    "easy listening",
    "new age"
  ],

  "평온": [
    "calm",
    "ambient",
    "piano",
    "new age",
    "neoclassical",
    "instrumental",
    "soft",
    "easy listening"
  ],

  "집중": [
    "instrumental",
    "Classical",
    "ambient",
    "piano",
    "minimal",
    "electronic",
    "contemporary classical",
    "Soundtrack"
  ],

  "사랑": [
    "Love",
    "romantic",
    "rnb",
    "soul",
    "smooth",
    "sexy",
    "beautiful",
    "Ballad"
  ],

  "이별": [
    "sad",
    "Ballad",
    "emotional",
    "melancholy",
    "acoustic",
    "piano",
    "emo",
    "Mellow"
  ],

  "밤감성": [
    "night",
    "chill",
    "Dreamy",
    "downtempo",
    "trip-hop",
    "rnb",
    "indie",
    "ambient"
  ],

  "몽환": [
    "Dreamy",
    "dream pop",
    "shoegaze",
    "ambient",
    "ethereal",
    "psychedelic",
    "atmospheric",
    "trip-hop"
  ],

  "무기력": [
    "Lo-Fi",
    "chill",
    "chillout",
    "Mellow",
    "downtempo",
    "ambient",
    "acoustic",
    "easy listening"
  ],

  "위로": [
    "Ballad",
    "acoustic",
    "piano",
    "Mellow",
    "beautiful",
    "singer-songwriter",
    "soft rock",
    "folk"
  ],

  "드라이브": [
    "pop",
    "indie pop",
    "rock",
    "classic rock",
    "electronic",
    "synthpop",
    "funk",
    "80s"
  ],

  "비오는날": [
    "jazz",
    "piano",
    "acoustic",
    "Ballad",
    "melancholy",
    "Mellow",
    "chill",
    "ambient"
  ],

  "감성": [
    "emotional",
    "indie",
    "acoustic",
    "Ballad",
    "rnb",
    "soul",
    "melancholy",
    "beautiful"
  ]
};

// 비교용 정규화 함수
function normalizeTag(tag) {
  return tag.trim().toLowerCase();
}

// 파일 읽기
const filePath = "C:/Users/woomj/Downloads/tagName.txt";
const rawText = fs.readFileSync(filePath, "utf-8");
console.log(rawText.slice(0, 100));
const data = JSON.parse(rawText);

// 태그 목록 추출
const lastfmTags = data.tags.tag.map((tag) => tag.name);
const lastfmTagSet = new Set(lastfmTags.map(normalizeTag));

// 태그 검사
const report = {};
const allUsedTags = new Set();

for (const emotion in emotionTagMap) {
  const tags = emotionTagMap[emotion];

  const checkedTags = tags.map((tag) => {
    const normalized = normalizeTag(tag);
    const exists = lastfmTagSet.has(normalized);

    allUsedTags.add(tag);

    return {
      tag,
      exists
    };
  });

  report[emotion] = checkedTags;
}

// 전체 태그 기준으로 분리
const existingTags = [];
const missingTags = [];

for (const tag of allUsedTags) {
  const exists = lastfmTagSet.has(normalizeTag(tag));

  if (exists) {
    existingTags.push(tag);
  } else {
    missingTags.push(tag);
  }
}

// 결과 출력
console.log("===== 태그 검사 결과 =====");

for (const emotion in report) {
  const checkedTags = report[emotion];

  const missing = checkedTags.filter((item) => !item.exists);

  console.log(`\n[${emotion}]`);

  checkedTags.forEach((item) => {
    const mark = item.exists ? "O" : "X";
    console.log(`${mark} ${item.tag}`);
  });

  if (missing.length > 0) {
    console.log(`없는 태그: ${missing.map((item) => item.tag).join(", ")}`);
  }
}

console.log("\n===== 전체 요약 =====");
console.log(`사용한 전체 태그 수: ${allUsedTags.size}`);
console.log(`존재하는 태그 수: ${existingTags.length}`);
console.log(`없는 태그 수: ${missingTags.length}`);

console.log("\n없는 태그 목록:");
console.log(missingTags);