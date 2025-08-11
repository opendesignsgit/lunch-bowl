// const { sendNotification } = require('../../services/firebase.service');

// exports.registerToken = async (req, res) => {
//   const { userId, token } = req.body;
//   // Store token in DB (e.g., User model)
//   // await User.update({ fcmToken: token }, { where: { id: userId } });
//   res.json({ success: true });
// };

// exports.sendTestNotification = async (req, res) => {
//   const { fcmToken } = req.body; 

//   await sendNotification(fcmToken, {
//     title: '🚀 Test Notification',
//     body: 'This is a test push message backend ',
//   });

//   res.json({ success: true });
// };


const FcmToken = require('../../models/MobileModel/fcm.model');
const { sendNotification } = require('../../services/firebase.service');

exports.registerToken = async (req, res) => {
  const { userId, token, device } = req.body;

  try {
    const existing = await FcmToken.findOne({ token });

    if (!existing) {
      await FcmToken.create({ userId, token, device });
    }

    res.json({ success: true, message: 'Token registered successfully' });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.sendTestNotification = async (req, res) => {
  const { fcmToken } = req.body;

  try {
    await sendNotification(fcmToken, {
      title: '🚀 Test Notification',
      body: 'This is a test push message from backend.',
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ success: false });
  }
};
