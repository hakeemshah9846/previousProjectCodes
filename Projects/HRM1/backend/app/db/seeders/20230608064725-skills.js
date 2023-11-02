"use strict";

module.exports = {
  up: (models, mongoose) => {
    return models.skills
      .insertMany([
        {
          _id: "64817a0bb65a951b9d985444",
          skill: "JavaScript",
        },
        {
          _id: "64817a28b65a951b9d985445",
          skill: "Node.js",
        },
        {
          _id: "64817a35b65a951b9d985446",
          skill: "React",
        },
        {
          _id: "64817a41b65a951b9d985447",
          skill: "Angular",
        },
        {
          _id: "64818789b65a951b9d985448",
          skill: "Express.js",
        },
        {
          _id: "648187a5b65a951b9d985449",
          skill: "PHP",
        },
        {
          _id: "648187bfb65a951b9d98544a",
          skill: "Laravel",
        },
        {
          _id: "648187dcb65a951b9d98544b",
          skill: "Vue.js",
        },
      ])
      .then((res) => {
        // Prints "1"
        console.log(res.insertedCount);
      });
  },

  down: (models, mongoose) => {
    return models.skills
      .deleteMany({
        _id: {
          $in: [
            "64817a0bb65a951b9d985444",
            "64817a28b65a951b9d985445",
            "64817a35b65a951b9d985446",
            "64817a41b65a951b9d985447",
            "64818789b65a951b9d985448",
            "648187a5b65a951b9d985449",
            "648187bfb65a951b9d98544a",
            "648187dcb65a951b9d98544b",
          ],
        },
      })
      .then((res) => {
        // Prints "1"
        console.log(res.deletedCount);
      });
  },
};
