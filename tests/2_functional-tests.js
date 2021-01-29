/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
    /*
     * ----[EXAMPLE TEST]----
     * Each test should completely test the response of the API end-point including response status code!
     */
    /* test("#example Test GET /api/books", function (done) {
        chai.request(server)
            .get("/api/books")
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body, "response should be an array");
                assert.property(
                    res.body[0],
                    "commentcount",
                    "Books in array should contain commentcount"
                );
                assert.property(
                    res.body[0],
                    "title",
                    "Books in array should contain title"
                );
                assert.property(
                    res.body[0],
                    "_id",
                    "Books in array should contain _id"
                );
                done();
            });
    }); */
    /*
     * ----[END of EXAMPLE TEST]----
     */
    let newID;

    suite("Routing tests", function () {
        suite(
            "POST /api/books with title => create book object/expect book object",
            function () {
                test("Test POST /api/books with title", function (done) {
                    chai.request(server)
                        .post("/api/books")
                        .send({ title: "Biblia" })
                        .end(function (err, res) {
                            // console.log(res.body);
                            newID = res.body._id;
                            assert.equal(res.status, 200);
                            assert.equal(res.body.title, "Biblia");
                            done();
                        });
                });

                test("Test POST /api/books with no title given", function (done) {
                    chai.request(server)
                        .post("/api/books")
                        .send({ title: "" })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            //console.log(res.text);
                            assert.equal(
                                res.text,
                                "missing required field title"
                            );
                            done();
                        });
                });
            }
        );

        suite("GET /api/books => array of books", function () {
            test("Test GET /api/books", function (done) {
                chai.request(server)
                    .get("/api/books")
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body, "response should be an array");
                        done();
                    });
            });
        });

        suite("GET /api/books/[id] => book object with [id]", function () {
            test("Test GET /api/books/[id] with id not in db", function (done) {
                chai.request(server)
                    .get("/api/books/:id")
                    .query({ _id: "600be666f488421f10f71291" })
                    .end(function (err, res) {
                        //console.log(res.text);
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "no book exists");
                        done();
                    });
            });

            test("Test GET /api/books/[id] with valid id in db", function (done) {
                chai.request(server)
                    .get(`/api/books/${newID}`)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        //console.log(res.body[0]);
                        assert.property(
                            res.body[0],
                            "title",
                            "Book should contain title"
                        );
                        assert.property(
                            res.body[0],
                            "_id",
                            "Book should contain _id"
                        );
                        assert.isArray(
                            res.body[0].comments,
                            "Book should contain comments array"
                        );
                        done();
                    });
            });
        });

        suite(
            "POST /api/books/[id] => add comment/expect book object with id",
            function () {
                test("Test POST /api/books/[id] with comment", function (done) {
                    chai.request(server)
                        .post(`/api/books/${newID}`)
                        .send({
                            _id: newID,
                            comment: "szöveg",
                        })
                        .end(function (err, res) {
                            //console.log(res.body);
                            assert.equal(res.status, 200);
                            assert.equal(res.body._id, newID);
                            assert.property(
                                res.body,
                                "title",
                                "Book should contain title"
                            );
                            assert.isArray(
                                res.body.comments,
                                "Book should contain comments array"
                            );
                            done();
                        });
                });

                test("Test POST /api/books/[id] without comment field", function (done) {
                    chai.request(server)
                        .post(`/api/books/${newID}`)
                        .send({
                            _id: newID,
                            comment: "",
                        })
                        .end(function (err, res) {
                            //console.log(res.body);
                            assert.equal(res.status, 200);
                            assert.equal(
                                res.text,
                                "missing required field comment"
                            );
                            done();
                        });
                });

                test("Test POST /api/books/[id] with comment, id not in db", function (done) {
                    chai.request(server)
                        .post("/api/books/600be666f488421f10f71291")
                        .send({
                            _id: "600be666f488421f10f71291",
                            comment: "new comment",
                        })
                        .end(function (err, res) {
                            //console.log(res.body);
                            assert.equal(res.status, 200);
                            assert.equal(res.text, "no book exists");
                            done();
                        });
                });
            }
        );

        suite("DELETE /api/books/[id] => delete book object id", function () {
            test("Test DELETE /api/books/[id] with valid id in db", function (done) {
                chai.request(server)
                    .delete(`/api/books/${newID}`)
                    .send({ _id: newID })
                    .end(function (err, res) {
                        if (err) throw err;
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "delete successful");
                        done();
                    });
            });

            test("Test DELETE /api/books/[id] with  id not in db", function (done) {
                chai.request(server)
                    .delete("/api/books/600be666f488421f10f71291")
                    .send({ _id: "600be666f488421f10f71291" })
                    .end(function (err, res) {
                        if (err) throw err;
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "no book exists");
                        done();
                    });
            });
        });
    });
});
