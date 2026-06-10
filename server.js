/**
 * Rock Zone — Music Streaming Server
 * Node.js / Express backend
 *
 * Структура папок:
 *   public/          — статика (HTML, CSS, JS, изображения)
 *   public/audio/    — MP3 файлы треков
 *
 * Запуск:
 *   npm install
 *   node server.js
 *
 * Сервер слушает на http://localhost:3000
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ──────────────────────────────────────────────
   Статические файлы (HTML / CSS / JS / images)
────────────────────────────────────────────── */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

/* ──────────────────────────────────────────────
   Библиотека треков (в реальном проекте — БД)
────────────────────────────────────────────── */
const TRACKS = [
  {
    id: 1,
    title: "Утренний рассвет",
    artist: "Король и шут",
    album: "Акустический альбом",
    duration: 159,
    cover: "/images/cover4.jpg",
    audio: "/audio/track1.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Утренний рассвет" },
      { time: 16,  text: "Солнце поднималось над землёй" },
      { time: 22,  text: "Просыпался лес" },
      { time: 24,  text: "Восхищаясь розовой зарёй" },
      { time: 28,  text: "Над озером стоял, клубился белый туман" },
      { time: 31,  text: "В овраге под горою шелестела листва" },
      { time: 35,  text: "Луч солнца улыбался и с росою играл" },
      { time: 39,  text: "Особенно прекрасны утром эти места" },
      { time: 42,  text: "Продолженье сна, дивная пора" },
      { time: 49,  text: "Как божественна природа и проста" },
      { time: 56,  text: "В небе голубом" },
      { time: 59,  text: "Облака плывут, как корабли" },
      { time: 64,  text: "Тёплый ветерок" },
      { time: 66,  text: "Мчится над поверхностью земли" },
      { time: 70,  text: "Ещё не пробудились петухи в деревнях" },
      { time: 74,  text: "И рыбаков на озере пока не видать" },
      { time: 77,  text: "Коровами истоптана трава на полях" },
      { time: 81,  text: "Как здорово, что здесь мне довелось побывать" },
      { time: 84,  text: "Продолженье сна, дивная пора" },
      { time: 91,  text: "Как божественна природа и проста" },
      { time: 99,  text: "♪" },
      { time: 127, text: "Продолженье сна, дивная пора" },
      { time: 133, text: "Как божественна природа и проста" },
      { time: 138, text: "♪" }
    ]
  },
  {
    id: 2,
    title: "Путь в никуда",
    artist: "Ария",
    album: "Химера",
    duration: 328 ,
    cover: "/images/cover9.jpg",
    audio: "/audio/track49.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 28,  text: "Вспышка в темноте, яркий свет в глазах," },
      { time: 31,  text: "Я ослеп на миг." },
      { time: 37,  text: "Кто-то так хотел разбудить мой страх," },
      { time: 41,  text: "Разбудить мой крик." },
      { time: 46,  text: "Снова все мои желанья, что я сжег дотла," },
      { time: 53,  text: "Оживают и зовут меня..." },
      { time: 60,  text: "Я все время плыл по теченью дней," },
      { time: 64,  text: "Были сном мечты." },
      { time: 69,  text: "Но мираж ожил: словно жадный зверь" },
      { time: 73,  text: "Появилась ты." },
      { time: 78,  text: "Я твое дыханье слышу за своей спиной," },
      { time: 85,  text: "Только ветер глушит голос мой!" },
      { time: 91,  text: "Путь в никуда." },
      { time: 94,  text: "Я зову, но мне в ответ ни слова." },
      { time: 98,  text: "Путь в никуда." },
      { time: 101, text: "Из-под ног моих уходит земля." },
      { time: 105, text: "Путь в никуда." },
      { time: 108, text: "Я искал к тебе пути иного." },
      { time: 113, text: "Путь в никуда." },
      { time: 115, text: "Ничего уже исправить нельзя." },
      { time: 120, text: "♪" },
      { time: 134, text: "«Для героев - рай, ад - для дураков»," },
      { time: 138, text: "Я - такой, как есть." },
      { time: 143, text: "Осветил мне грань, где легко пропасть" },
      { time: 147, text: "Выстрел в темноте." },
      { time: 152, text: "Голоса грозы все громче, все трудней дышать..." },
      { time: 159, text: "На свободу просится душа!" },
      { time: 166, text: "Путь в никуда." },
      { time: 168, text: "Я зову, но мне в ответ ни слова." },
      { time: 173, text: "Путь в никуда." },
      { time: 175, text: "Из-под ног моих уходит земля." },
      { time: 180, text: "Путь в никуда." },
      { time: 182, text: "Я искал к тебе пути иного." },
      { time: 187, text: "Путь в никуда." },
      { time: 189, text: "Ничего уже исправить нельзя." },
      { time: 196, text: "ебейшее соло, пат!" },
      { time: 224, text: "Пусть душа моя кричит от боли," },
      { time: 231, text: "Пусть в глазах стоит сплошной туман," },
      { time: 239, text: "Лучше камнем вниз, чем жить по чьей-то воле." },
      { time: 245, text: "Этот путь я выбрал сам." },
      { time: 252, text: "Снова все мои желанья, что я сжег дотла" },
      { time: 260, text: "Оживают и ведут меня..." },
      { time: 266, text: "Путь в никуда." },
      { time: 269, text: "Я зову, но мне в ответ ни слова." },
      { time: 273, text: "Путь в никуда." },
      { time: 276, text: "Из-под ног моих уходит земля." },
      { time: 280, text: "Путь в никуда." },
      { time: 283, text: "Я искал к тебе пути иного." },
      { time: 287, text: "Путь в никуда." },
      { time: 290, text: "Ничего уже исправить нельзя." },
      { time: 294, text: "Путь в никуда." },
      { time: 297, text: "Я зову, но мне в ответ ни слова." },
      { time: 301, text: "Путь в никуда." },
      { time: 304, text: "Из-под ног моих уходит земля." },
      { time: 308, text: "Путь в никуда." },
      { time: 311, text: "Я искал к тебе пути иного." },
      { time: 315, text: "Путь в никуда." },
      { time: 318, text: "Ничего уже исправить нельзя." }, 
      { time: 323, text: "Путь в никуда!" }
    ]
  },
  {
    id: 3,
    title: "Долгая счастливая жизнь",
    artist: "Гражданская Оборона",
    album: "Долгая счастливая жизнь",
    duration: 325,
    cover: "/images/cover16.jpg",
    audio: "/audio/track42.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 21,  text: "Потрясениям и праздникам - нет." },
      { time: 26,  text: "Горизонтам и праздникам - нет." },
      { time: 31,  text: "Вдохновениям и праздникам - нет, нет, нет, нет..." },
      { time: 36,  text: "Безрыбье в золотой полынье." },
      { time: 40,  text: "Вездесущность мышиной возни" },
      { time: 45,  text: "Злые сумерки бессмертного дня" },
      { time: 50,  text: "Долгая счастливая жизнь~" },
      { time: 55,  text: "Такая долгая счастливая жизнь~" },
      { time: 60,  text: "Отныне долгая счастливая жизнь" },
      { time: 64,  text: "Каждому из нас" },
      { time: 67,  text: "Каждому из нас" },
      { time: 69,  text: "Каждому из нас" },
      { time: 71,  text: "Каждому из нас" },
      { time: 74,  text: "Беспощадные глубины морщин" },
      { time: 79,  text: "Марианские впадины глаз" },
      { time: 84,  text: "Марcианские хроники нас, нас, нас..." },
      { time: 89,  text: "Посреди одинаковых стен" },
      { time: 94,  text: "В гробовых отдалённых домах" },
      { time: 99,  text: "В непроглядной ледяной тишине..." },
      { time: 104, text: "Долгая счастливая жизнь~" },
      { time: 108, text: "Такая долгая счастливая жизнь~" },
      { time: 113, text: "Отныне долгая счастливая жизнь" },
      { time: 117, text: "Каждому из нас" },
      { time: 120, text: "Каждому из нас" },
      { time: 122, text: "Каждому из нас" },
      { time: 125, text: "Каждому из нас" },
      { time: 128, text: "балдеем, пат" }, 
      { time: 167, text: "Искушениям и праздникам - нет." },
      { time: 171, text: "Преступлениям и праздникам - нет." },
      { time: 176, text: "Исключениям и праздникам - нет, нет, нет..." },
      { time: 181, text: "На семи продувных сквозняках" },
      { time: 186, text: "По болотам, по пустыням, степям" },
      { time: 191, text: "По сугробам, по грязи, по земле" },
      { time: 196, text: "Долгая счастливая жизнь~" },
      { time: 200, text: "Такая долгая счастливая жизнь~" },
      { time: 205, text: "Отныне долгая счастливая жизнь" },
      { time: 209, text: "Каждому из нас" },
      { time: 212, text: "Каждому из нас" },
      { time: 214, text: "Каждому из нас" },
      { time: 217, text: "Каждому из на-а-а-с!" },
      { time: 220, text: "Долгая счастливая жизнь~" },
      { time: 224, text: "Такая долгая счастливая жизнь~" },
      { time: 229, text: "Отныне долгая счастливая жизнь" },
      { time: 234, text: "Каждому из нас" },
      { time: 236, text: "Каждому из нас" },
      { time: 239, text: "Каждому из нас" },
      { time: 241, text: "Каждому из на-а-а-с!" },
      { time: 245, text: "Долгая счастливая жизнь~" },
      { time: 249, text: "Такая долгая счастливая жизнь~" },
      { time: 254, text: "Отныне долгая счастливая жизнь" },
      { time: 258, text: "Каждому из нас" },
      { time: 260, text: "Каждому из нас" },
      { time: 263, text: "Каждому из нас" },
      { time: 266, text: "Каждому из на-а-а-с!" },
      { time: 270, text: "Долгая счастливая жизнь~" },
      { time: 273, text: "Такая долгая счастливая жизнь~" },
      { time: 278, text: "Отныне долгая счастливая жизнь" },
      { time: 283, text: "Каждому из нас" },
      { time: 285, text: "Каждому из нас" },
      { time: 288, text: "Каждому из нас" },
      { time: 290, text: "Каждому из на-а-а-с!" },
      { time: 294, text: "Долгая счастливая жизнь~" },
      { time: 298, text: "Такая долгая счастливая жизнь~" },
      { time: 303, text: "Отныне долгая счастливая жизнь" },
      { time: 307, text: "Каждому из нас" },
      { time: 309, text: "Каждому из нас" },
      { time: 312, text: "Каждому из нас" },
      { time: 314, text: "Каждому из на-а-а-с..." },
      { time: 317, text: "♪" }
    ]
  },
  {
    id: 4,
    title: "Я хочу быть с тобой",
    artist: "Nautilus Pompilius",
    album: "Золотой альбом",
    duration: 260,
    cover: "/images/cover14.jpg",
    audio: "/audio/track17.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 10,  text: "Deep inside the ghost forest" },
      { time: 16,  text: "Where the dead trees never rest" },
      { time: 22,  text: "Roots like fingers grip the clay" },
      { time: 28,  text: "Holding all who went astray" },
      { time: 36,  text: "Fog rolls in like old regret" },
      { time: 42,  text: "Every path I've tried to set" },
      { time: 48,  text: "Leads me back to where I start" },
      { time: 54,  text: "To the forest in my heart" },
      { time: 62,  text: "Ghost forest, ghost forest" },
      { time: 68,  text: "I hear whispers through the mist" },
      { time: 74,  text: "Ghost forest, ghost forest" },
      { time: 80,  text: "Names of everyone I've kissed" },
      { time: 88,  text: "♪" },
      { time: 110, text: "Branches catch my ragged coat" },
      { time: 116, text: "Silence wraps around my throat" },
      { time: 122, text: "Eyes of owls watch from above" },
      { time: 128, text: "Judging every failed love" },
      { time: 136, text: "Ghost forest, ghost forest" },
      { time: 142, text: "I hear whispers through the mist" },
      { time: 148, text: "Ghost forest, ghost forest" },
      { time: 154, text: "Names of everyone I've kissed" },
      { time: 162, text: "♪" },
      { time: 192, text: "But I keep walking, keep on walking" },
      { time: 200, text: "Though the shadows keep on talking" },
      { time: 208, text: "There's a clearing up ahead" },
      { time: 216, text: "Made of light, not made of dread" },
      { time: 224, text: "Ghost forest, ghost forest" },
      { time: 230, text: "I hear whispers through the mist" },
      { time: 250, text: "Ghost forest..." }
    ]
  },
  {
    id: 5,
    title: "Дыхание",
    artist: "Nautilus Pompilius",
    album: "Серебряный век",
    duration: 219,
    cover: "/images/cover15.jpg",
    audio: "/audio/track25.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 9,   text: "Lay the needle on the groove" },
      { time: 15,  text: "This is how we find our truth" },
      { time: 21,  text: "Spinning black like darkened faith" },
      { time: 27,  text: "Music as a holy wraith" },
      { time: 35,  text: "Vinyl ritual, call it sacred" },
      { time: 41,  text: "Every crackle, every break" },
      { time: 47,  text: "Vinyl ritual, we're devoted" },
      { time: 53,  text: "To the gods that music makes" },
      { time: 61,  text: "♪" },
      { time: 73,  text: "The turntable is our altar" },
      { time: 79,  text: "Never let the rhythm falter" },
      { time: 85,  text: "Candles burn in red and black" },
      { time: 91,  text: "There is no looking back" },
      { time: 99,  text: "Vinyl ritual, call it sacred" },
      { time: 105, text: "Every crackle, every break" },
      { time: 111, text: "Vinyl ritual, we're devoted" },
      { time: 117, text: "To the gods that music makes" },
      { time: 125, text: "♪" },
      { time: 155, text: "We are the keepers of the sound" },
      { time: 163, text: "That shakes the living underground" },
      { time: 171, text: "Every record tells a tale" },
      { time: 179, text: "Of flesh and fire, beyond the veil" },
      { time: 187, text: "Vinyl ritual, call it sacred" },
      { time: 193, text: "Every crackle, every break" },
      { time: 199, text: "Vinyl ritual, we're devoted" },
      { time: 205, text: "To the gods that music makes" },
      { time: 213, text: "Vinyl ritual..." }
    ]
  },
  {
    id: 6,
    title: "Город детства",
    artist: "Гражданская Оборона",
    album: "Звездопад",
    duration: 302,
    cover: "/images/cover17.jpg",
    audio: "/audio/track44.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 16,  text: "The city bleeds in neon light" },
      { time: 22,  text: "Red and blue against the night" },
      { time: 28,  text: "Arteries of asphalt run" },
      { time: 34,  text: "Beneath a cold and hollow sun" },
      { time: 42,  text: "We are the children of the glow" },
      { time: 48,  text: "Of signs that flash and overflow" },
      { time: 54,  text: "With promises that never last" },
      { time: 60,  text: "Electric futures, neon past" },
      { time: 68,  text: "Neon blood, neon blood" },
      { time: 74,  text: "Running through our veins like flood" },
      { time: 80,  text: "Neon blood, neon blood" },
      { time: 86,  text: "Burning bright enough to love" },
      { time: 94,  text: "♪" },
      { time: 120, text: "I press my palm against the glass" },
      { time: 126, text: "And watch the neon people pass" },
      { time: 132, text: "Each one a story, each one a ghost" },
      { time: 138, text: "Of who they wanted to be most" },
      { time: 146, text: "Neon blood, neon blood" },
      { time: 152, text: "Running through our veins like flood" },
      { time: 158, text: "Neon blood, neon blood" },
      { time: 164, text: "Burning bright enough to love" },
      { time: 172, text: "♪" },
      { time: 210, text: "When the neon fades to grey" },
      { time: 218, text: "And the city sleeps by day" },
      { time: 226, text: "We remember we were real" },
      { time: 234, text: "We remember how to feel" },
      { time: 244, text: "Neon blood... neon blood..." },
      { time: 265, text: "Burning bright enough to love..." },
      { time: 278, text: "♪" }
    ]
  },
  {
    id: 7,
    title: "Небо как кофе",
    artist: "Гражданская Оборона",
    album: "Реанимация",
    duration: 189,
    cover: "/images/cover18.jpg",
    audio: "/audio/track37.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 8,   text: "I hear the screaming trees at night" },
      { time: 14,  text: "They cry for something they can't fight" },
      { time: 20,  text: "The wind tears through their wooden lungs" },
      { time: 26,  text: "The oldest song that's ever sung" },
      { time: 34,  text: "I used to think I was alone" },
      { time: 40,  text: "But even trees are screaming, moan" },
      { time: 46,  text: "For rain, for sun, for something more" },
      { time: 52,  text: "That's what all of us are for" },
      { time: 60,  text: "Screaming trees, screaming trees" },
      { time: 66,  text: "Swaying in the midnight breeze" },
      { time: 72,  text: "Screaming trees, screaming trees" },
      { time: 78,  text: "Cry for me and I'll cry for these" },
      { time: 86,  text: "♪" },
      { time: 102, text: "Black fog rolls across the field" },
      { time: 108, text: "What the trees see is revealed" },
      { time: 114, text: "Centuries of standing fast" },
      { time: 120, text: "Everything we thought would last" },
      { time: 128, text: "Screaming trees, screaming trees" },
      { time: 134, text: "Swaying in the midnight breeze" },
      { time: 140, text: "Screaming trees, screaming trees" },
      { time: 146, text: "Cry for me and I'll cry for these" },
      { time: 154, text: "♪" },
      { time: 178, text: "And when I'm gone, plant one for me" },
      { time: 186, text: "So I can scream inside the tree" },
      { time: 194, text: "And passersby will stop and hear" },
      { time: 202, text: "My voice inside the atmosphere" },
      { time: 210, text: "Screaming trees, screaming trees" },
      { time: 216, text: "Swaying in the midnight breeze" },
      { time: 224, text: "Screaming trees..." }
    ]
  },
  {
    id: 8,
    title: "Наблюдатель",
    artist: "Король и Шут",
    album: "Акустический альбом",
    duration: 284,
    cover: "/images/cover4.jpg",
    audio: "/audio/track10.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" },
      { time: 20,  text: "Built by hands of blood and bone" },
      { time: 26,  text: "Towers pierce the ashen sky" },
      { time: 32,  text: "Where the ravens dare not fly" },
      { time: 40,  text: "The iron cathedral stands alone" },
      { time: 46,  text: "Its bells are forged from broken thrones" },
      { time: 52,  text: "The faithful kneel on rusted floors" },
      { time: 58,  text: "And pray behind its bolted doors" },
      { time: 66,  text: "Iron cathedral, iron cathedral" },
      { time: 74,  text: "Hear the hammers pound" },
      { time: 80,  text: "Iron cathedral, iron cathedral" },
      { time: 88,  text: "Feel the holy ground" },
      { time: 96,  text: "♪" },
      { time: 120, text: "The organ plays in minor keys" },
      { time: 126, text: "A hymn that brings the world to knees" },
      { time: 132, text: "No light of sun can reach inside" },
      { time: 138, text: "Only where the shadows hide" },
      { time: 146, text: "Iron cathedral, iron cathedral" },
      { time: 154, text: "Hear the hammers pound" },
      { time: 160, text: "Iron cathedral, iron cathedral" },
      { time: 168, text: "Feel the holy ground" },
      { time: 176, text: "♪" },
      { time: 220, text: "We built this place from rage and faith" },
      { time: 228, text: "From every broken dream and wraith" },
      { time: 236, text: "Now it stands for all to see" },
      { time: 244, text: "Monument to what we'll be" },
      { time: 254, text: "Iron cathedral, iron cathedral" },
      { time: 262, text: "Hear the hammers pound" },
      { time: 268, text: "Iron cathedral, iron cathedral" },
      { time: 276, text: "Feel the holy ground" },
      { time: 286, text: "♪" },
      { time: 336, text: "Iron cathedral..." },
      { time: 348, text: "Iron cathedral..." }
    ]
  },
  {
    id: 9,
    title: "Воля и разум",
    artist: "Ария",
    album: "С кем ты?",
    duration: 274,
    cover: "/images/cover20.jpg",
    audio: "/audio/track55.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" },
      { time: 20,  text: "Built by hands of blood and bone" },
      { time: 26,  text: "Towers pierce the ashen sky" },
      { time: 32,  text: "Where the ravens dare not fly" },
      { time: 40,  text: "The iron cathedral stands alone" },
      { time: 46,  text: "Its bells are forged from broken thrones" },
      { time: 52,  text: "The faithful kneel on rusted floors" },
      { time: 58,  text: "And pray behind its bolted doors" },
      { time: 66,  text: "Iron cathedral, iron cathedral" },
      { time: 74,  text: "Hear the hammers pound" },
      { time: 80,  text: "Iron cathedral, iron cathedral" },
      { time: 88,  text: "Feel the holy ground" },
      { time: 96,  text: "♪" },
      { time: 120, text: "The organ plays in minor keys" },
      { time: 126, text: "A hymn that brings the world to knees" },
      { time: 132, text: "No light of sun can reach inside" },
      { time: 138, text: "Only where the shadows hide" },
      { time: 146, text: "Iron cathedral, iron cathedral" },
      { time: 154, text: "Hear the hammers pound" },
      { time: 160, text: "Iron cathedral, iron cathedral" },
      { time: 168, text: "Feel the holy ground" },
      { time: 176, text: "♪" },
      { time: 220, text: "We built this place from rage and faith" },
      { time: 228, text: "From every broken dream and wraith" },
      { time: 236, text: "Now it stands for all to see" },
      { time: 244, text: "Monument to what we'll be" },
      { time: 254, text: "Iron cathedral, iron cathedral" },
      { time: 262, text: "Hear the hammers pound" },
      { time: 268, text: "Iron cathedral, iron cathedral" },
      { time: 276, text: "Feel the holy ground" },
      { time: 286, text: "♪" },
      { time: 336, text: "Iron cathedral..." },
      { time: 348, text: "Iron cathedral..." }
    ]
  },
  {
    id: 10,
    title: "Грязь",
    artist: "Ария",
    album: "Генератор зла",
    duration: 284,
    cover: "/images/cover11.jpg",
    audio: "/audio/track54.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" },
      { time: 20,  text: "Built by hands of blood and bone" },
      { time: 26,  text: "Towers pierce the ashen sky" },
      { time: 32,  text: "Where the ravens dare not fly" },
      { time: 40,  text: "The iron cathedral stands alone" },
      { time: 46,  text: "Its bells are forged from broken thrones" },
      { time: 52,  text: "The faithful kneel on rusted floors" },
      { time: 58,  text: "And pray behind its bolted doors" },
      { time: 66,  text: "Iron cathedral, iron cathedral" },
      { time: 74,  text: "Hear the hammers pound" },
      { time: 80,  text: "Iron cathedral, iron cathedral" },
      { time: 88,  text: "Feel the holy ground" },
      { time: 96,  text: "♪" },
      { time: 120, text: "The organ plays in minor keys" },
      { time: 126, text: "A hymn that brings the world to knees" },
      { time: 132, text: "No light of sun can reach inside" },
      { time: 138, text: "Only where the shadows hide" },
      { time: 146, text: "Iron cathedral, iron cathedral" },
      { time: 154, text: "Hear the hammers pound" },
      { time: 160, text: "Iron cathedral, iron cathedral" },
      { time: 168, text: "Feel the holy ground" },
      { time: 176, text: "♪" },
      { time: 220, text: "We built this place from rage and faith" },
      { time: 228, text: "From every broken dream and wraith" },
      { time: 236, text: "Now it stands for all to see" },
      { time: 244, text: "Monument to what we'll be" },
      { time: 254, text: "Iron cathedral, iron cathedral" },
      { time: 262, text: "Hear the hammers pound" },
      { time: 268, text: "Iron cathedral, iron cathedral" },
      { time: 276, text: "Feel the holy ground" },
      { time: 286, text: "♪" },
      { time: 336, text: "Iron cathedral..." },
      { time: 348, text: "Iron cathedral..." }
    ]
  },
   {
    id: 11,
    title: "Штиль",
    artist: "Ария",
    album: "Химера",
    duration: 335,
    cover: "/images/cover9.jpg",
    audio: "/audio/track46.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 7,  text: "Штиль, ветер молчит," },
      { time: 14,   text: "Упал белой чайкой на дно," },
      { time: 21,  text: "Штиль, наш корабль забыт," },
      { time: 28,  text: "Один, в мире, скованном сном." },
      { time: 35,  text: "Между всех времён, без имён и лиц," },
      { time: 42,  text: "Мы уже не ждём, что проснётся бриз." },
      { time: 50,  text: "Штиль, сходим с ума," },
      { time: 56,  text: "Жара пахнет чёрной смолой," },
      { time: 64,  text: "Смерть одного лишь нужна" },
      { time: 70,  text: "И мы, мы вернёмся домой." },
      { time: 77,  text: "Его плоть и кровь вновь насытят нас," },
      { time: 84,  text: "А за смерть ему, может, Бог воздаст." },
      { time: 91,  text: "Что нас ждёт, море хранит молчанье," },
      { time: 99,  text: "Жажда жить сушит сердца до дна," },
      { time: 105,  text: "Только жизнь здесь ничего не стоит," },
      { time: 112, text: "Жизнь других, но не твоя." },
      { time: 120, text: "Нет, гром не грянул с небес," },
      { time: 127, text: "Когда пили кровь, как зверьё," },
      { time: 134, text: "Но нестерпимым стал блеск" },
      { time: 140, text: "Креста, что мы Южным зовём." },
      { time: 147, text: "И в последний миг поднялась волна," },
      { time: 154, text: "И раздался крик - «Впереди земля!»" },
      { time: 161,  text: "Что нас ждёт, море хранит молчанье," },
      { time: 169,  text: "Жажда жить сушит сердца до дна," },
      { time: 175,  text: "Только жизнь здесь ничего не стоит," },
      { time: 183, text: "Жизнь других, но не твоя." },
      { time: 190, text: "Тынь-тынь..." },
      { time: 218, text: "Ебейшие Холстинин и Терентьев, пат!" },
      { time: 260, text: "«Ангельский хор»" },
      { time: 288,  text: "Что нас ждёт, море хранит молчанье," },
      { time: 295,  text: "Жажда жить сушит сердца до дна," },
      { time: 302,  text: "Только жизнь здесь ничего не стоит," },
      { time: 309, text: "Жизнь других, но не твоя." },
      { time: 316, text: "Пат-пат, далей!" }
      
   ]
  },
   {
    id: 12,
    title: "Беспечный ангел",
    artist: "Ария",
    album: "Легенды русского рока: Ария",
    duration: 238,
    cover: "/images/cover23.jpg",
    audio: "/audio/track58.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 15,  text: "Этот парень был из тех," },
      { time: 18,   text: "Кто просто любит жизнь," },
      { time: 22,   text: "Любит праздники и громкий смех,," },
      { time: 25,  text: "Пыль дорог и ветра свист." },
      { time: 30,  text: "Он был везде и всегда своим –" },
      { time: 34,  text: "Влюблял в себя целый свет" },
      { time: 38,  text: "И гнал свой байк, а не лимузин." },
      { time: 42,  text: "Таких друзей больше нет…" },
      { time: 46,  text: "И в гостиной при свечах" },
      { time: 49,  text: "Он танцевал, как Бог," },
      { time: 54,  text: "Но зато менялся на глазах," },
      { time: 57,  text: "Только вспомнит шум дорог." },
      { time: 61,  text: "Всё, что имел, тут же тратил," },
      { time: 65,  text: "И за порог, сделав шаг," },
      { time: 70,  text: "Мой друг давал команду братьям," },
      { time: 73,  text: "Вверх поднимая кулак…" },
      { time: 78, text: "Ты летящий вдаль, вдаль ангел," },
      { time: 85, text: "Ты летящий вдаль, вдаль ангел." },
      { time: 93, text: "Ты один только друг -" },
      { time: 95, text: "Друг на все времена," },
      { time: 97, text: "Немного таких среди нас." },
      { time: 100, text: "Ты летящий вдаль беспечный ангел." },
      { time: 106, text: "♪" },
      { time: 122, text: "Под гитарный жёсткий рок," },
      { time: 125, text: "Который так любил," },
      { time: 129, text: "На «Харлее» он домчать нас мог" },
      { time: 132, text: "До небес и звёзд любых," },
      { time: 137, text: "Но он исчез, и никто не знал," },
      { time: 141, text: "Куда теперь мчит его байк." },
      { time: 146, text: "Один бродяга нам сказал," },
      { time: 149, text: "Что он отправился в рай!" },
      { time: 153, text: "Ты летящий вдаль, вдаль ангел," },
      { time: 160, text: "Ты летящий вдаль, вдаль ангел." },
      { time: 169, text: "Но ад стал союзником рая в ту ночь" },
      { time: 173, text: "Против тебя одного…" },
      { time: 175, text: "Ты летящий вдаль беспечный ангел." },
      { time: 183, text: "Ты летящий вдаль, вдаль ангел," },
      { time: 190, text: "Ты летящий вдаль, вдаль ангел." },
      { time: 199, text: "Но ад стал союзником рая в ту ночь" },
      { time: 202, text: "Против тебя одного…" },
      { time: 205, text: "Ты летящий вдаль, вдаль ангел." },
      { time: 212, text: "Ты летящий вдаль беспечный ангел." },
      { time: 229, text: "эх, ну хороше же, к." }  
   ]
  },
   {
    id: 13,
    title: "Вселенская большая любовь",
    artist: "Гражданская Оборона",
    album: "Долгая счастливая жизнь",
    duration: 358,
    cover: "/images/cover16.jpg",
    audio: "/audio/track45.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 14,
    title: "Солнце взойдёт",
    artist: "Гражданская оборона",
    album: "Звездопад",
    duration: 281,
    cover: "/images/cover17.jpg",
    audio: "/audio/track31.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 15,
    title: "Мёртвые",
    artist: "Гражданская Оборона",
    album: "Лунный переворот",
    duration: 157,
    cover: "/images/cover19.jpg",
    audio: "/audio/track39.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 16,
    title: "Во время дождя",
    artist: "Nautilus Pompilius",
    album: "Серебряный век",
    duration: 213,
    cover: "/images/cover15.jpg",
    audio: "/audio/track27.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" },
      
   ]
  },
   {
    id: 17,
    title: "Возьми моё сердце",
    artist: "Ария",
    album: "Ночь короче дня",
    duration: 246,
    cover: "/images/cover10.jpg",
    audio: "/audio/track56.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Слепая ночь легла у ног" },
      { time: 17,  text: "И не пускает за порог" },
      { time: 21,  text: "Брожу по дому как во сне" },
      { time: 24,  text: "Но мне покоя нет нигде" },
      { time: 27,  text: "Тупая боль пробьёт висок" },
      { time: 31,  text: "И пальцы лягут на курок" },
      { time: 34,  text: "А в зеркалах качнётся призрак" },
      { time: 38,  text: "Призрак любви" },
      { time: 41,  text: "Возьми моё сердце," },
      { time: 45,  text: "Возьми мою душу." },
      { time: 48,  text: "Я так одинок в этот час" },
      { time: 52,  text: "Что хочу умереть" },
      { time: 55,  text: "Мне некуда деться" },
      { time: 59,  text: "Свой мир я разрушил" },
      { time: 62,  text: "По мне плачет только свеча" },
      { time: 65,  text: "На холодной заре..." },
      { time: 70,  text: "♪" },
      { time: 83,  text: "Ты умерла в дождливый день" },
      { time: 87,  text: "И тени плыли по воде" },
      { time: 91,  text: "Я смерть увидел в первый раз" },
      { time: 94,  text: "Её величе и грязь" },
      { time: 97,  text: "В твоих глазах застыла боль" },
      { time: 100, text: "Я разделю её с тобой" },
      { time: 104, text: "А в зеркалах качнётся призрак" },
      { time: 107, text: "Призрак любви" },
      { time: 111, text: "Возьми моё сердце," },
      { time: 115, text: "Возьми мою душу." },
      { time: 118, text: "Я так одинок в этот час" },
      { time: 121, text: "Что хочу умереть" },
      { time: 125, text: "Мне некуда деться" },
      { time: 128, text: "Свой мир я разрушил" },
      { time: 132, text: "По мне плачет только свеча" },
      { time: 135, text: "На холодной заре..." },
      { time: 140, text: "Я слышу утренний колокол" },
      { time: 143, text: "Он славит праздник" },
      { time: 147, text: "И сыпет медью и золотом" },
      { time: 150, text: "Ты теперь в царстве вечного сна" },
      { time: 154, text: "Я слышу утренний колокол" },
      { time: 157, text: "Он бесов дразнит" },
      { time: 161, text: "И звоном небо расколото" },
      { time: 164, text: "На земле я любил лишь тебя-я-я-я!" },
      { time: 169, text: "ЭТО АРИЯ, ПАТ" },
      { time: 196, text: "Я слышу утренний колокол" },
      { time: 200, text: "Он славит праздник" },
      { time: 203, text: "И сыпет медью и золотом" },
      { time: 207, text: "Ты теперь в царстве вечного сна" },
      { time: 210, text: "Я слышу утренний колокол" },
      { time: 213, text: "Он бесов дразнит" },
      { time: 217, text: "И звоном небо расколото" },
      { time: 220, text: "На земле я любил лишь тебя-я-я-я!"},
      { time: 227, text: "Возьми моё сердце-е-е..." },
      { time: 283, text: "♪" }
   ]
  },
   {
    id: 18,
    title: "Тяни!",
    artist: "Король и Шут",
    album: "Акустический альбом",
    duration: 176,
    cover: "/images/cover4.jpg",
    audio: "/audio/track2.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 19,
    title: "Джокер",
    artist: "Король и Шут",
    album: "продавец кошмаров",
    duration: 196,
    cover: "/images/cover7.jpg",
    audio: "/audio/track13.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 20,
    title: "Кабуки",
    artist: "Гражданская оборона",
    album: "Долгая счастливая жизнь",
    duration: 213,
    cover: "/images/cover16.jpg",
    audio: "/audio/track41.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 21,
    title: "Далеко бежит дорога",
    artist: "гражданская Оборона",
    album: "Лунный переворот",
    duration: 321,
    cover: "/images/cover19.jpg",
    audio: "/audio/track43.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 22,
    title: "Шар цвета хаки",
    artist: "Nautilus Pompilius",
    album: "Золотой век",
    duration: 160,
    cover: "/images/cover14.jpg",
    audio: "/audio/track18.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 23,
    title: "Скованные одной цепью",
    artist: "Nautilus Pompilius",
    album: "Золотой век",
    duration: 258,
    cover: "/images/cover14.jpg",
    audio: "/audio/track19.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 24,
    title: "Тореро",
    artist: "Ария",
    album: "Мания величия",
    duration: 329,
    cover: "/images/cover12.jpg",
    audio: "/audio/track48.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
 {
    id: 25,
    title: "Потерянный рай",
    artist: "Ария",
    album: "2000  и 1 ночь",
    duration: 353,
    cover: "/images/cover13.jpg",
    audio: "/audio/track50.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 26,
    title: "Ангельская пыль",
    artist: "Ария",
    album: "Ночь короче дня",
    duration: 360,
    cover: "/images/cover10.jpg",
    audio: "/audio/track57.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
 {
    id: 27,
    title: "Праздник общей беды",
    artist: "Nautilus Pompilius",
    album: "Золотой век",
    duration: 166,
    cover: "/images/cover14.jpg",
    audio: "/audio/track21.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 28,
    title: "Прогулгки по воде",
    artist: "Nautilus Pompilius",
    album: "Серебряный век",
    duration: 225,
    cover: "/images/cover15.jpg",
    audio: "/audio/track20.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 29,
    title: "Реанимация",
    artist: "Гражданская Оборона",
    album: "Реанимация",
    duration: 256,
    cover: "/images/cover18.jpg",
    audio: "/audio/track33.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 30,
    title: "Про дурочка",
    artist: "Гроажданская Оборона",
    album: "Лунный переворот",
    duration: 291,
    cover: "/images/cover19.jpg",
    audio: "/audio/track34.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 31,
    title: "Убивать",
    artist: "Гражданская Оборона",
    album: "Реанимация",
    duration: 524,
    cover: "/images/cover18.jpg",
    audio: "/audio/track29.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 32,
    title: "Улица роз",
    artist: "Ария",
    album: "Герой асфальта",
    duration: 356,
    cover: "/images/cover22.jpg",
    audio: "/audio/track47.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 33,
    title: "Мёртвая зона",
    artist: "Ария",
    album: "Герой асфальта",
    duration: 403,
    cover: "/images/cover22.jpg",
    audio: "/audio/track52.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 34,
    title: "Дезертир",
    artist: "Ария",
    album: "Генератор зла",
    duration: 390,
    cover: "/images/cover11.jpg",
    audio: "/audio/track53.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 35,
    title: "Осколок льда",
    artist: "Ария",
    album: "Химера",
    duration: 325,
    cover: "/images/cover9.jpg",
    audio: "/audio/track51.mp3",
    genre: "Ария",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 36,
    title: "Нежный вампир",
    artist: "Nautilus Pompilius",
    album: "Серебряный век",
    duration: 237,
    cover: "/images/cover15.jpg",
    audio: "/audio/track16.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 37,
    title: "Падал тёплый снег",
    artist: "Nautilus Pompilius",
    album: "Золотой век",
    duration: 170,
    cover: "/images/cover14.jpg",
    audio: "/audio/track22.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 38,
    title: "Песня о большом прожорище",
    artist: "Гражданская Оборона",
    album: "Долгая счастливая жизнь",
    duration: 201,
    cover: "/images/cover19.jpg",
    audio: "/audio/track36.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 39,
    title: "Пой, революция!",
    artist: "Гражданская Оборона",
    album: "Лунный переворот",
    duration: 198,
    cover: "/images/cover19.jpg",
    audio: "/audio/track35.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 40,
    title: "Два монаха в одну ночь",
    artist: "Король и Шут",
    album: "Как в старой сказке",
    duration: 120,
    cover: "/images/cover5.jpg",
    audio: "/audio/track14.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 41,
    title: "Гимн Шута",
    artist: "Король и Шут",
    album: "как в старой сказке",
    duration: 300,
    cover: "/images/cover5.jpg",
    audio: "/audio/track15.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 42,
    title: "Сосиска",
    artist: "Король и Шут",
    album: "Акустический альбом",
    duration: 132,
    cover: "/images/cover4.jpg",
    audio: "/audio/track7.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 43,
    title: "Крылья",
    artist: "Nautilus Pompilius",
    album: "Серебряный век",
    duration: 226,
    cover: "/images/cover15.jpg",
    audio: "/audio/track23.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 44,
    title: "Князь тишины",
    artist: "Nautilus Pompilius",
    album: "Золотой век",
    duration: 214,
    cover: "/images/cover14.jpg",
    audio: "/audio/track24.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 45,
    title: "Каравелла",
    artist: "Гражданская Оборона",
    album: "Звездопад",
    duration: 165,
    cover: "/images/cover17.jpg",
    audio: "/audio/track40.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 46,
    title: "Забытые ботинки",
    artist: "Король и Шут",
    album: "Акустический альбом",
    duration: 166,
    cover: "/images/cover4.jpg",
    audio: "/audio/track12.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 47,
    title: "Доктор твоего тела",
    artist: "Nautilus Pompilius",
    album: "Золотой век",
    duration: 275,
    cover: "/images/cover14.jpg",
    audio: "/audio/track26.mp3",
    genre: "Наутилус",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 48,
    title: "Сказка про дракона",
    artist: "Король и Шут",
    album: "Будь как дома, Путник...",
    duration: 174,
    cover: "/images/cover8.jpg",
    audio: "/audio/track8.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 49,
    title: "Продавец кошмаров ",
    artist: "Король и Шут",
    album: "Продавец кошмаров ",
    duration: 216,
    cover: "/images/cover7.jpg",
    audio: "/audio/track9.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 50,
    title: "Солнцеворот",
    artist: "гражданская Оборона",
    album: "Лунный переворот",
    duration: 261,
    cover: "/images/cover19.jpg",
    audio: "/audio/track30.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 51,
    title: "Свой среди чужих",
    artist: "Гражданская Оборона",
    album: "Звездопад",
    duration: 320,
    cover: "/images/cover17.jpg",
    audio: "/audio/track32.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 52,
    title: "На дальней станции сойду",
    artist: "Гражданская Оборона",
    album: "Звездопад",
    duration: 264,
    cover: "/images/cover17.jpg",
    audio: "/audio/track38.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 53,
    title: "Русское поле экспериментов",
    artist: "Гражданская Оборона",
    album: "The Best. Part 1",
    duration: 854,
    cover: "/images/cover21.jpg",
    audio: "/audio/track59.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 54,
    title: "Чужое",
    artist: "Гражданская Оборона      ",
    album: "Долгая счастливая жизнь",
    duration: 176,
    cover: "/images/cover16.jpg",
    audio: "/audio/track28.mp3",
    genre: "Гр.Об",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Rise the walls of iron and stone" }
   ]
  },
   {
    id: 55,
    title: "Мастер приглашает в гости",
    artist: "Король и Шут",
    album: "Герои и злодеи",
    duration: 197,
    cover: "/images/cover6.jpg",
    audio: "/audio/track11.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 23,  text: "Вечером к столу" },
      { time: 26,  text: "Мастер пригласил" },
      { time: 28,  text: "Верного слугу" },
      { time: 31,  text: "И его спросил -" },
      { time: 33,  text: "«Сколько раз ты, встречая моих гостей?" },
      { time: 37,  text: "Никого никогда за дверь не провожал" },
      { time: 41,  text: "И ты поймёшь теперь, что в тайне я держал»" },
      { time: 46,  text: "В те дни, когда я в настроении бываю," },
      { time: 51,  text: "Сидя у огня черепа перебираю." },
      { time: 57,  text: "♪" },
      { time: 62,  text: "Преданный слуга" },
      { time: 65,  text: "Улыбнулся тут:" },
      { time: 68,  text: "«Я любил всегда" },
      { time: 71,  text: "Свой нелёгкий труд!" },
      { time: 74,  text: "По ночам сижу, за ножом слежу" },
      { time: 76,  text: "Фигурки вырезаю из костей," },
      { time: 80,  text: "С ремеслом дружу" },
      { time: 82,  text: "Обожаю гостей!»" },
      { time: 86,  text: "В те дни, когда я в настроении бываю," },
      { time: 91,  text: "Сидя у огня черепа перебираю." },
      { time: 97,  text: "♪" },
      { time: 129, text: "В те дни, когда я в настроении бываю," },
      { time: 134, text: "Сидя у огня черепа перебираю." },
      { time: 140, text: "Все те, кто не прочь" },
      { time: 143, text: "Поразмять немного кости -" },
      { time: 145, text: "Вас ждут в эту ночь -" },
      { time: 148, text: "Мастер приглашает в гости!" },
      { time: 151, text: "пат, пат, пат!" }
   ]
  },
   {
    id: 56,
    title: "Тень 3. Двое против всех",
    artist: "Ария",
    album: "Тень клоуна",
    duration: 232,
    cover: "/images/cover3.jpg",
    audio: "/audio/track6.mp3",
    genre: "КиШ",
    lyrics: [
     
   ]
  },
   {
    id: 57,
    title: "Тень 4. В Париж - домой",
    artist: "Король и Шут",
    album: "Тень клоуна",
    duration: 295,
    cover: "/images/cover3.jpg",
    audio: "/audio/track5.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 14,  text: "Себе шепну:" },
      { time: 18,  text: "«Признайтесь, граф," },
      { time: 21,  text: "В том, что ваш друг" },
      { time: 25,  text: "В ту ночь был прав." },
      { time: 29,  text: "Когда вдыхая" },
      { time: 33,  text: "Табачный дым" },
      { time: 36,  text: "Сказал, что знал" },
      { time: 39,  text: "Вас, граф, другим»." },
      { time: 43,  text: "Право, друг мой, что тут скажешь," },
      { time: 47,  text: "Правды я от вас не утаю," },
      { time: 54,  text: "Всё как-то странно…" },
      { time: 58,  text: "Сердцу, друг мой, не прикажешь" },
      { time: 62,  text: "Сам себя порой не узнаю," },
      { time: 68,  text: "Я не узнаю." },
      { time: 73,  text: "Снова волки воют на луну-у-у~" },
      { time: 81,  text: "В возвращение верю, как в мечту-у-у~." },
      { time: 88,  text: "Опять в шатёр" },
      { time: 92,  text: "Глядит луна" },
      { time: 95,  text: "Налейте, друг," },
      { time: 99,  text: "Ещё вина." },
      { time: 102, text: "Даст Бог, удастся," },
      { time: 106, text: "В чужих краях" },
      { time: 110, text: "Нам, друг, не пасть" },
      { time: 113, text: "В лихих боях." },
      { time: 117, text: "Моё сердце накопило" },
      { time: 121, text: "Сотни признаков, что я люблю" },
      { time: 127, text: "Девушку эту…" },
      { time: 131, text: "Всё, что между нами было," },
      { time: 135, text: "И у бездны вспомню на краю" },
      { time: 141, text: "Я не шучу." },
      { time: 147, text: "Снова волки воют на луну-у-у~" },
      { time: 154, text: "В возвращение верю, как в мечту-у-у~." },
      { time: 161, text: "Я топлю тоску свою в вине-е-е~" },
      { time: 168, text: "В этой ссылке на чужой войне-е-е~." },
      { time: 175, text: "кстати, песня о первой мировой войне " },
      { time: 205, text: "Моё сердце накопило" },
      { time: 209, text: "Сотни признаков, что я люблю" },
      { time: 219, text: "Девушку эту…" },
      { time: 223, text: "Всё, что между нами было," },
      { time: 227, text: "И у бездны вспомню на краю" },
      { time: 229, text: "Я не шучу." },
      { time: 235, text: "Снова волки воют на луну-у-у~" },
      { time: 242, text: "В возвращение верю, как в мечту-у-у~." },
      { time: 250, text: "Я топлю тоску свою в вине-е-е~" },
      { time: 257, text: "В этой ссылке на чужой войне-е-е~." },
      { time: 264, text: "Прорвёмся, прорвёмся, прорвёмся," },
      { time: 266, text: "Мой друг с тобой," },
      { time: 270, text: "Вернёмся, вернёмся, вернёмся," },
      { time: 273, text: "В Париж домой." },
      { time: 277, text: "Снова волки воют на луну-у-у~" },
      { time: 285, text: "В возвращение верю, как в мечту-у-у~" }
   ]
  },
   {
    id: 58,
    title: "Тень 10. A.M.T.V",
    artist: "Король и Шут",
    album: "Тень клоуна",
    duration: 234,
    cover: "/images/cover3.jpg",
    audio: "/audio/track4.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "♪" },
      { time: 15,  text: "Открыл глаза," },
      { time: 17,   text: "Поставил чайник," },
      { time: 19,  text: "Кипит вода," },
      { time: 20,  text: "Не сплю ночами." },
      { time: 22,  text: "Открыл окно," },
      { time: 24,  text: "Аптека, скверик," },
      { time: 26,  text: "Все как обычно," },
      { time: 28,  text: "Включил я телик." },
      { time: 30,  text: "Здравствуй, Америка – MTV," },
      { time: 33,  text: "В городе гаснут ночные огни," },
      { time: 37,  text: "В моем телевизоре – MTV" },
      { time: 41,  text: "Режет глаза мои RNB." },
      { time: 45,  text: "Сука, заскулила," },
      { time: 52,  text: "С кошкой чего-то не поделила," },
      { time: 60,  text: "Мы живем здесь уйму лет," },
      { time: 63,  text: "Моя жучка, я, да черный кот," },
      { time: 67,  text: "Нас троих окутал свет" },
      { time: 71,  text: "Теле-радио частот." },
      { time: 79,  text: "Американского MTV," },
      { time: 82,  text: "В городе гаснут ночные огни," },
      { time: 86,  text: "В моем телевизоре снова они," },
      { time: 90,  text: "Нервы ржавеют русской души." },
      { time: 94,  text: "Сука, заскулила," },
      { time: 101, text: "С кошкой чего-то не поделила." },
      { time: 108, text: "Ты почто котяра злой," },
      { time: 112, text: "Да собачке в глазик коготь свой," },
      { time: 116, text: "Ей же больно, как и мне," },
      { time: 119, text: "Видеть, что в моей стране," },
      { time: 122, text: "Видеть мне" },
      { time: 127, text: "Больно!" },
      { time: 128, text: "Американское MTV," },
      { time: 131, text: "В городе гаснут ночные огни," },
      { time: 135, text: "В моем телевизоре, снова они," },
      { time: 138, text: "Режет глаза мои RNB." },
      { time: 142, text: "пат, пат, пат!" },
      { time: 157,  text: "Мы живем здесь уйму лет," },
      { time: 160,  text: "Моя жучка, я, да черный кот," },
      { time: 165,  text: "Нас троих окутал свет" },
      { time: 168,  text: "Теле-радио частот." },
      { time: 176,  text: "Американского MTV," },
      { time: 180,  text: "В городе гаснут ночные огни," },
      { time: 184,  text: "В моем телевизоре снова они," },
      { time: 187,  text: "Нервы ржавеют русской души." },
      { time: 193,  text: "Здравствуй, Америка – MTV," },
      { time: 196,  text: "В городе гаснут ночные огни," },
      { time: 200,  text: "В моем телевизоре – MTV" },
      { time: 204,  text: "Режет глаза мои RNB." },
      { time: 210,  text: "MTV!" },
      { time: 218,  text: "MTV!" },
      { time: 220,   text: "♪" }
   ]
  },
   {
    id: 59,
    title: "Тень 15. Тринадцатая рана",
    artist: "Король и Шут",
    album: "Тень клоуна",
    duration: 161,
    cover: "/images/cover3.jpg",
    audio: "/audio/track3.mp3",
    genre: "КиШ",
    lyrics: [
      { time: 0,   text: "П’ятий у сім’ї, прізвисько Махно." },
      { time: 6,  text: "Не дає заснути, мій турбує сон." },
      { time: 12,  text: "Хитрий як лиса, скільки душ згубив?" },
      { time: 18,  text: "Мало не вмивався кров’ю ворогів." },
      { time: 24,  text: "Більшовик – дурак, – я в лице сміюсь," },
      { time: 29,  text: "На чотири сторони Богу не молюсь." },
      { time: 35,  text: "Знаєш, двадцять ран в тілі не болять," },
      { time: 41,  text: "Лиш болить тринадцята, що в серці у мене." },
      { time: 47,  text: "Від більшовиків золото сховав," },
      { time: 53,  text: "Нищим еміґрантом у Франції вмирав." },
      { time: 58,  text: "Воля або смерть, мать-анархія," },
      { time: 64,  text: "Чорний колір прапору – то моя земля!" },
      { time: 70,  text: "♪" },
      { time: 87,  text: "У «Гуляй Полi» подешевiло життя" },
      { time: 91,  text: "Вбивати легше, нiж боятися смертi" },
      { time: 94,  text: "Воїн один, боялись його наче Сатани!" },
      { time: 99,  text: "Зрада червоних, розбите вiйсько," },
      { time: 102,  text: "Дворова змiя показує хвiст," },
      { time: 105,  text: "Латинськi букви, арабськi цифри" },
      { time: 108,  text: "Могили номер – шicть-шicть-вiсiм-шicть!" },
      { time: 114, text: "♪" },
      { time: 136, text: "На чотири сторони Богу не молюсь!" },
      { time: 148, text: "ппат-пат, далей!" }
   ]
  }
];

const PLAYLISTS = [
  {
    id: 1,
    name: "My Playlist",
    trackIds: [1, 3, 5]
  }
];

/* ──────────────────────────────────────────────
   API — Треки
────────────────────────────────────────────── */

// Все треки
app.get('/api/tracks', (req, res) => {
  const { genre, search } = req.query;
  let tracks = TRACKS;

  if (genre)  tracks = tracks.filter(t => t.genre.toLowerCase() === genre.toLowerCase());
  if (search) tracks = tracks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.artist.toLowerCase().includes(search.toLowerCase())
  );

  res.json({ tracks, total: tracks.length });
});

// Один трек
app.get('/api/tracks/:id', (req, res) => {
  const track = TRACKS.find(t => t.id === parseInt(req.params.id));
  if (!track) return res.status(404).json({ error: 'Track not found' });
  res.json(track);
});

/* ──────────────────────────────────────────────
   API — Стриминг аудио (Range Requests)
   Поддерживает seek/перемотку в браузере
────────────────────────────────────────────── */
app.get('/api/stream/:id', (req, res) => {
  const track = TRACKS.find(t => t.id === parseInt(req.params.id));
  if (!track) return res.status(404).json({ error: 'Track not found' });

  // Если ссылка внешняя (Cloudinary) — редиректим
  if (track.audio.startsWith('http')) {
    return res.redirect(track.audio);
  }

  const filePath = path.join(__dirname, 'public', track.audio);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      error: 'Audio file not found. Add MP3 files to public/audio/',
      expected: filePath
    });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end   = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range':  `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges':  'bytes',
      'Content-Length': chunkSize,
      'Content-Type':   'audio/mpeg',
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type':   'audio/mpeg',
      'Accept-Ranges':  'bytes',
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

/* ──────────────────────────────────────────────
   API — Плейлисты
────────────────────────────────────────────── */

// Получить все плейлисты
app.get('/api/playlists', (req, res) => {
  const populated = PLAYLISTS.map(pl => ({
    ...pl,
    tracks: pl.trackIds.map(id => TRACKS.find(t => t.id === id)).filter(Boolean)
  }));
  res.json(populated);
});

// Получить один плейлист
app.get('/api/playlists/:id', (req, res) => {
  const pl = PLAYLISTS.find(p => p.id === parseInt(req.params.id));
  if (!pl) return res.status(404).json({ error: 'Playlist not found' });
  res.json({
    ...pl,
    tracks: pl.trackIds.map(id => TRACKS.find(t => t.id === id)).filter(Boolean)
  });
});

// Создать плейлист
app.post('/api/playlists', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const newPlaylist = {
    id: PLAYLISTS.length + 1,
    name,
    trackIds: []
  };
  PLAYLISTS.push(newPlaylist);
  res.status(201).json(newPlaylist);
});

// Добавить трек в плейлист
app.post('/api/playlists/:id/tracks', (req, res) => {
  const pl = PLAYLISTS.find(p => p.id === parseInt(req.params.id));
  if (!pl) return res.status(404).json({ error: 'Playlist not found' });

  const { trackId } = req.body;
  if (!trackId) return res.status(400).json({ error: 'trackId required' });

  const track = TRACKS.find(t => t.id === parseInt(trackId));
  if (!track) return res.status(404).json({ error: 'Track not found' });

  if (!pl.trackIds.includes(parseInt(trackId))) {
    pl.trackIds.push(parseInt(trackId));
  }

  res.json({
    ...pl,
    tracks: pl.trackIds.map(id => TRACKS.find(t => t.id === id)).filter(Boolean)
  });
});

// Удалить трек из плейлиста
app.delete('/api/playlists/:id/tracks/:trackId', (req, res) => {
  const pl = PLAYLISTS.find(p => p.id === parseInt(req.params.id));
  if (!pl) return res.status(404).json({ error: 'Playlist not found' });

  pl.trackIds = pl.trackIds.filter(tid => tid !== parseInt(req.params.trackId));
  res.json({
    ...pl,
    tracks: pl.trackIds.map(id => TRACKS.find(t => t.id === id)).filter(Boolean)
  });
});

/* ──────────────────────────────────────────────
   API — Lyrics
────────────────────────────────────────────── */
app.get('/api/tracks/:id/lyrics', (req, res) => {
  const track = TRACKS.find(t => t.id === parseInt(req.params.id));
  if (!track) return res.status(404).json({ error: 'Track not found' });
  res.json({ trackId: track.id, title: track.title, artist: track.artist, lyrics: track.lyrics || [] });
});

/* ──────────────────────────────────────────────
   API — Жанры
────────────────────────────────────────────── */
app.get('/api/genres', (req, res) => {
  const genres = [...new Set(TRACKS.map(t => t.genre))];
  res.json(genres);
});

/* ──────────────────────────────────────────────
   SPA fallback — отдаём index.html
────────────────────────────────────────────── */
// 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ──────────────────────────────────────────────
   Запуск
────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n🎸 Rock Zone Server running at http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/tracks`);
  console.log(`   Add MP3 files to: public/audio/track1.mp3 ... track8.mp3\n`);
});
