const { EmbedBuilder } = require('discord.js');
const path = require('path');

const IMAGE_BASE   = path.join(__dirname, '..', 'images');
const INTERACT_PATH = path.join(IMAGE_BASE, "Plana Interactions");

const planaInteractions = {
  touch: {
    file: "Plana_Touch.png",
    basePath: path.join(IMAGE_BASE, "Plana Touch"),
    description: "(˶˃ ᵕ ˂˶) Sensei, be gentle.",
    footer: null
  },
  blush: {
    file: "blush.gif",
    basePath: INTERACT_PATH,
    description: "( ˘ ³˘)♥ P-Plana is not blushing, Sensei!",
    footer: null
  },
  kiss: {
    file: "Kiss.gif",
    basePath: INTERACT_PATH,
    description: "(˘ε˘) Sensei...!",
    footer: null
  },
  lick: {
    file: "Lick.gif",
    basePath: INTERACT_PATH,
    description: "S-Sensei, that's unsanitary! (〃＞＿＜;〃)",
    footer: null
  },
  spin: {
    file: "Spin.gif",
    basePath: INTERACT_PATH,
    description: "Wheee~! ٩(◕‿◕｡)۶",
    footer: null
  },
  pat: {
    file: "pat.png",
    basePath: INTERACT_PATH,
    description: "(˶˃ ᵕ ˂˶) ...Thank you, Sensei.",
    footer: "Art: Kuro-Tofu"
  },
  stop: {
    file: "Stopping-someone.gif",
    basePath: INTERACT_PATH,
    description: "S-Stop right there, Sensei! (╬ Ò﹏Ó)",
    footer: null
  },
  pinch: {
    file: "Cheek-pinch.gif",
    basePath: INTERACT_PATH,
    description: "S-Sensei! My cheeks are not for pinching! (〃＞﹏＜)",
    footer: null
  },
  cry: {
    file: "cry.gif",
    basePath: INTERACT_PATH,
    description: "...Sensei made Plana cry. (╥﹏╥)",
    footer: null
  }
};

async function sendPlanaInteraction(target, action) {
  const data = planaInteractions[action];
  if (!data) return null;
  const filePath = path.join(data.basePath, data.file);
  const embed = new EmbedBuilder()
    .setDescription(data.description)
    .setImage(`attachment://${data.file}`)
    .setColor(0x8A2BE2);
  if (data.footer) embed.setFooter({ text: data.footer });
  return target.send({ embeds: [embed], files: [filePath] });
}

// 🎱 8BALL
const eightBallResponses = {
  positive: [
    "The data is clear, Sensei. Yes.",
    "Affirmative. Plana has calculated a high probability of success.",
    "...It seems so. Don't make me repeat myself.",
    "The answer is yes. You're welcome, Sensei.",
    "Plana's analysis confirms it. Proceed."
  ],
  uncertain: [
    "...The variables are unclear. Ask again, Sensei.",
    "Plana cannot determine this with current data.",
    "Insufficient information. Please refine your query.",
    "The probability is... inconclusive.",
    "...Plana needs more time to calculate this."
  ],
  negative: [
    "No. And Plana suggests you reconsider entirely.",
    "Negative. Don't look at Plana like that.",
    "The answer is no, Sensei. Accept it.",
    "Plana's calculations say no. Firmly.",
    "...No. Please don't ask again."
  ]
};

function get8BallAnswer() {
  const rand = Math.random();
  let pool;
  if (rand < 0.4)      pool = eightBallResponses.positive;
  else if (rand < 0.6) pool = eightBallResponses.uncertain;
  else                 pool = eightBallResponses.negative;
  return pool[Math.floor(Math.random() * pool.length)];
}

function build8BallEmbed(question) {
  return new EmbedBuilder()
    .setTitle("🎱 Plana's 8-Ball")
    .addFields(
      { name: "Question", value: question },
      { name: "Plana says...", value: get8BallAnswer() }
    )
    .setColor(0x8A2BE2);
}

module.exports = { planaInteractions, sendPlanaInteraction, get8BallAnswer, build8BallEmbed };
