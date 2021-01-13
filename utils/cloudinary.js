const cloudinary = require('cloudinary');

// dotenv.config();
cloudinary.config({
  cloud_name: 'tweneboah',
  api_key: '986451386744613',
  api_secret: 'GiusV0bSLrMqioANgP3H0j0dAL0',
});

const cloudinaryUploadImage = (fileToUpload, folderToStoreOnCloudinary) => {
  //We want to return a promise so that we consume it inside our route
  return new Promise(resolve => {
    //upload to cloudinary
    cloudinary.uploader.upload(
      fileToUpload,
      result => {
        resolve({
          url: result.url,
          public_id: result.public_id,
        });
      },

      {
        resource_type: 'auto',
        folder: folderToStoreOnCloudinary,

        height: 452,

        width: 448,
        crop: 'pad',
        sign_url: true,
      }
    );
  });
};

module.exports = { cloudinaryUploadImage };
