const router = require('express').Router();

router.get('/', (req, res, next) => {
    return res.status(200).json({message:'welcome to the-project-api'});
});

module.exports = router;
