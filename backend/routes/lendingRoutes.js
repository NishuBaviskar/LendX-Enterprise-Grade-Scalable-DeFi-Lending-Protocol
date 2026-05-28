const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { checkRole } = require('../middleware/roleMiddleware');

// Log a new loan to Firestore (Audit Log)
router.post('/log-loan', checkRole(['borrower']), async(req, res) => {
    try {
        const { userAddress, amount, asset } = req.body;
        const loanRef = db.collection('loans').doc();

        await loanRef.set({
            userAddress,
            amount,
            asset,
            status: 'active',
            timestamp: new Date().toISOString()
        });

        res.status(200).send({ message: "Loan logged in Firestore" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;