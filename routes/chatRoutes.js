const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('server is working')
});

module.exports = router;