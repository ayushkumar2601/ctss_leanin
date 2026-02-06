
import React, { useState, useRef } from 'react';
import { Upload, X, Zap, Sparkles, Info, Heart, AlertCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { mintNFT, validateMintingPrerequisites, type MintProgress } from '../lib/services/mint-service';
import { getNFTPriceSuggestion } from '../lib/services/aiService';
import HUDGauge from '../components/HUDGauge';

const Mint: React.FC = () => {
  const { signer, walletAddress, chainId } = useWallet();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isEstimating, setIsEstimating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  
  // Minting state
  const [isMinting, setIsMinting] = useState(false);
  const [mintProgress, setMintProgress] = useState<MintProgress | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState<{
    tokenId: string;
    transactionHash: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const getAIUrgencyAssessment = async () => {
    if (!title) return;
    setIsEstimating(true);
    try {
      const result = await getNFTPriceSuggestion(title, description);
      
      // Reframe AI response for urgency
      const urgencyText = result.text.replace(/price|eth|value/gi, 'urgency level');
      setAiSuggestion(urgencyText);
      
      // Map AI confidence to urgency level
      if (result.confidence && result.confidence > 75) {
        setUrgency('High');
      } else if (result.confidence && result.confidence > 50) {
        setUrgency('Medium');
      } else {
        setUrgency('Low');
      }
      
      setAiConfidence(result.confidence);
    } catch (err) {
      console.error("AI Assessment failed:", err);
      setAiSuggestion("Medium urgency | AI analysis unavailable. Please assess manually.");
      setAiConfidence(60);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleMint = async () => {
    if (!signer || !walletAddress) {
      setMintError('Please connect your wallet first');
      return;
    }

    if (!file || !title) {
      setMintError('Please provide an image and title');
      return;
    }

    // Validate prerequisites
    const validation = await validateMintingPrerequisites(signer);
    if (!validation.valid) {
      setMintError(validation.error || 'Validation failed');
      return;
    }

    setIsMinting(true);
    setMintError(null);
    setMintProgress(null);

    try {
      const result = await mintNFT(
        signer,
        {
          file,
          name: title,
          description,
        },
        (progress) => {
          setMintProgress(progress);
        }
      );

      setMintSuccess({
        tokenId: result.tokenId,
        transactionHash: result.transactionHash,
      });
    } catch (error: any) {
      console.error('Minting error:', error);
      setMintError(error.message || 'Minting failed. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  if (mintSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_#10b981]">
          <Zap size={48} className="text-white" fill="currentColor" />
        </div>
        <h1 className="text-6xl font-black uppercase mb-4 tracking-tighter">EVIDENCE RECORDED!</h1>
        <p className="text-zinc-400 font-mono text-sm max-w-md mb-4 uppercase tracking-widest">
          YOUR EVIDENCE HAS BEEN PERMANENTLY RECORDED ON THE PUBLIC LEDGER. TRANSPARENCY ENFORCED.
        </p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 max-w-md">
          <p className="text-xs font-mono text-zinc-500 mb-2">EVIDENCE ID</p>
          <p className="text-2xl font-black text-cyan-500 mb-4">#{mintSuccess.tokenId}</p>
          <p className="text-xs font-mono text-zinc-500 mb-2">TRANSACTION</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${mintSuccess.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-cyan-500 hover:text-cyan-400 flex items-center gap-2 break-all"
          >
            {mintSuccess.transactionHash.slice(0, 20)}...
            <ExternalLink size={12} />
          </a>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.hash = '#/dashboard'}
            className="px-12 py-4 bg-white text-black font-black text-lg hover:bg-cyan-500 hover:text-white transition-all"
          >
            <span className="inline-block">VIEW MY SUBMISSIONS</span>
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-12 py-4 border-2 border-white text-white font-black text-lg hover:border-cyan-500 transition-all"
          >
            <span className="inline-block">UPLOAD MORE EVIDENCE</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
          Upload <span className="text-cyan-500">Evidence</span>
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase">Document real-world issues for public accountability.</p>
      </div>

      {/* Wallet Connection Warning */}
      {!walletAddress && (
        <div className="mb-8 p-6 bg-yellow-500/10 border-2 border-yellow-500 rounded-2xl flex items-start gap-4">
          <AlertCircle className="text-yellow-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-black text-yellow-500 mb-2">WALLET NOT CONNECTED</h3>
            <p className="text-sm font-mono text-zinc-400">
              Connect your wallet to upload evidence to the public ledger.
            </p>
          </div>
        </div>
      )}

      {/* Wrong Network Warning */}
      {walletAddress && chainId !== 11155111 && (
        <div className="mb-8 p-6 bg-red-500/10 border-2 border-red-500 rounded-2xl flex items-start gap-4">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-black text-red-500 mb-2">WRONG NETWORK</h3>
            <p className="text-sm font-mono text-zinc-400">
              Please switch to Sepolia testnet in your wallet.
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {mintError && (
        <div className="mb-8 p-6 bg-red-500/10 border-2 border-red-500 rounded-2xl flex items-start gap-4">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-black text-red-500 mb-2">UPLOAD FAILED</h3>
            <p className="text-sm font-mono text-zinc-400">{mintError}</p>
          </div>
        </div>
      )}

      {/* Progress Display */}
      {isMinting && mintProgress && (
        <div className="mb-8 p-6 bg-cyan-500/10 border-2 border-cyan-500 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="animate-spin text-cyan-500">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-cyan-500">{mintProgress.message}</h3>
              <p className="text-xs font-mono text-zinc-400 uppercase">
                Step {mintProgress.step} - {mintProgress.progress}%
              </p>
            </div>
          </div>
          <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500"
              style={{ width: `${mintProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Upload Area */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group ${
              preview ? 'border-zinc-800' : 'border-zinc-800 hover:border-cyan-500 hover:bg-cyan-500/5'
            }`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                   <Upload className="text-zinc-500 group-hover:text-cyan-500" />
                </div>
                <p className="font-black text-sm mb-1 uppercase tracking-tighter">Drag & Drop Evidence Photo</p>
                <p className="text-[10px] font-mono text-zinc-600 uppercase">PNG, JPG, GIF (MAX 100MB)</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          {/* AI Preview HUD if available */}
          {aiConfidence && (
            <div className="animate-in slide-in-from-bottom duration-500">
               <HUDGauge value={aiConfidence} demand="High" />
            </div>
          )}

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex gap-4">
            <Info className="text-zinc-500 shrink-0" size={20} />
            <p className="text-[10px] font-mono text-zinc-500 leading-relaxed uppercase">
              YOU ARE ABOUT TO MINT A NEW TOKEN ON THE ETHEREUM NETWORK. THIS ACTION IS IRREVERSIBLE. 
              ESTIMATED GAS: <span className="text-emerald-400 font-bold">0.005 ETH</span>.
            </p>
          </div>
        </div>

        {/* Form Area */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Issue Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. POTHOLE_MAIN_ST"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-xs font-mono focus:border-cyan-500 outline-none transition-all uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Location</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. MAIN ST & 5TH AVE, WARD 3"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-xs font-mono focus:border-cyan-500 outline-none transition-all uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Issue Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="DESCRIBE THE ISSUE IN DETAIL..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-xs font-mono focus:border-cyan-500 outline-none transition-all uppercase resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Urgency Level</label>
              <button 
                onClick={getAIUrgencyAssessment}
                disabled={!title || isEstimating}
                className="flex items-center gap-1 text-[10px] font-mono text-cyan-500 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isEstimating ? <Sparkles size={12} className="animate-spin" /> : <Zap size={12} fill="currentColor" />}
                {isEstimating ? 'AI ANALYZING...' : 'GET AI ASSESSMENT'}
              </button>
            </div>
            
            {aiSuggestion && (
              <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-xl mb-4 animate-in slide-in-from-top duration-300">
                <p className="text-[10px] font-mono text-cyan-400 leading-tight">
                  <span className="font-bold">AI ASSESSMENT:</span> {aiSuggestion}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {(['Low', 'Medium', 'High'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase transition-all ${
                    urgency === level
                      ? level === 'High'
                        ? 'bg-red-500 text-white border-2 border-red-500'
                        : level === 'Medium'
                        ? 'bg-orange-500 text-white border-2 border-orange-500'
                        : 'bg-yellow-500 text-black border-2 border-yellow-500'
                      : 'bg-zinc-900 text-zinc-500 border-2 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Gas Fee UX Indicator */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
             <div className="flex items-center gap-2">
               <span className="text-lg">😎</span>
               <span className="text-[10px] font-mono text-zinc-500 uppercase">Network Status: <span className="text-emerald-400">Low Congestion</span></span>
             </div>
             <span className="text-[10px] font-mono text-zinc-400">GAS: 12 GWEI</span>
          </div>

          <div className="pt-6">
            <button 
              disabled={!file || !title || isMinting || !walletAddress || chainId !== 11155111}
              onClick={handleMint}
              className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className={`py-6 font-black text-2xl transition-all duration-300 flex items-center justify-center gap-4 border-2 border-transparent ${
                isMinting ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black hover:bg-cyan-500 hover:scale-[1.02]'
              }`}>
                <span className="inline-block">
                  {isMinting ? mintProgress?.message || 'UPLOADING...' : 'UPLOAD EVIDENCE'}
                </span>
                {!isMinting && <Zap size={24} fill="currentColor" className="group-hover:animate-pulse" />}
              </div>
              {isMinting && (
                <div className="absolute inset-0 bg-white/10 opacity-50 animate-pulse"></div>
              )}
            </button>
            {!walletAddress && (
              <p className="text-center text-xs font-mono text-zinc-500 mt-3 uppercase">
                Connect wallet to upload evidence
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
