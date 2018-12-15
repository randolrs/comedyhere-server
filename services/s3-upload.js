const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

//configuring the AWS environment
AWS.config.update({
  secretAccessKey: process.env.AWS_KEY_SECRET,
  accessKeyId: process.env.AWS_KEY_ID,
  region: 'us-west-2' // region of your bucket
});

var s3 = new AWS.S3();
var filePath = "./data/file.txt";

//configuring parameters

const s3Upload = (filepath) => {
  var params = {
    Bucket: 'us-west-2',
    Body : fs.createReadStream(filePath),
    Key : "folder/"+Date.now()+"_"+path.basename(filePath)
  };
  return s3.upload(params, function (err, data) {
    //handle error
    if (err) {
      console.log("Error", err);
      return err;
    }

    //success
    if (data) {
      console.log("Uploaded in:", data.Location);
      return data;
    }
  });
}

export default s3Upload;
