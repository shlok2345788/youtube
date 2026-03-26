import users from "../models/user";

export const login = async (req, res) => {
  const { username, email, image } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      try {
        const newUser = await users.create({ username, email, image });
        res.status(200).json({ result: newUser });
      } catch (err) {
        console.log(`Error Occured : ${err}`);
        return;
      }
    } else {
      // User exists, return the existing user
      res.status(200).json({ result: existingUser });
    }
  } catch (err) {
    res.status(500).send("Error occurred");
    return;
  }
};

export const createChannel = async (req, res) => {
  const { userId, channelName } = req.body;
  try {
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { channelname: channelName },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ result: updatedUser });
  } catch (err) {
    console.log(`Error Occurred: ${err}`);
    res.status(500).json({ message: "Error occurred while creating channel" });
  }
};
