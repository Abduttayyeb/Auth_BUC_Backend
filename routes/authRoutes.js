const express = require('express')
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

const router = express.Router()

router.route("/")
        .post(loginLimiter, authController.userLogin)
    
router.route('/refresh')
        .get(authController.tokenRefresh)

router.route('/logout')
        .post(authController.userLogout)

module.exports = router