const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const localTrivia = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'trivia.json'), 'utf8'));
let schaleStudents = [];
const triviaSessions = new Map();

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Load student data from SchaleDB + torikushiii on startup
async function loadStudentData() {
  const https = require('https');

  function httpsGet(url) {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => resolve(JSON.parse(raw)));
        res.on('error', reject);
      }).on('error', reject);
    });
  }

  const [schaleRaw, torikushiRaw] = await Promise.allSettled([
    httpsGet('https://cdn.jsdelivr.net/gh/SchaleDB/SchaleDB@main/data/en/students.json'),
    httpsGet('https://api.ennead.cc/buruaka/character')
  ]);

  const seen = new Set();

  if (schaleRaw.status === 'fulfilled') {
    const filtered = schaleRaw.value.filter(s => s.IsReleased[0]);
    for (const s of filtered) { schaleStudents.push(s); seen.add(s.Name.toLowerCase()); }
    console.log(`SchaleDB: loaded ${filtered.length} students.`);
  } else {
    console.error('SchaleDB failed:', schaleRaw.reason?.message);
  }

  if (torikushiRaw.status === 'fulfilled') {
    let added = 0;
    const extras = [];
    for (const s of torikushiRaw.value) {
      if (!seen.has(s.name.toLowerCase())) {
        schaleStudents.push({ Name: s.name, School: s.school, TacticRole: s.role, WeaponType: s.weaponType, Club: null, Birthday: null });
        seen.add(s.name.toLowerCase());
        extras.push(s.name);
        added++;
      }
    }
    console.log(`torikushiii: added ${added} extra students.`);
    if (extras.length > 0) console.log(`Extra students: ${extras.join(', ')}`);
  } else {
    console.error('torikushiii failed:', torikushiRaw.reason?.message);
  }

  console.log(`Total trivia pool: ${schaleStudents.length} students.`);
}

function generateSchaleQuestion() {
  if (schaleStudents.length === 0) return null;
  const student = schaleStudents[Math.floor(Math.random() * schaleStudents.length)];

  const types = ['school', 'role', 'weapon'];
  if (student.Birthday) types.push('birthday');
  if (student.Club)     types.push('club');
  const type = types[Math.floor(Math.random() * types.length)];

  let question, answer, wrongPool;

  if (type === 'school') {
    const pool = [...new Set(schaleStudents.map(s => s.School).filter(Boolean))];
    answer = student.School;
    wrongPool = shuffle(pool.filter(s => s !== answer)).slice(0, 3);
    question = `Which school does **${student.Name}** belong to?`;
  } else if (type === 'role') {
    const pool = [...new Set(schaleStudents.map(s => s.TacticRole).filter(Boolean))];
    answer = student.TacticRole;
    wrongPool = shuffle(pool.filter(r => r !== answer)).slice(0, 3);
    question = `What is **${student.Name}**'s tactic role?`;
  } else if (type === 'weapon') {
    const pool = [...new Set(schaleStudents.map(s => s.WeaponType).filter(Boolean))];
    answer = student.WeaponType;
    wrongPool = shuffle(pool.filter(w => w !== answer)).slice(0, 3);
    question = `What weapon type does **${student.Name}** use?`;
  } else if (type === 'birthday') {
    answer = student.Birthday;
    wrongPool = shuffle(schaleStudents.filter(s => s.Name !== student.Name && s.Birthday)).slice(0, 3).map(s => s.Birthday);
    question = `When is **${student.Name}**'s birthday?`;
  } else {
    const pool = [...new Set(schaleStudents.map(s => s.Club).filter(Boolean))];
    answer = student.Club;
    wrongPool = shuffle(pool.filter(c => c !== answer)).slice(0, 3);
    question = `What club does **${student.Name}** belong to?`;
  }

  if (!answer || wrongPool.length < 3) return null;
  return { question, answer, choices: shuffle([answer, ...wrongPool]) };
}

function buildTriviaEmbed(q, choices) {
  const labels = ['🇦', '🇧', '🇨', '🇩'];
  const choiceText = choices.map((c, i) => `${labels[i]} ${c}`).join('\n');
  return new EmbedBuilder()
    .setTitle('📚 Blue Archive Trivia')
    .setDescription(`**${q}**\n\n${choiceText}`)
    .setColor(0x8A2BE2)
    .setFooter({ text: 'Type A, B, C, or D to answer • 30 seconds' });
}

function getTriviaData() {
  let data = null;
  if (schaleStudents.length > 0 && Math.random() < 0.5) data = generateSchaleQuestion();
  if (!data) {
    const q = localTrivia[Math.floor(Math.random() * localTrivia.length)];
    data = { question: q.question, answer: q.answer, choices: shuffle([...q.choices]) };
  }
  return data;
}

async function runTrivia(channel, replyFn) {
  if (triviaSessions.has(channel.id)) {
    return replyFn("A trivia question is already active in this channel!");
  }

  const { question, answer, choices } = getTriviaData();
  const labels = ['a', 'b', 'c', 'd'];
  const answerLabel = labels[choices.indexOf(answer)];

  const embed = buildTriviaEmbed(question, choices);
  await replyFn({ embeds: [embed] });

  const filter = m => !m.author.bot && ['a', 'b', 'c', 'd'].includes(m.content.trim().toLowerCase());
  const collector = channel.createMessageCollector({ filter, time: 30000 });
  triviaSessions.set(channel.id, { answer });

  collector.on('collect', m => {
    if (m.content.trim().toLowerCase() === answerLabel) {
      collector.stop('correct');
      channel.send({ embeds: [new EmbedBuilder()
        .setTitle('✅ Correct!')
        .setDescription(`**${m.member?.displayName || m.author.username}** got it right!\nThe answer was: **${answer}**`)
        .setColor(0x57f287)] });
    } else {
      m.react('❌').catch(() => {});
    }
  });

  collector.on('end', (_, reason) => {
    triviaSessions.delete(channel.id);
    if (reason !== 'correct') {
      channel.send({ embeds: [new EmbedBuilder()
        .setTitle("⏰ Time's up!")
        .setDescription(`Nobody got it right.\nThe answer was: **${answer}**`)
        .setColor(0xed4245)] });
    }
  });
}

module.exports = { loadStudentData, runTrivia };
