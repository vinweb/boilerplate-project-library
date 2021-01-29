const mongoose = require("mongoose");
//mongoose.Promise = global.Promise;
const db = mongoose
    .connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connected...");
    })
    .catch((err) => console.log(err));

module.exports = db;
