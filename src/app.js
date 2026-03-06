const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(morgan("dev"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/lucky-draw", require("./routes/luckyDraw.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/webhook", require("./routes/webhook.routes"));
app.use("/api/lucky-draw", require("./routes/luckyDraw.routes"));

app.use(errorHandler);

module.exports = app;