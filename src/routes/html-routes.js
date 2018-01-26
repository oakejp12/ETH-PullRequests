/**
 * This file offers a set of routes for sending users to the various HTML landing pages
 */
import path from 'path';

module.exports = function(app) {

  app.get("/api/", (req, res) => {
    console.log("Hitting the index path...");
    res.send({ express: 'Hello From Express' });
  });
};