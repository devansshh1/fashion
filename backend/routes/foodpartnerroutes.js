const express = require('express');
const partnerController = require('../auth/foodPartner.controller');


const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

router.get("/check-auth", authMiddleware.authFoodPartner, (req, res) => {

    res.json({
        loggedIn: true,
        partner: {
            id: req.foodPartner._id,
            name: req.foodPartner.name
        }
    });

});
router.get('/:id/profile', partnerController.getPartnerProfile);

router.get('/:id',authMiddleware.authFoodPartner, partnerController.getPartnerProfile);
// routes/partner.js

module.exports = router;