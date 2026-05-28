const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// 1. GET /api/audit/logs (Existing)
router.get('/logs', async(req, res) => {
    try {
        const snapshot = await admin.firestore()
            .collection('audit_logs')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();

        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().toLocaleString() : null
        }));

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});

// 2. GET /api/audit/risky-positions (NEW - For Liquidator)
// Logic: Returns users whose position health is being monitored by the auditor
router.get('/risky-positions', async(req, res) => {
    try {
        // Simulation: We fetch users who have recent 'BORROW' actions that might be risky
        // In a production app, an indexer would calculate HF and store it here
        const snapshot = await admin.firestore()
            .collection('risky_positions')
            .where('hf', '<', 1.1) // Target slightly above 1.0 for "warning"
            .limit(10)
            .get();

        if (snapshot.empty) {
            // Return dummy data if DB is empty so you can test the UI
            return res.status(200).json([
                { address: "0x63734Cd14b23aE36556C6762fF0DB5Abe13cE611", hf: "0.92", debt: "0.5" },
                { address: "0x9e819F6aB742Bb80687AeF3CfdEfE9d062AF6f43", hf: "0.85", debt: "1.2" }
            ]);
        }

        const positions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(positions);
    } catch (error) {
        console.error("Audit Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch risky positions" });
    }
});

module.exports = router;