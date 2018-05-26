//note: with babel-node for es6, use the below mocha command:
//mocha --compilers js:babel-core/register/*  */

//can also user assert, and should
var expect = require('chai').expect;
// var rewire = require('rewire');
// var sinon = require('sinon');
var util = require('util');
var request = require('supertest');
// var cheerio = require('cheerio');
var app = require('../app');

const PAGE_TITLE = "Welcome to the Hanoi FCC Blog!";
describe("Blog App", function () {

  it("GETS blog-api Posts", function (done) {
    this.timeout(4000)
    request(app)
      .get("/api/posts/")
      //can invoke a callback function inside the end function within supertest to check values
      .expect(200).end((err, res) => {
        let terms = JSON.parse(res.text);
        util.log(terms);
        this.postID = terms.data[0]._id;
        util.log(terms);
        util.log(this.postID);

        done();
      });
  });
  //use the stored postID to get comments


  it("GETS blog-api Comments", function (done) {
    this.timeout(4000);
    request(app)
      .get(`/api/comments/?post_id=${this.postID}`)
      //can invoke a callback function inside the end function within supertest to check values
      .expect(200).end((err, res) => {
        let terms = JSON.parse(res.text);
        util.log(terms);
        this.userID = terms[0].authorID;
        util.log(this.userID);
        done();
      });
  });

  it("GETS users", function (done) {
    this.timeout(4000);
    request(app)
      .get(`/api/users/`)
      //can invoke a callback function inside the end function within supertest to check values
      .expect(200).end((err, res) => {
        let terms = JSON.parse(res.text);
        util.log(terms);
        // this.userID = terms[0].authorID;
        // util.log(this.userID);
        done();
      });
  });


});