const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const morgan = require('morgan');
require('dotenv').config();

// --- 1. FIREBASE INITIALIZATION (MUST BE BEFORE REQUIRING SERVICES) ---
const serviceAccount = require('./config/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

// --- 2. ADVANCED MODULES ---
const dagValidator = require('./services/dagValidator');
const { updateRiskStatus } = require('./services/riskMonitor');

const app = express();

// --- 3. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------

// 1️⃣ Authentication Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// 2️⃣ Audit Routes
const auditRoutes = require('./routes/auditRoutes');
app.use('/api/audit', auditRoutes);

// ----------------------------------------------------
// 3️⃣ State Channel & DAG Repayment Logic
// ----------------------------------------------------
app.post('/api/repay/offchain', async(req, res) => {
    const { txData, signature } = req.body;
    try {
        // Validate transaction through DAG
        const dagNode = await dagValidator.validateTransaction(txData);

        // Store audit log
        await db.collection('audit_logs').add({
            actionType: 'STATE_CHANNEL_REPAYMENT',
            actor: txData.user,
            details: `Amount: ${txData.amount} ETH | DAG Node: ${dagNode.id}`,
            severity: 'LOW',
            dagParents: dagNode.parents,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).json({
            success: true,
            message: "Repayment validated via DAG Tangle",
            nodeId: dagNode.id
        });
    } catch (error) {
        console.error("DAG Error:", error);
        res.status(500).json({ error: "DAG Validation Failed" });
    }
});

// ----------------------------------------------------
// 4️⃣ Layer-2 Rollup Batch Monitoring
// ----------------------------------------------------
app.post('/api/l2/batch-log', async(req, res) => {
    const { batchId, txCount, stateRoot } = req.body;
    try {
        await db.collection('audit_logs').add({
            actionType: 'L2_BATCH_FINALIZED',
            actor: 'RollupBatcher_Contract',
            details: `Batch #${batchId} | Transactions: ${txCount} | Root: ${stateRoot}`,
            severity: 'LOW',
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(201).json({ status: "L2 Batch Sync Complete" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ----------------------------------------------------
// 5️⃣ Risk Trigger Endpoint
// ----------------------------------------------------
app.post('/api/risk/update', async(req, res) => {
    const { address, hf, debt, type } = req.body;
    try {
        // Step 1: Log action to audit system
        await db.collection('audit_logs').add({
            actionType: type === 'borrow' ? 'BORROW_EVENT' : 'SUPPLY_EVENT',
            actor: address,
            details: `${type.toUpperCase()} recorded. New HF: ${hf}`,
            severity: parseFloat(hf) < 1.1 ? 'HIGH' : 'LOW',
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        // Step 2: Update liquidation monitoring system
        await updateRiskStatus(address, hf, debt);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Risk Monitor Route Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ----------------------------------------------------
// SERVER START
// ----------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 LendX Enterprise Backend Running on Port ${PORT}`);
    console.log(`🧠 DAG Validator Service: Online`);
    console.log(`⚠️ Risk Monitor Service: Active`);
    console.log(`📡 Audit & Liquidation API: http://localhost:${PORT}/api/audit/risky-positions`);
});