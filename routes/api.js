/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
//const mongoose = require("mongoose");
const book = require("../models").book;

module.exports = function (app) {
    app.route("/api/books")
        .get(function (req, res) {
            //response will be array of book objects
            //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
            book.find((err, books) => {
                if (err) throw err;
                res.json(books);
            });
        })

        .post(function (req, res) {
            let title = req.body.title;
            //response will contain new book object including atleast _id and title
            let newBook = new book({
                title: title,
            });

            newBook.save((err, doc) => {
                if (err) return res.send("missing required field title");
                res.send({
                    _id: doc._id,
                    title: doc.title,
                });
            });
        })

        .delete(function (req, res) {
            //if successful response will be 'complete delete successful'
            book.deleteMany({})
                .then((result) => res.send("complete delete successful"))
                .catch((err) =>
                    console.error(`Delete failed with error: ${err}`)
                );
        });

    app.route("/api/books/:id")
        .get(function (req, res) {
            let bookid = req.params.id;
            //console.log(bookid);
            //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
            //let oneBook = mongoose.model(bookid, bookSchema);
            book.countDocuments({ _id: bookid }, function (err, count) {
                if (count > 0) {
                    book.find({ _id: bookid }, (err, foundBook) => {
                        if (err) throw err;
                        if (foundBook.length === 0) res.send("no book exists");
                        //console.log(foundBook);
                        res.json(foundBook);
                    });
                } else {
                    res.send("no book exists");
                }
            });
        })

        .post(function (req, res) {
            let bookid = req.params.id;
            let comment = req.body.comment;
            if (!comment) return res.send("missing required field comment");
            book.countDocuments({ _id: bookid }, function (err, count) {
                if (count > 0) {
                    book.findByIdAndUpdate(
                        { _id: bookid },
                        {
                            $push: { comments: comment },
                            $inc: { commentcount: 1 },
                        },
                        { new: true },
                        (err, updatedDoc) => {
                            if (err) throw err;
                            res.json(updatedDoc);
                        }
                    );
                } else {
                    res.send("no book exists");
                }
            });
            //json res format same as .get
        })

        .delete(function (req, res) {
            let bookid = req.params.id;
            //if successful response will be 'delete successful'
            book.countDocuments({ _id: bookid }, function (err, count) {
                if (count > 0) {
                    book.findByIdAndRemove(bookid, (err, removedDoc) => {
                        if (err) throw err;
                        res.send("delete successful");
                    });
                } else {
                    return res.send("no book exists");
                }
            });
        });
};
