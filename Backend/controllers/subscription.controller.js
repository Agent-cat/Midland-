const User = require("../Models/user.model");

const createSubscription = async (req, res) => {
  try {
    const { userId, plan } = req.body;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        subscription: {
          plan,
          startDate,
          endDate,
          status: "active",
        },
      },
      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).json(user.subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        "subscription.status": "cancelled",
      },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubscription,
  getSubscriptionStatus,
  cancelSubscription,
};
