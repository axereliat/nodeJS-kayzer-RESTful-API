const cloudinary = require('cloudinary');
const fs = require('fs');

module.exports = (fileName, mimeTypes) => (
    (req, res, next) => {
        if (!req.files || req.files === null || !req.files[fileName] || req.files[fileName] === null) {
            return next();
        }

        // validation
        const mimetype = req.files[fileName].mimetype;
        if (mimeTypes.indexOf(mimetype) === -1) {
            return res.status(400).json({
                message: 'Only the following formats are supported: ' + mimeTypes.join(', ')
            }).end();
        }

        /*var dir = './tmp';

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }*/

        // uploading locally on the server
        req.files[fileName].mv('uploads/' + req.files[fileName].name, (err) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }
        });

        // uploading to cloudinary
        cloudinary.uploader.upload('uploads/' + req.files[fileName].name, (result) => {
            // deleting the file from the server
            fs.unlink('uploads/' + req.files[fileName].name, err => {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }

                req[fileName + 'Url'] = result.secure_url;
                next();
            });
        });
    }
);
