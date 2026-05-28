import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { useAuth } from './AuthContext';
import LendingPoolArtifact from '../abis/LendingPoolUpgradeable.json';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const { user, role } = useAuth();

    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(false);
    const [signer, setSigner] = useState(null);

    // Prevent infinite MetaMask popup loop
    const isConnecting = useRef(false);
    const hasFailed = useRef(false);

    const connectWallet = useCallback(async () => {

        if (typeof window.ethereum === 'undefined' || isConnecting.current) return;

        isConnecting.current = true;
        setLoading(true);

        try {

            const provider = new ethers.BrowserProvider(window.ethereum);

            // -------- CHECK NETWORK --------
            const network = await provider.getNetwork();
            const chainId = Number(network.chainId);

            if (chainId !== 11155111) {

                console.warn("Wrong Network Detected. Switching to Sepolia...");

                try {

                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xaa36a7' }]
                    });

                } catch (switchError) {

                    if (switchError.code === 4902) {

                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0xaa36a7',
                                chainName: 'SepoliaETH',
                                rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY'],
                                nativeCurrency: {
                                    name: 'Sepolia Ether',
                                    symbol: 'SepoliaETH',
                                    decimals: 18
                                },
                                blockExplorerUrls: ['https://sepolia.etherscan.io']
                            }]
                        });

                    } else {
                        throw switchError;
                    }
                }
            }

            // -------- REQUEST ACCOUNT --------
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const currentSigner = await provider.getSigner();

            const contractAddress = import.meta.env.VITE_LENDING_POOL_ADDRESS;

            if (!contractAddress || contractAddress === "0x") {
                console.error("❌ VITE_LENDING_POOL_ADDRESS missing in .env");
                setLoading(false);
                isConnecting.current = false;
                return;
            }

            // -------- VERIFY CONTRACT DEPLOYED --------
            const code = await provider.getCode(contractAddress);

            if (code === "0x" || code === "0x0") {
                console.error(`❌ No contract deployed at ${contractAddress} on Sepolia`);
                setLoading(false);
                isConnecting.current = false;
                return;
            }

            // -------- CONTRACT INSTANCE --------
            const instance = new ethers.Contract(
                contractAddress,
                LendingPoolArtifact.abi,
                currentSigner
            );

            setAccount(accounts[0]);
            setSigner(currentSigner);
            setContract(instance);

            console.log(`✅ Connected to Sepolia Contract: ${contractAddress}`);

            hasFailed.current = false;

        } catch (error) {

            console.error("Web3 Connection Failed:", error.message);

            if (error.code === 4001) {
                hasFailed.current = true;
            }

        } finally {

            setLoading(false);
            isConnecting.current = false;
        }

    }, []);

    // -------- AUTO CONNECT (DELAYED VERSION TO PREVENT LOOP) --------
    useEffect(() => {

        const timer = setTimeout(() => {

            if (user && role && !account && !loading && !hasFailed.current) {
                connectWallet();
            }

        }, 1000); // 1 second delay

        return () => clearTimeout(timer);

    }, [user, role, account, loading, connectWallet]);

    // -------- METAMASK LISTENERS --------
    useEffect(() => {

        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts) => {

            hasFailed.current = false;

            if (accounts.length > 0) {

                setAccount(accounts[0]);
                connectWallet();

            } else {

                setAccount(null);
                setSigner(null);
                setContract(null);
            }
        };

        const handleChainChanged = () => {
            hasFailed.current = false;
            window.location.reload();
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {

            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        };

    }, [connectWallet]);

    return (
        <Web3Context.Provider
            value={{
                account,
                contract,
                signer,
                connectWallet,
                loading
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => useContext(Web3Context);