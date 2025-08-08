const { sendNotification } = require('../../services/firebase.service');

exports.registerToken = async (req, res) => {
  const { userId, token } = req.body;
  // Store token in DB (e.g., User model)
  // await User.update({ fcmToken: token }, { where: { id: userId } });
  res.json({ success: true });
};

exports.sendTestNotification = async (req, res) => {
  const { fcmToken } = req.body;

  await sendNotification(fcmToken, {
    title: '🚀 Test Notification',
    body: 'This is a test push message',
  });

  res.json({ success: true });
};
