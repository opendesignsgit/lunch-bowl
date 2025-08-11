const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const sendNotification = async (fcmToken, notification) => {
  const message = {
    token: fcmToken,
    notification,
  };

  try {
    await admin.messaging().send(message);
    console.log('✅ Notification sent successfully');
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    throw error;
  }
};

module.exports = { sendNotification };
