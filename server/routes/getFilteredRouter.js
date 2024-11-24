const Router = require('express')
const router = new Router()
const { getFilteredCategory2 } = require('../controllers/filtered')



router.post('/getFilteredCategory2', getFilteredCategory2);


module.exports = router
