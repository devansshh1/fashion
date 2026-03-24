const express = require('express');
const partnerController = require('../auth/foodPartner.controller');


const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { clearCookieOptions } = require('../src/cookieOptions');

router.get("/check-auth", authMiddleware.authFoodPartner, (req, res) => {

    res.json({
        loggedIn: true,
        partner: {
            id: req.foodPartner._id,
            name: req.foodPartner.name
        }
    });

});

router.post("/logout", (req, res) => {
  res.clearCookie("partnerToken", clearCookieOptions);
  res.json({ message: "Logged out" });
});
router.get('/:id/profile', partnerController.getPartnerProfile);
router.patch('/:id', authMiddleware.authFoodPartner, partnerController.updatePartnerProfile);


router.get('/:id',authMiddleware.authFoodPartner, partnerController.getPartnerProfile);
// routes/partner.js

module.exports = router;
