const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[GoTaskManager DB Warning] MONGODB_URI is not defined in server environment.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[GoTaskManager DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`[GoTaskManager DB Error] Failed to connect to MongoDB: ${error.message}`);
    return false;
  }
};

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('[GoTaskManager DB] Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error(`[GoTaskManager DB] Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('[GoTaskManager DB] Mongoose disconnected from database');
});

const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  connectDB,
  isDBConnected,
  mongoose,
};
