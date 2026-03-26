import users from "../models/user";

const login = async (req, res) => {
  const { username, email, image } = req.body;

  const existingUser = await users.findOne({ email });
  if (!existingUser) {
    try {
      const newUser = await users.create({ username, email, image });
      res.status(200).
    } catch (err) {
      console.log(`Error Occured : ${err}`);
    }
  }
};
