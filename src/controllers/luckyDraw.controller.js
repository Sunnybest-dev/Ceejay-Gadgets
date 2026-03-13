const LuckyDrawRound = require("../models/LuckyDrawRound");
const LuckyDrawEntry = require("../models/LuckyDrawEntry");
const User = require("../models/User");


// Admin creates new lucky draw
exports.createRound = async (req, res, next) => {
  try {

    const { title, ticketPrice, maxTickets, drawDate } = req.body;

    const round = await LuckyDrawRound.create({
      title,
      ticketPrice,
      maxTickets,
      drawDate,
      status: "open"
    });

    res.status(201).json({
      message: "Lucky draw round created",
      round
    });

  } catch (err) {
    next(err);
  }
};



// Get all rounds
exports.getRounds = async (req, res, next) => {
  try {

    const rounds = await LuckyDrawRound.findAll();

    res.json(rounds);

  } catch (err) {
    next(err);
  }
};



// Buy lucky draw ticket
exports.buyTicket = async (req, res, next) => {
  try {

    const { roundId } = req.body;

    const round = await LuckyDrawRound.findByPk(roundId);

    if (!round) {
      return res.status(404).json({
        message: "Round not found"
      });
    }

    if (round.status !== "open") {
      return res.status(400).json({
        message: "Lucky draw closed"
      });
    }

    const entriesCount = await LuckyDrawEntry.count({
      where: { luckyDrawRoundId: round.id }
    });

    if (entriesCount >= round.maxTickets) {
      return res.status(400).json({
        message: "Tickets sold out"
      });
    }

    // Generate ticket number
    const ticketNumber = entriesCount + 1;

    const entry = await LuckyDrawEntry.create({
      userId: req.user.id,
      luckyDrawRoundId: round.id,
      ticketNumber
    });

    res.status(201).json({
      message: "Ticket purchased",
      entry
    });

  } catch (err) {
    next(err);
  }
};



// Draw winner (Admin)
exports.drawWinner = async (req, res, next) => {
  try {

    const { roundId } = req.params;

    const entries = await LuckyDrawEntry.findAll({
      where: { luckyDrawRoundId: roundId },
      include: [User]
    });

    if (entries.length === 0) {
      return res.status(400).json({
        message: "No participants"
      });
    }

    const randomIndex = Math.floor(Math.random() * entries.length);

    const winner = entries[randomIndex];

    await LuckyDrawRound.update(
      { status: "completed", winnerId: winner.userId },
      { where: { id: roundId } }
    );

    res.json({
      message: "Winner selected",
      winner
    });

  } catch (err) {
    next(err);
  }
};



// Get user winning probability
exports.getProbability = async (req, res, next) => {
  try {

    const { roundId } = req.params;

    const totalTickets = await LuckyDrawEntry.count({
      where: { luckyDrawRoundId: roundId }
    });

    const userTickets = await LuckyDrawEntry.count({
      where: {
        luckyDrawRoundId: roundId,
        userId: req.user.id
      }
    });

    if (totalTickets === 0) {
      return res.json({
        userTickets: 0,
        totalTickets: 0,
        probability: "0%"
      });
    }

    const probability = (userTickets / totalTickets) * 100;

    res.json({
      userTickets,
      totalTickets,
      probability: probability.toFixed(2) + "%"
    });

  } catch (err) {
    next(err);
  }
};