var path = require('path');
var router = require('express').Router()

// Root get route
router.get('/', function (req, res) {
    var indexPath = (path.join(__dirname, '../public/views/index.html'));
    // displays content from joined filename onto current get route page
    res.sendFile(indexPath);
});

module.exports = router;