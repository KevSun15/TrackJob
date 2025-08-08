import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
    const allowedTypes = [ 'application/pdf' ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);    
    } else {
        cb(new Error('Only PDF files allowed'), false); 
    }
}

})

export { upload };