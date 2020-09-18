const router = require('express').Router();
const path = require("path");

router.get('/', (req, res) => {
    res.send('server is working fine')
});

router.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'static', 'index.html'));
});

router.get('/json', (req, res) => {
    res.json({
        data: 123
    })
});

module.exports = router;