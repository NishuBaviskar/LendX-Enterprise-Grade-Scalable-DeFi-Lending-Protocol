/**
 * 📊 DATABASE SCHEMA MAPPING
 * This mapping ensures that high-privilege roles (Auditors, Admins)
 * have unique tracking fields for enterprise auditability.
 */
const UserSchema = (walletAddress, email, role) => {
    const baseProfile = {
        uid: "", // Populated by Firebase Auth
        walletAddress: walletAddress.toLowerCase(),
        email: email,
        role: role,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
    };

    // Role-Specific Extensions
    const extensions = {
        borrower: {
            creditScore: 600,
            loanLimit: "10 ETH",
            isLiquidatable: false
        },
        auditor: {
            assignedReports: [],
            verificationBadge: true,
            clearanceLevel: "High"
        },
        super_admin: {
            systemLogAccess: true,
            canPauseProtocol: true,
            adminActionNonce: 0
        }
    };

    return {...baseProfile, ...(extensions[role] || {}) };
};

module.exports = UserSchema;