const ProposalSchema = (proposer, title, description, ipfsHash) => ({
    proposer: proposer,
    title: title,
    description: description,
    ipfsHash: ipfsHash,
    status: 'PENDING',
    votesFor: 0,
    votesAgainst: 0,
    createdAt: new Date().toISOString(),
});
module.exports = ProposalSchema;