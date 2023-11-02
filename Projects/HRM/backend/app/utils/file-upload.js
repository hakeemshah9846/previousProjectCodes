const dayjs = require("dayjs");
var fs = require("fs");

exports.fileUpload = async function (file, directory) {
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        let mime_type = file.split(";")[0].split(":")[1].split("/")[1];

        //file size upto 100mb
        if (
          mime_type == "mp4" ||
          mime_type == "png" ||
          mime_type == "jpg" ||
          mime_type == "jpeg" ||
          mime_type == "pdf"
        ) {
          let file_name =
            dayjs() + String(Math.floor(Math.random() * 100)) + "." + mime_type;
          let upload_path = `uploads/${directory}`;

          let base64File = file.split(";base64,").pop();
          fs.mkdir(upload_path, { recursive: true }, (err) => {
            if (err) {
              reject(err);
            } else {
              upload_path = `uploads/${directory}/${file_name}`;
              fs.writeFile(
                upload_path,
                base64File,
                { encoding: "base64" },
                function (err) {
                  if (err) reject(err);
                  resolve(upload_path);
                }
              );
            }
          });
        } else {
          reject(
            "File size upto 100 MB and Formats .mp4, .png, .jpg, .jpeg, .pdf are only allowed"
          );
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

//comments
