/**
 * @title DAG Validator Service
 * @dev Implements an asynchronous validation graph (Tangle concept) 
 * for off-chain state channel settlements.
 */
class DAGValidator {
    constructor() {
        // This simulates the Tangle (Directed Acyclic Graph)
        this.tangle = [
            { id: "genesis", parents: [], timestamp: Date.now() }
        ];
    }

    /**
     * @dev Validates a transaction by referencing two previous tips in the graph.
     * @param {Object} txData - The transaction metadata.
     */
    async validateTransaction(txData) {
        // 1. Select two random tips (parent nodes) from the tangle to validate against
        const parent1 = this.tangle[Math.floor(Math.random() * this.tangle.length)];
        const parent2 = this.tangle[Math.floor(Math.random() * this.tangle.length)];

        // 2. Create the new DAG Node
        const newNode = {
            id: `dag_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            data: txData,
            parents: [parent1.id, parent2.id],
            timestamp: Date.now(),
            isValidated: true
        };

        // 3. Append to the off-chain ledger
        this.tangle.push(newNode);

        console.log(`[DAG LEDGER] Node Created: ${newNode.id}`);
        console.log(`[DAG LEDGER] Validated against parents: ${parent1.id} & ${parent2.id}`);

        return newNode;
    }

    getTangle() {
        return this.tangle;
    }
}

module.exports = new DAGValidator();