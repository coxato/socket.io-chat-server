const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('server is working fine')
});

module.exports = router;