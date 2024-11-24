const Router = require('express');
const router = new Router();
const { 
    getreviews, 
    reviews, 
    editReview, 
    deleteReview, 
    getUserReviews, 
    reactToReview, 
    getReactions, 
    removeReaction // Додаємо нову функцію
} = require('../controllers/reviews');

router.post('/getreviews', getreviews);
router.post('/reviews', reviews);
router.put('/editReview', editReview);
router.delete('/deleteReview/:id', deleteReview);
router.post('/getUserReviews', getUserReviews);
router.post('/react', reactToReview);
router.post('/getReactions', getReactions);
router.post('/removeReaction', removeReaction); // Додаємо новий маршрут

module.exports = router;
