const AuditLogSchema = (action, actor, details) => ({
    action: action, // e.g., 'CONTRACT_UPGRADE', 'ROLE_CHANGE'
    actor: actor,
    details: details,
    severity: 'INFO', // 'INFO', 'WARNING', 'CRITICAL'
    timestamp: new Date().toISOString(),
});
module.exports = AuditLogSchema;