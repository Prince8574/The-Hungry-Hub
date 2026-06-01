require('dotenv').config();
const mongoose = require('mongoose');
require('./models/User');
require('./models/Order');
const Order = require('./models/Order');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const orders = await Order.find({
    status: { $in: ['confirmed', 'preparing', 'out_for_delivery'] }
  }).populate('user', 'name phone email').limit(5);

  console.log('Orders with delivery status:', orders.length);
  orders.forEach(o => console.log(`  - ${o._id.toString().slice(-6)} | ${o.status} | ${o.user?.name}`));

  // Also check all orders
  const all = await Order.find().select('status');
  console.log('\nAll order statuses:');
  const counts = {};
  all.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
  console.log(counts);

  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
