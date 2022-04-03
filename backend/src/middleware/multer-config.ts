import * as multer from "multer";

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.').join('_');
        const extension = MIME_TYPES[file.mimetype];
        if(file.mimetype in MIME_TYPES){
            callback(null, name + Date.now() + '.' + extension);
        }
    }
});

module.exports = multer({ storage }).single('image');