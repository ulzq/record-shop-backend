var faker = require("faker");
const mongoose = require("mongoose");
const User = require("../models/User");
const Record = require("../models/Record");

console.log("I shall seed");

( async function() {
  /**CONNECT TO DB */
  mongoose.connect("mongodb://localhost:27017/record-shop", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on("error", console.error);
  mongoose.connection.on("open", function() {
    console.log("Database connection established...");
  });

  console.log("I will purge all the old users...");

  try {
    await User.deleteMany({});
    console.log("Users purged");
  } catch (err) {
    console.error(err);
  }

  const userPromises = Array(10)
    .fill(null)
    .map(() => {
      const user = new User({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      });

      return user.save();
    });

  try {
    await Promise.all(userPromises);
    console.log("Users seeded");
  } catch (e) {
    console.error(e);
  }

  // Records

  console.log("I will purge all the old records...");

  try {
    await Record.deleteMany({});
    console.log("Records purged");
  } catch (err) {
    console.error(err);
  }

  const recordPromises = Array(10)
    .fill(null)
    .map(() => {
      const record = new Record({
        title:  faker.name.firstName(),
        artist: faker.name.lastName(),
        year:   faker.random.number(),
        img:    faker.random.image(),
        price:  faker.commerce.price()
      });
      return record.save();
    });

  try {
    await Promise.all(recordPromises);
    console.log("Records seeded");
  } catch (e) {
    console.error(e);
  }
  try {
    mongoose.connection.close();
  }
  catch(e){
  }
})();
