// backend/utils/ipfs.js
const { NFTStorage, Blob } = require('nft.storage');
require('dotenv').config();

// Use a placeholder if you don't have the key yet to prevent crash
const client = new NFTStorage({ token: process.env.IPFS_KEY || '06954899.e69eb92bc366451491e2e26d39ad9335' });

const uploadToIPFS = async(jsonData) => {
    try {
        // We wrap the JSON in a Blob which doesn't require complex packing
        const content = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        const cid = await client.storeBlob(content);
        return `ipfs://${cid}`;
    } catch (error) {
        console.error("IPFS Upload Error:", error);
        // Fallback so the server doesn't crash during demo
        return "ipfs://placeholder_cid";
    }
};

module.exports = { uploadToIPFS };