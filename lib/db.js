import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'db.json');

const NAMES = ['Aanya','Rohan','Meera','Kabir','Isha','Arjun','Diya','Vihaan','Saanvi','Aditya',
  'Riya','Karan','Anika','Dev','Tara','Neil','Kiara','Yash','Myra','Ishaan',
  'Zoya','Reyansh','Navya','Aarav','Pooja','Rahul','Sneha','Varun','Ira','Manav'];
const PLACES = ['IIT Delhi','Delhi University','Dehradun','BITS Pilani','Mumbai','Bangalore',
  'Pune','Christ University','Hyderabad','Chandigarh'];
const INTERESTS = ['Hiking','Coffee','Indie music','Photography','Cricket','Anime','Cooking','Travel',
  'Gaming','Books','Yoga','Standup comedy','Football','Painting','Startups','Movies'];
const BIOS = ['Chai over coffee, always.','Will trade playlists for snacks.','Weekend trekker, weekday coder.',
  'Looking for someone to explore new cafes with.','Dog person. Sorry, cat people.','Professional overthinker.',
  'Ask me about my favourite book.','Gym at 6am, memes at 6pm.','Spontaneous plans > perfect plans.','Fluent in sarcasm and movie quotes.'];
function seed() {
  const profiles = NAMES.map((name, i) => ({
    id: `p${i + 1}`,
    name,
    age: 19 + (i * 7) % 10,
    photo: `https://picsum.photos/seed/coy-${i + 1}/600/800`,
    bio: BIOS[i % BIOS.length],
    city: PLACES[(i * 3) % PLACES.length],
    interests: [0, 5, 11].map(k => INTERESTS[(i + k) % INTERESTS.length]),
    // Server-only: randomly decided at seed time whether this profile already liked the user.
    likedMe: Math.random() < 0.5,
  }));
  // Deterministic shuffle so feed order doesn't leak who liked the user.
  const order = profiles.map((p, i) => [(i * 17 + 5) % 31, p]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  return { profiles: order, swipes: [], matches: [] };
}

export function load() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(seed(), null, 2));
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

export function save(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

export function reset() {
  save(seed());
}

// Strip server-only fields. `likedMe` must never reach the client.
export function publicProfile({ likedMe, ...rest }) {
  return rest;
}
