import path from "path";

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/public/avatars");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${Date.now()}-${Math.floor(Math.random() * 100000)}-${file.originalname}`
        );
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 1048576 * 5 },
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
            return cb(new Error("Only JPG, JPEG, or PNG files are allowed"));
        }
        cb(null, true);
    },
}).single('avatar');