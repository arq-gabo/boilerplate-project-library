/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const BooksModel = require("../BooksModel");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BooksModel.find()
        .then((db) =>
          res.json(
            db.map((val) => {
              return {
                comments: val.comments,
                _id: val._id,
                title: val.title,
                commentcount: val.comments.length,
                __v: val.__v,
              };
            })
          )
        )
        .catch((e) => res.send(e));
    })

    .post(function (req, res) {
      let title = req.body.title;
      // response will contain new book object including atleast _id and title

      BooksModel.findOne({ title })
        .then((db) => {
          if (!db) {
            new BooksModel({ title, comments: [] })
              .save()
              .then((db) => res.json({ _id: db._id, title: db.title }))
              .catch((e) => res.send("missing required field title"));
          } else {
            res.json({ _id: db._id, title: db.title });
          }
        })
        .catch((e) => res.send(e));
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      BooksModel.deleteMany({}).then((db) => {
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BooksModel.findById(bookid)
        .then((db) =>
          res.json({
            comments: db.comments,
            _id: db._id,
            title: db.title,
            commentcount: db.comments.length,
            __v: db.__v,
          })
        )
        .catch((e) => res.send("no book exists"));
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (comment !== "") {
        BooksModel.findByIdAndUpdate(bookid, {
          $push: { comments: comment },
          $inc: { __v: 1 },
        })
          .then((db) =>
            res.json({
              comments: [...db.comments, comment],
              _id: db._id,
              title: db.title,
              commentcount: db.comments.length + 1,
              __v: db.__v + 1,
            })
          )
          .catch((e) => res.send("no book exists"));
      } else {
        res.send("missing required field comment");
      }

      // if (comment !== "") {
      //   BooksModel.findById(bookid)
      //     .then((book) => {
      //       let addComment = [...book.comments, comment];
      //       BooksModel.findByIdAndUpdate(bookid, {
      //         comments: addComment,
      //         __v: (book.__v += 1),
      //       })
      //         .then((db) => {
      //           res.json({
      //             comments: addComment,
      //             _id: db._id,
      //             title: db.title,
      //             commentcount: addComment.length,
      //             __v: book.__v,
      //           });
      //         })
      //         .catch((e) => res.send(e));
      //     })
      //     .catch((e) => {
      //       res.send("no book exists");
      //     });
      // } else {
      //   res.send("missing required field comment");
      // }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      BooksModel.findByIdAndRemove(bookid)
        .then((db) => {
          if (!db) {
            res.send("no book exists");
          } else {
            res.send("delete successful");
          }
        })
        .catch((e) => res.send("Not valid _id"));
    });
};
