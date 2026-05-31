const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@hungry.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.isVerified = true;
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      }
    } else {
      // Create new admin user
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@hungry.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true,
      });
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@hungry.com');
      console.log('🔑 Password: admin123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdminUser();
