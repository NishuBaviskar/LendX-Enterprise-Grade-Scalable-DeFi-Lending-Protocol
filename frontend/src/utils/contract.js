import { ethers } from 'ethers';
import LendingPoolABI from '../../../blockchain/build/contracts/LendingPoolUpgradeable.json';

export const getLendingPoolContract = (providerOrSigner) => {
    return new ethers.Contract(
        import.meta.env.VITE_LENDING_POOL_ADDRESS,
        LendingPoolABI.abi,
        providerOrSigner
    );
};

export const formatUnits = (value, decimals = 18) => ethers.formatUnits(value, decimals);
export const parseUnits = (value, decimals = 18) => ethers.parseUnits(value, decimals);