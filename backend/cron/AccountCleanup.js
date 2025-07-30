import cron from 'node-cron';
import UserModel from '../models/User.js';


const startUnverifiedAccountCleanup = () => {

  cron.schedule('0 0 * * *', async () => {
    console.log('--- Running unverified account cleanup job ---');

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      // Find and delete users who are not verified and were created more than 24 hours ago
      const result = await UserModel.deleteMany({
        isAccountVerified: false,
        createdAt: { $lt: twentyFourHoursAgo } // $lt means "less than" (older than)
      });

      console.log(`Cleanup complete: ${result.deletedCount} unverified accounts deleted.`);
    } catch (error) {
      console.error('Error during unverified account cleanup:', error);
    }
  }, {
    timezone: "Asia/Colombo" // Specify timezone (e.g., "Asia/Colombo", "America/New_York", or "Etc/UTC")
  });

  console.log('Unverified account cleanup job scheduled to run daily at midnight UTC.');
};

export default startUnverifiedAccountCleanup;
