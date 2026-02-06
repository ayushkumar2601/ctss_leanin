# 🚀 Deployment Checklist - Wallet Integration

## Pre-Deployment Verification

### ✅ Build & Compile
- [x] `npm run build` succeeds
- [x] No TypeScript errors
- [x] No console errors in dev mode
- [x] All imports resolve correctly

### ✅ Environment Variables
- [ ] `.env.local` configured with:
  - `GEMINI_API_KEY` (if using AI features)
  - `VITE_CHAIN_ID=11155111` (Sepolia)
  - `VITE_CONTRACT_ADDRESS` (your NFT contract)
  - `VITE_RPC_URL` (optional, for custom RPC)

### ✅ Wallet Testing
- [ ] MetaMask connection works
- [ ] Phantom connection works
- [ ] Network validation works
- [ ] Auto-reconnect works
- [ ] Disconnect works
- [ ] Account switching works
- [ ] Network switching works
- [ ] Mobile responsive

### ✅ Error Handling
- [ ] Wallet not installed → Shows install links
- [ ] Connection rejected → Shows friendly error
- [ ] Wrong network → Shows switch button
- [ ] Locked wallet → Shows appropriate message

## Production Configuration

### 1. Network Settings

#### For Testnet (Sepolia)
```env
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

#### For Mainnet (When Ready)
```env
VITE_CHAIN_ID=1
VITE_CHAIN_NAME=Ethereum
VITE_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
```

**⚠️ IMPORTANT**: Update `SEPOLIA_CHAIN_ID` in `contexts/WalletContext.tsx` when switching to mainnet!

### 2. Smart Contract Addresses

Add to `.env.local`:
```env
VITE_NFT_CONTRACT_ADDRESS=0x...
VITE_MARKETPLACE_CONTRACT_ADDRESS=0x...
```

### 3. RPC Provider

Options:
- **Infura**: https://infura.io/
- **Alchemy**: https://www.alchemy.com/
- **QuickNode**: https://www.quicknode.com/

Get API key and add to `VITE_RPC_URL`.

## Deployment Steps

### Option 1: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Add environment variables in Netlify dashboard
```

### Option 3: GitHub Pages
```bash
# Update vite.config.ts with base path
# Build
npm run build

# Deploy to gh-pages branch
```

### Option 4: Custom Server
```bash
# Build
npm run build

# Upload dist/ folder to server
# Configure nginx/apache to serve SPA
```

## Post-Deployment Verification

### ✅ Functionality Tests
- [ ] Website loads correctly
- [ ] Wallet connection works
- [ ] Network validation works
- [ ] Transactions can be initiated
- [ ] Mobile version works
- [ ] All pages accessible

### ✅ Security Checks
- [ ] HTTPS enabled
- [ ] No private keys in code
- [ ] Environment variables secure
- [ ] Contract addresses correct
- [ ] Network ID correct

### ✅ Performance
- [ ] Page load time < 3s
- [ ] Wallet connection < 2s
- [ ] No console errors
- [ ] No memory leaks

## Mainnet Migration Checklist

### ⚠️ Before Going to Mainnet

1. **Update Network Configuration**
   ```typescript
   // In contexts/WalletContext.tsx
   const MAINNET_CHAIN_ID = 1;
   const MAINNET_PARAMS = {
     chainId: '0x1',
     chainName: 'Ethereum Mainnet',
     // ... rest of config
   };
   ```

2. **Update Contract Addresses**
   ```env
   VITE_NFT_CONTRACT_ADDRESS=0xMainnetAddress
   VITE_MARKETPLACE_CONTRACT_ADDRESS=0xMainnetAddress
   ```

3. **Test on Mainnet Fork**
   - Use Hardhat/Foundry to fork mainnet
   - Test all transactions
   - Verify gas estimates

4. **Security Audit**
   - [ ] Smart contracts audited
   - [ ] Frontend security review
   - [ ] Penetration testing
   - [ ] Bug bounty program

5. **User Communication**
   - [ ] Announce mainnet launch
   - [ ] Update documentation
   - [ ] Provide migration guide
   - [ ] Set up support channels

## Monitoring & Analytics

### Recommended Tools

#### Wallet Analytics
- **WalletConnect Analytics**: Track connections
- **Mixpanel**: User behavior
- **Google Analytics**: Page views

#### Blockchain Monitoring
- **Etherscan API**: Transaction tracking
- **The Graph**: Indexed blockchain data
- **Alchemy Notify**: Transaction webhooks

#### Error Tracking
- **Sentry**: Frontend errors
- **LogRocket**: Session replay
- **Datadog**: Performance monitoring

### Key Metrics to Track
- Wallet connection rate
- Transaction success rate
- Average gas used
- User retention
- Error frequency
- Network distribution

## Troubleshooting Guide

### Common Issues

#### 1. Wallet Not Connecting
**Symptoms**: Connection fails silently
**Solutions**:
- Check browser console for errors
- Verify wallet extension is installed
- Try different browser
- Clear browser cache

#### 2. Wrong Network
**Symptoms**: Yellow warning badge
**Solutions**:
- Click "Switch to Sepolia" button
- Manually switch in wallet
- Check network configuration

#### 3. Transaction Fails
**Symptoms**: Transaction rejected
**Solutions**:
- Check gas settings
- Verify contract address
- Ensure sufficient balance
- Check network congestion

#### 4. Auto-Reconnect Not Working
**Symptoms**: Wallet disconnects on refresh
**Solutions**:
- Check localStorage is enabled
- Verify wallet is unlocked
- Clear browser data and reconnect

## Support Resources

### Documentation
- Quick Start: `QUICKSTART_WALLET.md`
- Full Docs: `WALLET_INTEGRATION.md`
- Features: `WALLET_FEATURES.md`
- Examples: `examples/WalletIntegrationExamples.tsx`

### External Resources
- [Ethers.js Docs](https://docs.ethers.org/v6/)
- [MetaMask Docs](https://docs.metamask.io/)
- [Phantom Docs](https://docs.phantom.app/)
- [Ethereum.org](https://ethereum.org/developers)

### Community
- Discord: [Your Discord]
- Twitter: [Your Twitter]
- GitHub: [Your Repo]

## Emergency Procedures

### If Something Goes Wrong

1. **Disable Wallet Features**
   ```tsx
   // In App.tsx, temporarily remove WalletProvider
   // This will disable wallet features but keep site running
   ```

2. **Rollback Deployment**
   ```bash
   # Revert to previous version
   vercel rollback
   # or
   netlify rollback
   ```

3. **Communicate with Users**
   - Post status update
   - Provide timeline
   - Offer alternatives

## Final Checklist

### Before Launch
- [ ] All tests pass
- [ ] Documentation complete
- [ ] Environment variables set
- [ ] Smart contracts deployed
- [ ] Security review done
- [ ] Backup plan ready
- [ ] Support team briefed
- [ ] Monitoring configured
- [ ] Analytics set up
- [ ] Legal compliance checked

### Launch Day
- [ ] Deploy to production
- [ ] Verify functionality
- [ ] Monitor errors
- [ ] Watch analytics
- [ ] Respond to issues
- [ ] Collect feedback

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Address critical issues
- [ ] Gather user feedback
- [ ] Plan improvements
- [ ] Update documentation

---

**Good luck with your launch! 🚀**

Remember: Start with testnet, test thoroughly, then move to mainnet.
