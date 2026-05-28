const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { uploadToIPFS } = require('../utils/ipfs');
const ProposalSchema = require('../models/Proposal');

router.post('/propose', verifyToken, checkRole(['dao_member']), async(req, res) => {
    const { title, description } = req.body;
    try {
        // 1. Pin detailed description to IPFS
        const ipfsUrl = await uploadToIPFS({ title, description, proposer: req.user.uid });

        // 2. Save summary to Firestore
        const proposalData = ProposalSchema(req.user.uid, title, description, ipfsUrl);
        const docRef = await db.collection('proposals').add(proposalData);

        res.status(200).json({ id: docRef.id, ipfs: ipfsUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/list', async(req, res) => {
    try {
        const snapshot = await db.collection('proposals').orderBy('createdAt', 'desc').get();
        const proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;