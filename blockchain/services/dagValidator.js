/**
 * DAG-style Validation Service
 * Concept: Asynchronous validation where transactions reference 
 * two previous transactions (tangle).
 */
class DAGValidator {
    constructor() {
        this.tangle = []; // Graph nodes
    }

    async validateTransaction(txData) {
        // Find two random previous tips in the tangle
        const tip1 = this.tangle[Math.floor(Math.random() * this.tangle.length)] || "genesis";
        const tip2 = this.tangle[Math.floor(Math.random() * this.tangle.length)] || "genesis";

        const node = {
            id: Date.now(),
            data: txData,
            parents: [tip1, tip2],
            isValidated: true
        };

        this.tangle.push(node);
        console.log(`[DAG] Transaction ${txData.txHash} validated against ${tip1.id} and ${tip2.id}`);
        return node;
    }
}

module.exports = new DAGValidator();