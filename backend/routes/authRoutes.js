const express = require('express');
const router = express.Router();
const admin = require('firebase-admin'); // Ensure firebase-admin is initialized

// POST /api/auth/register
router.post('/register', async(req, res) => {
    const { email, password, walletAddress, role } = req.body;

    try {
        // 1. Create user in Firebase Auth
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: role,
        });

        // 2. Set Custom Claims (This is where the Role lives)
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

        // 3. Store additional data in Firestore
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            email,
            walletAddress: walletAddress.toLowerCase(),
            role,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({
            message: "User registered successfully",
            uid: userRecord.uid
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;