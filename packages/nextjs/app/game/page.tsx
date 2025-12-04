/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { useWallet, useFhevm, useDecrypt, useContract } from '@fhevm-sdk';
import {
  CIPHER_LOOT_ABI,
  CONTRACT_ADDRESSES,
  SEPOLIA_NETWORK_CONFIG,
  SUPPORTED_CHAIN_ID,
  getContractAddress,
  shortAddress,
} from '@/lib/cipherLoot';
import { rarityByCode, rarityMeta } from '@/data/prizes';
import type { DrawEntry } from '@/types/draw';

const HISTORY_PAGE_SIZE = 25;

interface ToastState {
  tone: 'info' | 'success' | 'error';
  message: string;
}

// Mainstream wallet options for the connect modal
const WALLET_OPTIONS = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', downloadUrl: 'https://metamask.io/download/' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', downloadUrl: 'https://www.coinbase.com/wallet/downloads' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', downloadUrl: 'https://walletconnect.com/' },
  { id: 'okx', name: 'OKX Wallet', icon: '⭕', downloadUrl: 'https://www.okx.com/web3' },
  { id: 'trust', name: 'Trust Wallet', icon: '🛡️', downloadUrl: 'https://trustwallet.com/download' },
  { id: 'rabby', name: 'Rabby Wallet', icon: '🐰', downloadUrl: 'https://rabby.io/' },
];

export default function GamePage() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [history, setHistory] = useState<DrawEntry[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawSuccess, setDrawSuccess] = useState(false);
  const [drawError, setDrawError] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [metrics, setMetrics] = useState({ totalDraws: 0, precision: 10000, srCutoff: 1000, ssrCutoff: 100 });
  const [walletCopied, setWalletCopied] = useState(false);
  const [contractCopied, setContractCopied] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Reset all local UI and game state
  const resetAllStates = useCallback(() => {
    setHistory([]);
    setIsDrawing(false);
    setDrawSuccess(false);
    setDrawError('');
    setLoadingHistory(false);
    setMetrics({ totalDraws: 0, precision: 10000, srCutoff: 1000, ssrCutoff: 100 });
    setWalletCopied(false);
    setContractCopied(false);
    setShowWalletModal(false);
    setToast(null);
  }, []);

  const {
    address,
    chainId,
    isConnected,
    connect: connectWallet,
    disconnect: disconnectWallet,
    isConnecting,
    error: walletError,
  } = useWallet();
  const { status: fheStatus, initialize: initializeFhevm, error: fheError } = useFhevm();
  const { batchDecrypt, isDecrypting } = useDecrypt();

  const activeChainId = chainId ?? SUPPORTED_CHAIN_ID;
  const contractAddress = getContractAddress(activeChainId);
  const { contract: readContract } = useContract(contractAddress, CIPHER_LOOT_ABI as any);

  const isOnSupportedNetwork = chainId === undefined || chainId === SUPPORTED_CHAIN_ID || !!CONTRACT_ADDRESSES[chainId];

  const showToast = useCallback((tone: ToastState['tone'], message: string) => {
    setToast({ tone, message });
    setTimeout(() => setToast(null), 4600);
  }, []);

  useEffect(() => {
    if (isConnected && fheStatus === 'idle') {
      initializeFhevm();
    }
  }, [isConnected, fheStatus, initializeFhevm]);

  const fetchMetrics = useCallback(async () => {
    if (!readContract) return 0;
    try {
      const [precision, srCutoff, ssrCutoff] = await readContract.getProbabilityConfig();
      const totalDraws = await readContract.totalDraws();
      setMetrics({
        precision: Number(precision),
        srCutoff: Number(srCutoff),
        ssrCutoff: Number(ssrCutoff),
        totalDraws: Number(totalDraws),
      });
      return Number(totalDraws);
    } catch (error) {
      console.error('Unable to fetch contract metrics', error);
      return 0;
    }
  }, [readContract]);

  const loadHistory = useCallback(async (latestTxHash?: string) => {
    if (!readContract || !address) return;
    setLoadingHistory(true);
    try {
      const total = await fetchMetrics();
      const offset = total > HISTORY_PAGE_SIZE ? total - HISTORY_PAGE_SIZE : 0;
      const [rarities, variants, timestamps] = await readContract.getEncryptedHistory(address, offset, HISTORY_PAGE_SIZE);

      // Fetch event logs to get transaction hashes
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const contractWithProvider = new ethers.Contract(contractAddress!, CIPHER_LOOT_ABI, provider);
      
      // Query LootDrawn events for this user
      const filter = contractWithProvider.filters.LootDrawn(address);
      const events = await contractWithProvider.queryFilter(filter);
      
      // Create a map of drawId -> txHash
      const txHashMap = new Map<number, string>();
      events.forEach((event: any) => {
        const drawId = Number(event.args.drawId);
        txHashMap.set(drawId, event.transactionHash);
      });

      setHistory((prev) => {
        const prevMap = new Map(prev.map((entry) => [entry.drawId, entry]));
        const entries: DrawEntry[] = rarities.map((rarityHandle: string, idx: number) => {
          const drawId = offset + idx + 1;
          const base: DrawEntry = {
            drawId,
            timestamp: Number(timestamps[idx]),
            rarityHandle,
            variantHandle: variants[idx],
            state: 'encrypted',
            txHash: txHashMap.get(drawId) || undefined,
          };
          return prevMap.has(drawId) ? { ...base, ...prevMap.get(drawId)!, txHash: txHashMap.get(drawId) || prevMap.get(drawId)!.txHash } : base;
        });
        return entries.sort((a, b) => b.drawId - a.drawId);
      });
    } catch (error) {
      console.error('Failed to load history', error);
      showToast('error', 'Unable to load encrypted history');
    } finally {
      setLoadingHistory(false);
    }
  }, [address, contractAddress, fetchMetrics, readContract, showToast]);

  useEffect(() => {
    if (address && readContract) {
      loadHistory();
    }
  }, [address, readContract, loadHistory]);

  // Watch wallet connection changes (reset when disconnected)
  useEffect(() => {
    if (!isConnected) {
      resetAllStates();
    }
  }, [isConnected, resetAllStates]);

  // Listen for wallet-side disconnect events
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        resetAllStates();
        disconnectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const handleDisconnect = () => {
      resetAllStates();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('disconnect', handleDisconnect);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
      window.ethereum?.removeListener('disconnect', handleDisconnect);
    };
  }, [disconnectWallet, resetAllStates]);

  // Reset on first load by checking initial connection
  useEffect(() => {
    // On initial page load, ensure state is clean when not connected
    if (!isConnected) {
      resetAllStates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Handle disconnect triggered from the UI
  const handleDisconnect = useCallback(() => {
    disconnectWallet();
    resetAllStates();
  }, [disconnectWallet, resetAllStates]);

  const ensureSepolia = useCallback(async () => {
    if (!window.ethereum) return false;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_NETWORK_CONFIG.chainId }],
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_NETWORK_CONFIG],
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }, []);

  const handleDraw = useCallback(async () => {
    if (!window.ethereum || !contractAddress) return;
    
    if (!isConnected) {
      await connectWallet();
      return;
    }
    
    if (chainId !== SUPPORTED_CHAIN_ID) {
      const switched = await ensureSepolia();
      if (!switched) return;
    }
    
    try {
      setIsDrawing(true);
      setDrawSuccess(false);
      setDrawError('');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CIPHER_LOOT_ABI, signer);
      const tx = await contract.draw();
      await tx.wait();
      setDrawSuccess(true);
      setTimeout(() => setDrawSuccess(false), 3000);
      await loadHistory(tx.hash);
    } catch (error: any) {
      console.error(error);
      
      // Detect whether the transaction was cancelled by the user
      const isUserRejection = 
        error?.code === 4001 || // MetaMask user rejection
        error?.code === 'ACTION_REJECTED' || // Ethers user rejection
        error?.message?.toLowerCase().includes('user rejected') ||
        error?.message?.toLowerCase().includes('user denied') ||
        error?.message?.toLowerCase().includes('user cancelled');
      
      // If it was user cancellation, do not surface an error message
      if (!isUserRejection) {
        setDrawError(error?.message || 'Draw failed');
        setTimeout(() => setDrawError(''), 3000); // clear the error after 3 seconds
      }
    } finally {
      setIsDrawing(false);
    }
  }, [chainId, connectWallet, contractAddress, ensureSepolia, isConnected, loadHistory]);

  const handleDecrypt = useCallback(
    async (entry: DrawEntry) => {
      if (!window.ethereum || !contractAddress) return;
      
      try {
        setHistory((prev) => prev.map((item) => (item.drawId === entry.drawId ? { ...item, state: 'decrypting' } : item)));
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        const handles = [entry.rarityHandle, entry.variantHandle];
        const decryptedValues = await batchDecrypt(handles, contractAddress, signer);
        
        const rarityValue = decryptedValues[entry.rarityHandle];
        const variantValue = decryptedValues[entry.variantHandle];
        const rarityKey = rarityByCode[Number(rarityValue)];
        const rarityMetaObj = rarityMeta[rarityKey];
        
        setHistory((prev) =>
          prev.map((item) =>
            item.drawId === entry.drawId
              ? {
                  ...item,
                  state: 'decrypted',
                  rarity: Number(rarityValue),
                  variant: Number(variantValue),
                  resolvedRarity: rarityMetaObj,
                }
              : item,
          ),
        );
      } catch (error: any) {
        console.error(error);
        
        const isUserRejection = 
          error?.code === 4001 ||
          error?.code === 'ACTION_REJECTED' ||
          error?.message?.toLowerCase().includes('user rejected') ||
          error?.message?.toLowerCase().includes('user denied') ||
          error?.message?.toLowerCase().includes('user cancelled');
        
        if (isUserRejection) {
          setHistory((prev) => prev.map((item) => (item.drawId === entry.drawId ? { ...item, state: 'encrypted' } : item)));
        } else {
          setHistory((prev) => prev.map((item) => (item.drawId === entry.drawId ? { ...item, state: 'error' } : item)));
          setTimeout(() => {
            setHistory((prev) => prev.map((item) => (item.drawId === entry.drawId ? { ...item, state: 'encrypted' } : item)));
          }, 3000);
        }
      }
    },
    [batchDecrypt, contractAddress],
  );

  // Detect whether a given wallet is installed
  const checkWalletInstalled = useCallback((walletId: string): boolean => {
    if (typeof window === 'undefined' || !window.ethereum) return false;
    
    const ethereum = window.ethereum as any;
    
    switch (walletId) {
      case 'metamask':
        return Boolean(ethereum.isMetaMask);
      case 'coinbase':
        return Boolean(ethereum.isCoinbaseWallet);
      case 'okx':
        return Boolean(ethereum.isOkxWallet);
      case 'trust':
        return Boolean(ethereum.isTrust);
      case 'rabby':
        return Boolean(ethereum.isRabby);
      case 'walletconnect':
        // WalletConnect does not require an extension, always return true
        return true;
      default:
        return false;
    }
  }, []);

  // Handle wallet connection based on selected walletId
  const handleWalletConnect = useCallback(async (walletId: string) => {
    if (!checkWalletInstalled(walletId) && walletId !== 'walletconnect') {
      showToast('error', `Please install ${WALLET_OPTIONS.find(w => w.id === walletId)?.name} first.`);
      return;
    }
    
    setShowWalletModal(false);
    
    if (!window.ethereum) {
      showToast('error', 'No wallet extension detected. Please install a wallet.');
      return;
    }

    try {
      // Attempt connection depending on wallet type
      const ethereum = window.ethereum as any;
      
      if (walletId === 'metamask' && ethereum.isMetaMask) {
        await connectWallet();
      } else if (walletId === 'coinbase' && ethereum.isCoinbaseWallet) {
        await connectWallet();
      } else if (walletId === 'okx' && ethereum.isOkxWallet) {
        await connectWallet();
      } else if (walletId === 'trust' && ethereum.isTrust) {
        await connectWallet();
      } else if (walletId === 'rabby' && ethereum.isRabby) {
        await connectWallet();
      } else if (walletId === 'walletconnect') {
        // WalletConnect may need a dedicated flow; use generic connect for now
        await connectWallet();
      } else {
        await connectWallet();
      }
    } catch {
      // Wallet connection errors are handled by wallet UI
    }
  }, [checkWalletInstalled, connectWallet, showToast]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-0">
      {/* Wallet Modal */}
      {showWalletModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowWalletModal(false)}
        >
          <div 
            className="glass-card p-8 max-w-md w-full mx-4 animate-[scale-in_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'scale-in 0.2s ease-out'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Connect Wallet
              </h2>
              <button
                type="button"
                onClick={() => setShowWalletModal(false)}
                className="text-white/60 hover:text-white text-3xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            
            <p className="text-sm text-white/60 mb-6">
              Choose your preferred wallet to connect
            </p>
            
            <div className="space-y-3">
              {WALLET_OPTIONS.map((wallet) => {
                const isInstalled = checkWalletInstalled(wallet.id);
                return (
                  <button
                    key={wallet.id}
                    type="button"
                    onClick={() => {
                      if (isInstalled) {
                        handleWalletConnect(wallet.id);
                      } else {
                        // Open the wallet download page in a new tab
                        window.open(wallet.downloadUrl, '_blank');
                      }
                    }}
                    disabled={isConnecting}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all group relative ${
                      isInstalled
                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#d4af37]/50 cursor-pointer'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-rose-400/30 cursor-pointer'
                    }`}
                  >
                    <span className={`text-3xl transition-transform ${isInstalled ? 'group-hover:scale-110' : 'grayscale'}`}>
                      {wallet.icon}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="text-lg font-semibold text-white">{wallet.name}</div>
                      {!isInstalled && (
                        <div className="text-xs text-rose-400 mt-0.5">Not Installed - Click to install</div>
                      )}
                    </div>
                    {isInstalled ? (
                      <span className="text-white/40 group-hover:text-[#d4af37] transition-colors">→</span>
                    ) : (
                      <span className="text-xs text-white/30 group-hover:text-rose-400 bg-white/5 px-2 py-1 rounded transition-colors">
                        Install
                      </span>
                    )}
                    
                    {/* Installed badge */}
                    {isInstalled && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                        <span>✓</span>
                        <span>Installed</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-white/40 mt-6 text-center">
              By connecting a wallet, you agree to the Terms of Service
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>Cipher Loot</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn-muted">
            Back
          </Link>
          {isConnected ? (
            <button type="button" className="btn-muted" onClick={handleDisconnect}>
              Disconnect
            </button>
          ) : (
            <button 
              type="button" 
              className="btn-primary" 
              onClick={() => setShowWalletModal(true)} 
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>
      </div>

      {toast && (
        <div
          className={`mt-6 rounded-2xl border p-4 text-sm ${
            toast.tone === 'success'
              ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100'
              : toast.tone === 'error'
              ? 'border-rose-400/30 bg-rose-500/10 text-rose-100'
              : 'border-amber-300/30 bg-amber-200/10 text-amber-100'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Stage-like layout - Draw button in the center */}
      <section className="mt-16 relative">
        {/* Center stage - Draw button */}
        <div className="flex justify-center items-center mb-16">
          <div className="relative flex items-center gap-4">
            <button
              type="button"
              className={`text-xl px-16 py-8 transition-all hover:scale-105 rounded-2xl font-black ${
                !isConnected || isDrawing || !contractAddress
                  ? 'bg-black text-[#d4af37] border-2 border-[#d4af37]/30 cursor-not-allowed shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                  : 'btn-primary shadow-[0_10px_60px_rgba(212,175,55,0.6)] hover:shadow-[0_15px_80px_rgba(212,175,55,0.8)]'
              }`}
              onClick={handleDraw}
              disabled={!isConnected || isDrawing || !contractAddress}
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '1.25rem',
                letterSpacing: '0.15em'
              }}
            >
              {isDrawing ? '⚡ Drawing...' : '⚔ Draw Encrypted Loot'}
            </button>
            
            {/* Status indicators - absolute positioned to not affect layout */}
            <div className="absolute left-full ml-4 flex items-center" style={{ width: '200px' }}>
              {isDrawing && (
                <div className="animate-spin text-3xl text-[#d4af37]">⏳</div>
              )}
              {drawError && (
                <div className="text-sm text-rose-400 font-semibold whitespace-nowrap">
                  ❌ {drawError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top row - Wallet info and Probability */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Wallet card - left */}
          <div className="glass-card relative p-6 transition-all hover:scale-[1.01]">
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {/* Top-left cell - WALLET */}
                <div>
                  <p className="text-base uppercase tracking-[0.4em] font-bold text-[#d4af37]">Wallet</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (address) {
                        navigator.clipboard.writeText(address);
                        setWalletCopied(true);
                        setTimeout(() => setWalletCopied(false), 1500);
                      }
                    }}
                    className="mt-2 text-lg font-semibold text-white hover:text-[#d4af37] transition-colors cursor-pointer"
                    title="Click to copy"
                  >
                    {walletCopied ? '✓ Copied!' : shortAddress(address)}
                  </button>
                </div>
                
                {/* Top-right cell - NETWORK */}
                <div>
                  <p className="text-base uppercase tracking-[0.4em] font-bold text-[#d4af37]">Network</p>
                  <p className="mt-2 text-lg font-semibold text-white">{chainId ? (isOnSupportedNetwork ? 'Sepolia' : `Chain ${chainId}`) : 'No wallet'}</p>
                </div>
                
                {/* Bottom-left cell - FHE */}
                <div>
                  <p className="text-base uppercase tracking-[0.4em] font-bold text-[#d4af37]">FHE</p>
                  <p className="mt-2 text-lg font-semibold text-white capitalize">
                    {fheStatus === 'idle' ? 'Uninitialized' : fheStatus === 'loading' ? 'Initializing' : fheStatus}
                  </p>
                </div>
                
                {/* Bottom-right cell - CONTRACT */}
                <div>
                  <p className="text-base uppercase tracking-[0.4em] font-bold text-[#d4af37]">Contract</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (contractAddress) {
                        navigator.clipboard.writeText(contractAddress);
                        setContractCopied(true);
                        setTimeout(() => setContractCopied(false), 1500);
                      }
                    }}
                    className="mt-2 text-lg font-semibold text-white hover:text-[#d4af37] transition-colors cursor-pointer"
                    title="Click to copy"
                  >
                    {contractCopied ? '✓ Copied!' : shortAddress(contractAddress)}
                  </button>
                </div>
              </div>
              
              {(walletError || fheError) && (
                <p className="mt-3 text-xs text-rose-200">{walletError || fheError}</p>
              )}
            </div>
          </div>

          {/* Probability card - right */}
          <div className="glass-card relative p-6 transition-all hover:scale-[1.01] group">
            <div className="relative">
              {/* Hover glow overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" 
                   style={{
                     background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, rgba(142,197,176,0.03) 40%, transparent 70%)',
                     filter: 'blur(30px)',
                     zIndex: 0
                   }}>
              </div>
              
              <div className="relative z-10">
                <p className="text-base uppercase tracking-[0.4em] font-bold text-[#d4af37]">Probability</p>
                <div className="mt-4 flex items-end gap-4">
                  <div className="flex-1 rounded-2xl p-4 text-center transition-all duration-300"
                       style={{
                         border: '2px solid rgba(212,175,55,0.4)',
                         background: 'linear-gradient(135deg, rgba(139,116,61,0.15) 0%, rgba(78,65,34,0.25) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(212,175,55,0.2), inset 0 -1px 0 rgba(0,0,0,0.4), 0 4px 15px rgba(212,175,55,0.1)'
                       }}>
                    <p className="text-3xl font-bold text-white">
                      {((metrics.ssrCutoff / metrics.precision) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xl uppercase tracking-wide font-bold text-[#d4af37]">SSR</p>
                  </div>
                  <div className="flex-1 rounded-2xl p-4 text-center transition-all duration-300"
                       style={{
                         border: '2px solid rgba(212,175,55,0.4)',
                         background: 'linear-gradient(135deg, rgba(139,116,61,0.15) 0%, rgba(78,65,34,0.25) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(212,175,55,0.2), inset 0 -1px 0 rgba(0,0,0,0.4), 0 4px 15px rgba(212,175,55,0.1)'
                       }}>
                    <p className="text-3xl font-bold text-white">
                      {(((metrics.srCutoff - metrics.ssrCutoff) / metrics.precision) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xl uppercase tracking-wide font-bold text-[#d4af37]">SR</p>
                  </div>
                  <div className="flex-1 rounded-2xl p-4 text-center transition-all duration-300"
                       style={{
                         border: '2px solid rgba(212,175,55,0.4)',
                         background: 'linear-gradient(135deg, rgba(139,116,61,0.15) 0%, rgba(78,65,34,0.25) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(212,175,55,0.2), inset 0 -1px 0 rgba(0,0,0,0.4), 0 4px 15px rgba(212,175,55,0.1)'
                       }}>
                    <p className="text-3xl font-bold text-white">
                      {(((metrics.precision - metrics.srCutoff) / metrics.precision) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xl uppercase tracking-wide font-bold text-[#d4af37]">R</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom row - Collection */}
      <section className="mt-10">
        {/* Status messages above Collection card */}
        <div className="flex justify-center mb-4 min-h-[32px]">
          {drawSuccess && (
            <div className="text-lg text-emerald-400 font-semibold animate-pulse">
              ✓ Loot stored!
            </div>
          )}
          {toast?.tone === 'error' && toast.message.includes('history') && (
            <div className="text-sm text-rose-400 font-semibold">
              ❌ {toast.message}
            </div>
          )}
        </div>
        
        <div className="glass-card relative p-6 max-w-4xl mx-auto transition-all hover:scale-[1.01]">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-base uppercase tracking-[0.4em] font-bold text-[#d4af37]">Collection</p>
              <p className="mt-1 text-base font-semibold text-white">
                {history.length === 0 ? 'No draws yet' : `${history.length} ${history.length === 1 ? 'draw' : 'draws'}`}
              </p>
            </div>
          </div>
          {loadingHistory ? (
            <div className="relative mt-6 rounded-2xl border border-dashed border-white/15 p-8 text-center text-base text-white">
              Loading your collection...
            </div>
          ) : history.length > 0 ? (
            <div className="relative mt-6 space-y-4 max-h-[600px] overflow-y-auto pr-2">
                     {history.map((entry) => {
                       const isDecrypted = entry.state === 'decrypted' && entry.rarity !== undefined && entry.variant !== undefined;
                       const card = isDecrypted ? entry.resolvedRarity?.cards[entry.variant!] : null;
                       
                       return (
                       <div key={entry.drawId} className="p-6 rounded-2xl border border-white/10 bg-white/5">
                         {/* Header: Draw # and Date/Time */}
                         <div className="flex items-center justify-between mb-4">
                           <div className="flex-1">
                             <p className="text-xl font-bold text-white mb-2">Draw {entry.drawId}</p>
                             <div className="flex items-center gap-3 text-lg text-white">
                               <span>
                                 {new Date(entry.timestamp * 1000).toLocaleDateString('en-US', {
                                   month: 'short',
                                   day: 'numeric',
                                   year: 'numeric'
                                 })}
                               </span>
                               <span>•</span>
                               <span>
                                 {new Date(entry.timestamp * 1000).toLocaleTimeString('en-US', {
                                   hour: '2-digit',
                                   minute: '2-digit'
                                 })}
                               </span>
                             </div>
                           </div>
                           
                           {/* Right side: Card info or Decrypt button */}
                           <div>
                             {isDecrypted ? (
                               <div className="text-right flex items-center gap-4">
                                 <p className="text-2xl font-bold text-white">
                                   {card?.name || 'Unknown'}
                                 </p>
                                 <p className="text-5xl font-black text-[#d4af37] uppercase tracking-wider">
                                   {entry.resolvedRarity?.key || 'Unknown'}
                                 </p>
                               </div>
                             ) : (
                               <button
                                 type="button"
                                 className={`text-sm px-6 py-2 ${
                                   entry.state === 'error' 
                                     ? 'bg-rose-500/20 text-rose-400 border border-rose-400/50 cursor-not-allowed' 
                                     : 'btn-muted'
                                 }`}
                                 onClick={() => handleDecrypt(entry)}
                                 disabled={entry.state === 'decrypting' || entry.state === 'error' || isDecrypting}
                               >
                                 {entry.state === 'decrypting' ? 'Decrypting...' : entry.state === 'error' ? 'Failed' : 'Decrypt'}
                               </button>
                             )}
                           </div>
                         </div>
                         
                         {/* Decrypted content: Description and TX hash */}
                         {isDecrypted && card && (
                           <div className="pt-4 border-t border-white/10 space-y-3">
                             <p className="text-base text-white leading-relaxed">
                               {card.description}
                             </p>
                             {entry.txHash && (
                               <div className="flex items-center gap-2 text-sm">
                                 <span className="text-white font-semibold">TX:</span>
                                 <a
                                   href={`https://sepolia.etherscan.io/tx/${entry.txHash}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-[#d4af37] hover:underline font-mono"
                                 >
                                   {entry.txHash.slice(0, 10)}...{entry.txHash.slice(-8)}
                                 </a>
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                       );
                     })}
            </div>
          ) : (
            <div className="relative mt-6 rounded-2xl border border-dashed border-white/15 p-8 text-center text-base text-white">
              Draw and decrypt your loot to see cards here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

