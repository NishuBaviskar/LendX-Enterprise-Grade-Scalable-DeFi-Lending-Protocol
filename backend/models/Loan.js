const LoanSchema = (userId, amount, interestRate, txHash) => ({
    borrowerId: userId,
    principal: amount,
    remainingBalance: amount,
    interestRate: interestRate,
    status: 'ACTIVE', // 'ACTIVE', 'REPAID', 'LIQUIDATED'
    transactionHash: txHash,
    openedAt: new Date().toISOString(),
});
module.exports = LoanSchema;