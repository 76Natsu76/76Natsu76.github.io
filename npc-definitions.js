// types of NPCs (will be expanded)
// npc-definitions.js

export const NPC_TEMPLATES = {
  villager: {
    namePool: ["Lysa", "Tarin", "Bram", "Elya", "Ronan", "Mira"],
    personalityPool: ["cheerful", "anxious", "stoic", "curious"],
    role: "civilian",
    dialogue: {
      idle: [
        "Lovely day, isn't it?",
        "I heard strange noises last night…",
        "The forest feels restless lately."
      ],
      crisis: [
        "We must stay strong.",
        "Is it safe outside?",
        "I hope the heroes arrive soon."
      ],
      bossAwakened: [
        "The ground trembled… something is coming.",
        "The elders say the signs are bad.",
        "Stay close. Danger is near."
      ],
      bossDefeated: [
        "You did it! We're saved!",
        "The village owes you everything.",
        "Peace returns… for now."
      ]
    }
  },

  hunter: {
    namePool: ["Kael", "Rissa", "Dorn", "Fenn"],
    personalityPool: ["pragmatic", "brave", "quiet"],
    role: "scout",
    dialogue: {
      idle: [
        "Tracks are fresh today.",
        "Game is scarce lately.",
        "The woods whisper warnings."
      ],
      crisis: [
        "Beasts are acting strange.",
        "I saw something unnatural out there.",
        "Stay sharp."
      ]
    }
  },

  blacksmith: {
    namePool: ["Garron", "Helka", "Torren"],
    personalityPool: ["gruff", "warm", "focused"],
    role: "craftsman",
    dialogue: {
      idle: [
        "Need repairs?",
        "Steel sings when the world is calm.",
        "Business is steady."
      ],
      bossDefeated: [
        "A victory worth forging a blade for!",
        "Heroes deserve the finest steel."
      ]
    }
  },

  royal_courtier: {
    name: "Royal Courtier",
    role: "courtier",
    personality: "formal",
    dialogue: {
      idle: [
        "The Crown watches over all.",
        "Royal matters are not for common ears."
      ],
      crisis: [
        "The realm trembles. The Crown must act."
      ],
      bossAwakened: [
        "A threat to the realm itself…"
      ],
      bossDefeated: [
        "The Crown acknowledges your valor."
      ],
      highReputation: [
        "Your deeds echo through the halls of power.",
        "The Crown speaks highly of you."
      ],
      royalQuestline: {
        intro: [
          "You are summoned by the Crown. Present yourself in the Throne Room."
        ],
        trial: [
          "Your trial awaits. The Crown judges all."
        ],
        oath: [
          "The Oath of the Crown is a sacred bond."
        ]
      }
    }
  }
};
