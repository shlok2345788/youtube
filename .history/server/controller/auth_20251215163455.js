import users from "../models/user";

const login = async (req, res) => {
  const { username, email, image } = req.body;

  const existingUser = await users.findOne({ email });
  if(!existingUser){
    try{

    }catch(err){
        console.log(``)
    }
  }
};
