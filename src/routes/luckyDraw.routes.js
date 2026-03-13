const express = require("express");
const router = express.Router();

const luckyDrawController = require("../controllers/luckyDraw.controller");
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");


// Admin create round
router.post("/round", auth, admin, luckyDrawController.createRound);

// Get rounds
router.get("/rounds", luckyDrawController.getRounds);

// Buy ticket
router.post("/buy", auth, luckyDrawController.buyTicket);

// Draw winner
router.post("/draw/:roundId", auth, admin, luckyDrawController.drawWinner);

// Get probability
router.get("/probability/:roundId", auth, luckyDrawController.getProbability);


module.exports = router;