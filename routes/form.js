// routes/form.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('form', { step: 1 });
});

router.post('/next', (req, res) => {
    let step = parseInt(req.body.step) || 1;
    step = Math.min(step + 1, 3); 
    res.render('form', { step });
});


router.post('/prev', (req, res) => {
    let step = parseInt(req.body.step) || 1;
    step = Math.max(step - 1, 1); 
    res.render('form', { step });
});

module.exports = router;
