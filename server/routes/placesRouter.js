const Router = require('express')
const router = new Router()
const { getTitle, getAllData } = require('../controllers/places')


router.get('/getTitle', getTitle);
router.get('/getAllData', getAllData);


module.exports = router
