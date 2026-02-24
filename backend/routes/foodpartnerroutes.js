const express = require('express');
const partnerController = require('../auth/foodPartner.controller');


const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
router.get('/:id/profile', partnerController.getPartnerProfile);

router.get('/:id',authMiddleware.authFoodPartner, partnerController.getPartnerProfile);
module.exports = router;