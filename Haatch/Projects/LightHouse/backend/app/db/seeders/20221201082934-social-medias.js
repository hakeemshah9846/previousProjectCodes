"use strict";

module.exports = {
  up: (models, mongoose) => {
    return (
      models.social_medias.insertMany([
          {
            _id: "6363bba02ff1ca41d9a43d8c",
            title: "Rutube",
            icon: "assets/social_medias/icons/rutube.png",
          },
          {
            _id: "6380c37516af315ba265f682",
            title: "VK",
            icon: "assets/social_medias/icons/vk.png",
          },
          {
            _id: "6380c38e16af315ba265f684",
            title: "Yandex Zen",
            icon: "assets/social_medias/icons/yandex-zen.png",
          },
          {
            _id: "6380c3a416af315ba265f686",
            title: "Telegram",
            icon: "assets/social_medias/icons/telegram.png",
          },
        ])
        .then((res) => {
          console.log(`Seeding Successful`);
        })
    );
  },

  down: (models, mongoose) => {
    return models.social_medias.deleteMany({}).then((res) => {
      console.log(`Rollback Successful`);
    });
  }
};
