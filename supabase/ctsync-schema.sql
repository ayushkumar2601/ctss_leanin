-- =====================================================
-- CTsync Database Schema
-- Public Issue Evidence Ledger
-- =====================================================

-- Drop existing tables if they exist (for fresh start)
DROP TABLE IF EXISTS public.issue_comments CASCADE;
DROP TABLE IF EXISTS public.issue_status_history CASCADE;
DROP TABLE IF EXISTS public.issues CASCADE;

-- =====================================================
-- ISSUES TABLE (Main Evidence Records)
-- =====================================================
CREATE TABLE public.issues (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id TEXT NOT NULL UNIQUE, -- Token ID from blockchain
  
  -- Blockchain data
  contract_address TEXT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 11155111, -- Sepolia testnet
  mint_tx_hash TEXT NOT NULL,
  
  -- Issue details
  title TEXT NOT NULL,
  description TEXT,
  location TEXT, -- Geographic location (e.g., "Main St & 5th Ave, Ward 3")
  
  -- Classification
  category TEXT DEFAULT 'Infrastructure', -- Infrastructure, Public Safety, Environmental, etc.
  urgency TEXT NOT NULL DEFAULT 'Medium', -- Low, Medium, High
  status TEXT NOT NULL DEFAULT 'Open', -- Open, Under Review, Resolved
  
  -- AI Analysis
  ai_confidence INTEGER, -- 0-100 confidence score
  ai_severity_assessment TEXT, -- AI's assessment of severity
  
  -- Media
  image_url TEXT NOT NULL, -- IPFS URL
  metadata_uri TEXT, -- IPFS metadata URL
  
  -- Submission info
  submitted_by TEXT NOT NULL, -- Wallet address
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Status tracking
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT, -- Admin wallet address
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT, -- Admin wallet address
  resolution_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ISSUE STATUS HISTORY (Audit Trail)
-- =====================================================
CREATE TABLE public.issue_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  
  -- Status change details
  old_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  changed_by TEXT NOT NULL, -- Wallet address
  change_reason TEXT,
  
  -- Blockchain proof (if applicable)
  tx_hash TEXT,
  
  -- Timestamp
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ISSUE COMMENTS (Optional - for future use)
-- =====================================================
CREATE TABLE public.issue_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  
  -- Comment details
  comment_text TEXT NOT NULL,
  commenter_wallet TEXT NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Issues table indexes
CREATE INDEX idx_issues_evidence_id ON public.issues(evidence_id);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_issues_urgency ON public.issues(urgency);
CREATE INDEX idx_issues_category ON public.issues(category);
CREATE INDEX idx_issues_submitted_by ON public.issues(submitted_by);
CREATE INDEX idx_issues_submitted_at ON public.issues(submitted_at DESC);
CREATE INDEX idx_issues_location ON public.issues(location);
CREATE INDEX idx_issues_chain_id ON public.issues(chain_id);

-- Status history indexes
CREATE INDEX idx_status_history_issue_id ON public.issue_status_history(issue_id);
CREATE INDEX idx_status_history_changed_at ON public.issue_status_history(changed_at DESC);

-- Comments indexes
CREATE INDEX idx_comments_issue_id ON public.issue_comments(issue_id);
CREATE INDEX idx_comments_created_at ON public.issue_comments(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;

-- Issues: Public read access (anyone can view)
CREATE POLICY "Issues are viewable by everyone"
  ON public.issues
  FOR SELECT
  USING (true);

-- Issues: Authenticated users can insert (upload evidence)
CREATE POLICY "Authenticated users can upload evidence"
  ON public.issues
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Issues: Only submitter or admin can update
CREATE POLICY "Submitter or admin can update issues"
  ON public.issues
  FOR UPDATE
  USING (
    submitted_by = auth.jwt() ->> 'wallet_address' 
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Status History: Public read access
CREATE POLICY "Status history is viewable by everyone"
  ON public.issue_status_history
  FOR SELECT
  USING (true);

-- Status History: Only admins can insert
CREATE POLICY "Only admins can add status history"
  ON public.issue_status_history
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Comments: Public read access
CREATE POLICY "Comments are viewable by everyone"
  ON public.issue_comments
  FOR SELECT
  USING (true);

-- Comments: Authenticated users can insert
CREATE POLICY "Authenticated users can comment"
  ON public.issue_comments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for issues table
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for comments table
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.issue_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create status history on status change
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.issue_status_history (
      issue_id,
      old_status,
      new_status,
      changed_by,
      change_reason
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NEW.resolved_by, -- or reviewed_by depending on context
      NEW.resolution_notes
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log status changes
CREATE TRIGGER log_issue_status_change
  AFTER UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION log_status_change();

-- =====================================================
-- VIEWS for Common Queries
-- =====================================================

-- View: Open issues only
CREATE OR REPLACE VIEW public.open_issues AS
SELECT * FROM public.issues
WHERE status = 'Open'
ORDER BY submitted_at DESC;

-- View: High urgency issues
CREATE OR REPLACE VIEW public.urgent_issues AS
SELECT * FROM public.issues
WHERE urgency = 'High' AND status != 'Resolved'
ORDER BY submitted_at DESC;

-- View: Recently resolved issues
CREATE OR REPLACE VIEW public.recently_resolved AS
SELECT * FROM public.issues
WHERE status = 'Resolved'
ORDER BY resolved_at DESC
LIMIT 50;

-- View: Issue statistics by category
CREATE OR REPLACE VIEW public.issue_stats_by_category AS
SELECT 
  category,
  COUNT(*) as total_issues,
  COUNT(*) FILTER (WHERE status = 'Open') as open_count,
  COUNT(*) FILTER (WHERE status = 'Under Review') as under_review_count,
  COUNT(*) FILTER (WHERE status = 'Resolved') as resolved_count,
  COUNT(*) FILTER (WHERE urgency = 'High') as high_urgency_count
FROM public.issues
GROUP BY category;

-- View: Issue statistics by urgency
CREATE OR REPLACE VIEW public.issue_stats_by_urgency AS
SELECT 
  urgency,
  COUNT(*) as total_issues,
  COUNT(*) FILTER (WHERE status = 'Open') as open_count,
  COUNT(*) FILTER (WHERE status = 'Resolved') as resolved_count
FROM public.issues
GROUP BY urgency;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample issues (uncomment to use)
/*
INSERT INTO public.issues (
  evidence_id,
  contract_address,
  chain_id,
  mint_tx_hash,
  title,
  description,
  location,
  category,
  urgency,
  status,
  ai_confidence,
  image_url,
  metadata_uri,
  submitted_by
) VALUES
(
  '1',
  '0x1234567890123456789012345678901234567890',
  11155111,
  '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  'POTHOLE_MAIN_ST',
  'Large pothole causing traffic hazard on Main Street near 5th Avenue intersection',
  'Main St & 5th Ave, Ward 3',
  'Infrastructure',
  'High',
  'Open',
  85,
  'ipfs://QmExample123...',
  'ipfs://QmMetadata123...',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
),
(
  '2',
  '0x1234567890123456789012345678901234567890',
  11155111,
  '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  'BROKEN_STREETLIGHT',
  'Streetlight out for 2 weeks, creating safety concern',
  'Park Ave & 3rd St, Ward 2',
  'Public Safety',
  'Medium',
  'Under Review',
  72,
  'ipfs://QmExample456...',
  'ipfs://QmMetadata456...',
  '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
);
*/

-- =====================================================
-- GRANTS (Adjust based on your Supabase setup)
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT ON public.issues TO authenticated;
GRANT SELECT ON public.issues TO anon;
GRANT INSERT ON public.issues TO authenticated;
GRANT INSERT ON public.issues TO anon;

GRANT SELECT ON public.issue_status_history TO authenticated;
GRANT SELECT ON public.issue_status_history TO anon;

GRANT SELECT ON public.issue_comments TO authenticated;
GRANT SELECT ON public.issue_comments TO anon;
GRANT INSERT ON public.issue_comments TO authenticated;
GRANT INSERT ON public.issue_comments TO anon;

-- Grant access to views
GRANT SELECT ON public.open_issues TO authenticated;
GRANT SELECT ON public.open_issues TO anon;
GRANT SELECT ON public.urgent_issues TO authenticated;
GRANT SELECT ON public.urgent_issues TO anon;
GRANT SELECT ON public.recently_resolved TO authenticated;
GRANT SELECT ON public.recently_resolved TO anon;
GRANT SELECT ON public.issue_stats_by_category TO authenticated;
GRANT SELECT ON public.issue_stats_by_category TO anon;
GRANT SELECT ON public.issue_stats_by_urgency TO authenticated;
GRANT SELECT ON public.issue_stats_by_urgency TO anon;

-- =====================================================
-- NOTES
-- =====================================================

/*
MIGRATION FROM OLD SCHEMA:

If you have existing NFT data, you can migrate it with:

INSERT INTO public.issues (
  evidence_id,
  contract_address,
  chain_id,
  mint_tx_hash,
  title,
  description,
  urgency,
  status,
  image_url,
  metadata_uri,
  submitted_by,
  submitted_at
)
SELECT 
  token_id as evidence_id,
  contract_address,
  chain_id,
  mint_tx_hash,
  name as title,
  description,
  'Medium' as urgency, -- Default urgency
  'Open' as status, -- Default status
  image_url,
  metadata_uri,
  owner_wallet as submitted_by,
  minted_at as submitted_at
FROM public.nfts;

ADMIN WALLET CONFIGURATION:

To set up admin access, you'll need to configure your Supabase Auth
to include a custom claim for admin role. Alternatively, you can
check wallet addresses directly in your application code.

Example admin check in application:
const ADMIN_WALLET = '0xYourAdminWalletAddress';
const isAdmin = walletAddress?.toLowerCase() === ADMIN_WALLET.toLowerCase();
*/
