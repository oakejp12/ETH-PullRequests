/**
 * This file offers a set of routes for sending users to the various HTML landing pages
 */
import path from 'path';

module.exports = function(app) {

  app.get("/", (req, res) => {
    console.log("Hitting the index path...");
    res.sendFile(path.join(__dirname, "../src/index.html"));
  });
};