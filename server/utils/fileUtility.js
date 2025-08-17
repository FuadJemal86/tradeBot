const multer = require("multer");
const path = require("path");
const fs = require("fs");


const createDirectories = () => {
    const baseUploadDir = path.join(__dirname, "..", "upload");

    const directories = [
        path.join(baseUploadDir, "Images", "product"),
    ];

    directories.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    console.log("File filter called for:", file.originalname);
    console.log("File mimetype:", file.mimetype);

    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    console.log("File validation result:", { extname, mimetype });

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error("Only images (jpg, jpeg, png) and PDFs are allowed"));
};

// product image upload middleware
const uploadProductImage = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            console.log("Processing product upload");
            const uploadPath = path.join(
                __dirname,
                "..",
                "upload",
                "Images",
                "product",
                "image"
            );
            if (!fs.existsSync(uploadPath)) {
                console.log("Creating product image directory:", uploadPath);
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            console.log(
                "Generating filename for product image:",
                file.originalname
            );
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const sanitizedOriginalname = file.originalname.replace(
                /[^a-zA-Z0-9.]/g,
                "_"
            );
            const finalFilename = uniqueSuffix + "-" + sanitizedOriginalname;
            console.log("Generated filename for product image:", finalFilename);
            cb(null, finalFilename);
        },
    }),
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
}).fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }, { name: "image4" }])



// Modify the middleware to store the full path
const uploadProductImageMiddleware = (req, res, next) => {
    uploadProductImage(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (req.files && req.files.length > 0) {
            // store paths for each uploaded file
            req.filePaths = req.files.map(file =>
                path.join("upload", "Images", "product", "image", file.filename)
                    .split(path.sep).join("/") // normalize slashes
            );
        }

        next();
    });
};



// Delete file utility function
const deleteFileIfExists = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`File deleted successfully: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
        return false;
    }
};



module.exports = {
    uploadProductImageMiddleware,
    deleteFileIfExists
}