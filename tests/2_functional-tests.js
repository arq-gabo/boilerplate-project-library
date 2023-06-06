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
  this.timeout(5000);

  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
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
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  let bookIdTemp;

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "test",
              comments: [],
            })
            .end(function (err, res) {
              bookIdTemp = res.body._id;
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.equal(res.body.title, "test");
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "",
              comments: [],
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, "text/html");
              assert.equal(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isArray(res.body, "the answer must be an array");
            assert.isAtLeast(res.body.length, 1);
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/theIdNotExist")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books/" + bookIdTemp)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.typeOf(res.body, "object");
            assert.isArray(res.body.comments);
            assert.equal(res.body.title, "test");
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post("/api/books/" + bookIdTemp)
            .send({
              comment: "comment test",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.typeOf(res.body, "object");
              assert.isArray(res.body.comments);
              assert.equal(res.body.comments[0], "comment test");

              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post("/api/books/" + bookIdTemp)
            .send({
              comment: "",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, "text/html");
              assert.equal(res.text, "missing required field comment");

              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post("/api/books/idBookNotExist")
            .send({
              comment: "test",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, "text/html");
              assert.equal(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/" + bookIdTemp)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/" + bookIdTemp)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
