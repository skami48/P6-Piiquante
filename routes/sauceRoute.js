const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config");
const auth = require("../middleware/authMiddleware");

const sauceController = require("../controller/sauceController");





router.get('/',auth,sauceController.getSauces);
  
router.post('/',auth,multer,sauceController.postSauces);
  
router.get('/:id',auth,sauceController.getSaucesID);
  
router.put('/:id',auth,multer,sauceController.putSaucesID);
  
router.delete('/:id',auth,sauceController.deleteSaucesID);
  
router.post('/:id/like',auth,sauceController.postSaucesLike);

module.exports = router;