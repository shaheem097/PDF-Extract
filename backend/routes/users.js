var express = require('express');
var router = express.Router();
const userController=require('../controller/userController')
const authenticateToken=require('../middleware/userAuth')
const upload=require('../multer/multer')

/* POST user Signup. */
router.post('/signup', userController.registerUser);

// POST user Login
router.post('/login',userController.loginUser)

//Upload PDF
router.post('/uploadpdf', upload.single('file'),authenticateToken, userController.uploadpdf);


//Fetch All pdf
router.get('/:userId/getallpdf',authenticateToken,userController.fetchpdf)

//Fetch Extracted PDF
router.get('/:userId/getallExtracted',authenticateToken,userController.fetchExtracted)

//Delete PDF
router.delete('/deletepdf/:pdfId',authenticateToken,userController.deletepdf)

//xtract pdf
router.post('/extract-pdf',userController.extractpdf)




module.exports = router;
