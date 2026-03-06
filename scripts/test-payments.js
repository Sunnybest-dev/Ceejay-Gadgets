require('dotenv').config();

const axios = require('axios');
const { sequelize } = require('../src/config/db');
const User = require('../src/models/User');
const Order = require('../src/models/Order');
const generateToken = require('../src/utils/generateToken');

async function main() {
  await sequelize.authenticate();

  // create or find test user
  const email = 'auto-test@example.com';
  let user = await User.findOne({ where: { email } });
  if (!user) {
    user = await User.create({ name: 'Auto Test', email, password: 'password' });
    console.log('Created user', user.id);
  } else {
    console.log('Found user', user.id);
  }

  // create order
  const order = await Order.create({ userId: user.id, totalAmount: 150.5, status: 'pending' });
  console.log('Created order', order.id);

  const token = generateToken(user);

  try {
    const resp = await axios.post('http://localhost:5000/api/payments/initialize', { orderId: order.id }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Payment initialize response status:', resp.status);
    console.log(JSON.stringify(resp.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('Request failed:', err.response.status, err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
  } finally {
    process.exit(0);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
