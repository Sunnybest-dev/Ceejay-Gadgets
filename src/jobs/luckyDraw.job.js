const cron = require("node-cron");
const LuckyDrawRound = require("../models/LuckyDrawRound");
const LuckyDrawEntry = require("../models/LuckyDrawEntry");

cron.schedule("0 * * * *", async () => {

  const rounds = await LuckyDrawRound.findAll({
    where: { status: "open" }
  });

  const now = new Date();

  for (const round of rounds) {

    if (new Date(round.drawDate) <= now) {

      const entries = await LuckyDrawEntry.findAll({
        where: { luckyDrawRoundId: round.id }
      });

      if (entries.length === 0) continue;

      const randomIndex = Math.floor(Math.random() * entries.length);

      const winner = entries[randomIndex];

      await round.update({
        status: "completed",
        winnerId: winner.userId
      });

      console.log("Winner selected for round", round.id);

    }

  }

});