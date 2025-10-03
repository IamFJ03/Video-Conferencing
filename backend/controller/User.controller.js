import { Person } from "../model/User.controller.js";

const SaveUser = async (req, res) => {
    const { fullname, nickname, gender, country, language, contact } = req.body;

  console.log('Full Name:', fullname);
  console.log('Nick Name:', nickname);
  console.log('Gender:', gender);
  console.log('Country:', country);
  console.log('Language:', language);
  console.log('Contact:', contact);
  console.log("User:",req.user)
}

export{SaveUser}