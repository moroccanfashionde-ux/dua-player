import { Dua } from './types';

const BASE_AUDIO = "https://ia800904.us.archive.org/8/items/islamic-dua-in-audio/Healing.mp3";
// Fallback to reliable source if the S3 link is expired or broken
const LONG_AUDIO = "https://ia800904.us.archive.org/8/items/islamic-dua-in-audio/Healing.mp3"; 

export const DUAS: Dua[] = [
  {
    id: "shifa-long",
    title: "Heilung (stark)",
    tag: "Heilung",
    color: "green",
    roman: "Allāhumma rabb an-nās, adhhib al-ba’s, ishfi anta ash-shāfī,\nlā shifāʾa illā shifāʾuk, shifāʾan lā yughadiru saqaman",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي،\nلَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
    de: "O Allah, Herr der Menschen, nimm das Leid fort. Heile – Du bist der Heiler.\nEs gibt keine Heilung außer Deiner, eine Heilung, die keine Krankheit zurücklässt.",
    audioUrl: LONG_AUDIO
  },
  {
    id: "shifa-short",
    title: "Vollständige Heilung (kurz)",
    tag: "Heilung",
    color: "blue",
    roman: "Allāhumma ishfinī shifāʾan tāmmā",
    arabic: "اللَّهُمَّ اشْفِنِي شِفَاءً تَامًّا",
    de: "O Allah, schenke mir vollständige Heilung.",
    audioUrl: BASE_AUDIO
  },
  {
    id: "nur-basar",
    title: "Licht im Sehen",
    tag: "Augen",
    color: "purple",
    roman: "Allāhumma ijʿal fī baṣarī nūran",
    arabic: "اللَّهُمَّ اجْعَلْ فِي بَصَرِي نُورًا",
    de: "O Allah, lege Licht in mein Sehvermögen.",
    audioUrl: BASE_AUDIO
  },
  {
    id: "nur-eyes",
    title: "Licht in Augen & Sehen",
    tag: "Augen",
    color: "blue",
    roman: "Allāhumma ijʿal fī ʿaynayya nūran, wa fī baṣarī nūran",
    arabic: "اللَّهُمَّ اجْعَلْ فِي عَيْنَيَّ نُورًا، وَفِي بَصَرِي نُورًا",
    de: "O Allah, lege Licht in meine Augen und Licht in mein Sehen.",
    audioUrl: BASE_AUDIO
  },
  {
    id: "protect-eyes",
    title: "Schutz & Stärke der Augen",
    tag: "Augen",
    color: "orange",
    roman: "Allāhumma qawwi baṣarī waḥfaẓ ʿaynayya min kulli sūʾ",
    arabic: "اللَّهُمَّ قَوِّ بَصَرِي وَاحْفَظْ عَيْنَيَّ مِنْ كُلِّ سُوءٍ",
    de: "O Allah, stärke mein Sehvermögen und schütze meine Augen vor allem Schlechten.",
    audioUrl: BASE_AUDIO
  },
  {
    id: "ayyub",
    title: "Duʿāʾ von Ayyūb (Qurʾan)",
    tag: "Geduld",
    color: "purple",
    roman: "Annī massaniya ḍ-ḍurru wa anta arḥam ar-rāḥimīn",
    arabic: "أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ",
    de: "Mich hat Leid berührt – und Du bist der Barmherzigste der Barmherzigen.",
    audioUrl: BASE_AUDIO
  },
  {
    id: "kaliimat",
    title: "Schutz (Worte Allahs)",
    tag: "Schutz",
    color: "blue",
    roman: "Aʿūdhu bi-kalimāti llāhi t-tāmmāti min kulli sūʾ",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ كُلِّ سُوءٍ",
    de: "Ich suche Zuflucht bei den vollkommenen Worten Allahs vor allem Übel.",
    audioUrl: BASE_AUDIO
  },
  {
    id: "bismillah",
    title: "Morgens/Abends (kurz)",
    tag: "Schutz",
    color: "green",
    roman: "Bismi llāhi lladhī lā yaḍurru maʿa ismihi shayʾ",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ",
    de: "Im Namen Allahs, mit dessen Namen nichts schadet. (3× morgens & abends)",
    audioUrl: BASE_AUDIO
  },
  {
    id: "ya-allah",
    title: "Ganz kurz (sanft)",
    tag: "Heilung",
    color: "green",
    roman: "Yā Allāh, ishfinī",
    arabic: "يَا اللَّهُ اشْفِنِي",
    de: "O Allah, heile mich.",
    audioUrl: BASE_AUDIO
  }
];