const Feedback = require("../Models/feedback.model.js");

const postfeedback = async (req, res) => {
  try {
    const { username, subject, message } = req.body;
    const newFeedback = await Feedback.create({
      username,
      subject,
      message,
    });
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getfeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("username", "username email profilePicture")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { postfeedback, getfeedback, updateFeedbackStatus };
