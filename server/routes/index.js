const Router = require('express')
const router = new Router()
const placesRouter = require('./placesRouter')
const reviewsRouter = require('./reviewsRouter')
const authRouter = require('./authRouter')
const getFilteredCategory2 = require('./getFilteredRouter')



router.use('/places', placesRouter)
router.use('/reviews', reviewsRouter)
router.use('/auth', authRouter)
router.use('/getFilteredCategory2', getFilteredCategory2)



    


module.exports = router
