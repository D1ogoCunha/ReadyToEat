// routes/form.js
const express = require('express');
const router = express.Router();

// Rota para exibir o formulário
router.get('/', (req, res) => {
    res.render('form', { step: 1 });
});

// Rota para avançar entre etapas
router.post('/next', (req, res) => {
    let step = parseInt(req.body.step) || 1;
    step = Math.min(step + 1, 3); // Garante que não passe do passo 3
    res.render('form', { step });
});

// Rota para voltar entre etapas
router.post('/prev', (req, res) => {
    let step = parseInt(req.body.step) || 1;
    step = Math.max(step - 1, 1); // Garante que não vá abaixo do passo 1
    res.render('form', { step });
});

module.exports = router;
