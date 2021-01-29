const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: { type: String, required: true },
    comments: { type: Array },
    commentcount: { type: Number, default: 0 },
});

const book = mongoose.model("library", bookSchema);

exports.book = book;
