const admin = require('firebase-admin');

const updateRiskStatus = async(userAddress, healthFactor, totalDebt) => {
    try {
        // Initialize DB inside the function to ensure Firebase App is ready
        const db = admin.firestore();
        const riskyRef = db.collection('risky_positions').doc(userAddress);

        // If Health Factor is dangerously low (e.g., < 1.1)
        if (parseFloat(healthFactor) < 1.1) {
            await riskyRef.set({
                address: userAddress,
                hf: healthFactor,
                debt: totalDebt,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                status: 'CRITICAL'
            });
            console.log(`🚨 User ${userAddress} added to Risky Positions (HF: ${healthFactor})`);
        } else {
            // Check if document exists before deleting to avoid errors
            const doc = await riskyRef.get();
            if (doc.exists) {
                await riskyRef.delete();
                console.log(`✅ User ${userAddress} removed from Risky Positions (HF Improved)`);
            }
        }
    } catch (error) {
        console.error("Risk Monitor Error:", error);
    }
};

module.exports = { updateRiskStatus };