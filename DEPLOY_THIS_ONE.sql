-- =====================================================
-- CTsync - COMPLETE DATABASE SETUP
-- RUN THIS ONE FILE IN SUPABASE SQL EDITOR
-- =====================================================

-- Clean slate: Drop everything if exists
DROP TABLE IF EXISTS public.issue_comments CASCADE;
DROP TABLE IF EXISTS public.issue_status_history CASCADE;
DROP TABLE IF EXISTS public.nft_attributes CASCADE;
DROP TABLE IF EXISTS public.issues CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP VIEW IF EXISTS public.nfts CASCADE;
DROP VIEW IF EXISTS public.open_issues CASCADE;
DROP VIEW IF EXISTS public.urgent_issues CASCADE;
DROP VIEW IF EXISTS public.recently_resolved CASCADE;
DROP VIEW IF EXISTS public.issue_stats_by_category CASCADE;
DROP VIEW IF EXISTS public.issue_stats_by_urgency CASCADE;

-- =====================================================
-- MAIN ISSUES TABLE
-- =====================================================
CREATE TABLE public.issues (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id TEXT NOT NULL UNIQUE,
  
  -- Blockchain data
  contract_address TEXT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 11155111,
  mint_tx_hash TEXT NOT NULL UNIQUE,
  
  -- Issue details
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  
  -- Classification
  category TEXT DEFAULT 'Infrastructure',
  urgency TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'Open',
  
  -- AI Analysis
  ai_confidence INTEGER,
  ai_severity_assessment TEXT,
  
  -- Media
  image_url TEXT NOT NULL,
  metadata_uri TEXT,
  
  -- Submission info
  submitted_by TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Status tracking
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  resolution_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ATTRIBUTES TABLE (for NFT compatibility)
-- =====================================================
CREATE TABLE public.nft_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nft_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  trait_type TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  wallet_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- STATUS HISTORY TABLE (Audit Trail)
-- =====================================================
CREATE TABLE public.issue_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  old_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  change_reason TEXT,
  tx_hash TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- COMMENTS TABLE (Optional - for future)
-- =====================================================
CREATE TABLE public.issue_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  commenter_wallet TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_issues_evidence_id ON public.issues(evidence_id);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_issues_urgency ON public.issues(urgency);
CREATE INDEX idx_issues_category ON public.issues(category);
CREATE INDEX idx_issues_submitted_by ON public.issues(submitted_by);
CREATE INDEX idx_issues_submitted_at ON public.issues(submitted_at DESC);
CREATE INDEX idx_issues_location ON public.issues(location);
CREATE INDEX idx_issues_mint_tx_hash ON public.issues(mint_tx_hash);
CREATE INDEX idx_nft_attributes_nft_id ON public.nft_attributes(nft_id);
CREATE INDEX idx_users_wallet_address ON public.users(wallet_address);
CREATE INDEX idx_status_history_issue_id ON public.issue_status_history(issue_id);
CREATE INDEX idx_status_history_changed_at ON public.issue_status_history(changed_at DESC);
CREATE INDEX idx_comments_issue_id ON public.issue_comments(issue_id);
CREATE INDEX idx_comments_created_at ON public.issue_comments(created_at DESC);

-- =====================================================
-- BACKWARD COMPATIBILITY VIEW (CRITICAL!)
-- Maps old "nfts" table to new "issues" table
-- =====================================================
CREATE VIEW public.nfts AS
SELECT 
  id,
  evidence_id as token_id,
  contract_address,
  chain_id,
  mint_tx_hash,
  title as name,
  description,
  image_url,
  metadata_uri,
  submitted_by as owner_wallet,
  submitted_at as minted_at,
  created_at,
  updated_at
FROM public.issues;

-- =====================================================
-- HELPER VIEWS
-- =====================================================
CREATE VIEW public.open_issues AS
SELECT * FROM public.issues
WHERE status = 'Open'
ORDER BY submitted_at DESC;

CREATE VIEW public.urgent_issues AS
SELECT * FROM public.issues
WHERE urgency = 'High' AND status != 'Resolved'
ORDER BY submitted_at DESC;

CREATE VIEW public.recently_resolved AS
SELECT * FROM public.issues
WHERE status = 'Resolved'
ORDER BY resolved_at DESC
LIMIT 50;

CREATE VIEW public.issue_stats_by_category AS
SELECT 
  category,
  COUNT(*) as total_issues,
  COUNT(*) FILTER (WHERE status = 'Open') as open_count,
  COUNT(*) FILTER (WHERE status = 'Under Review') as under_review_count,
  COUNT(*) FILTER (WHERE status = 'Resolved') as resolved_count,
  COUNT(*) FILTER (WHERE urgency = 'High') as high_urgency_count
FROM public.issues
GROUP BY category;

CREATE VIEW public.issue_stats_by_urgency AS
SELECT 
  urgency,
  COUNT(*) as total_issues,
  COUNT(*) FILTER (WHERE status = 'Open') as open_count,
  COUNT(*) FILTER (WHERE status = 'Resolved') as resolved_count
FROM public.issues
GROUP BY urgency;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nft_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;

-- Issues: Everyone can view
CREATE POLICY "Issues are viewable by everyone"
  ON public.issues FOR SELECT USING (true);

-- Issues: Anyone can insert (upload evidence)
CREATE POLICY "Anyone can upload evidence"
  ON public.issues FOR INSERT WITH CHECK (true);

-- Issues: Anyone can update (for closing issues)
CREATE POLICY "Anyone can update issues"
  ON public.issues FOR UPDATE USING (true) WITH CHECK (true);

-- Attributes: Everyone can view
CREATE POLICY "Attributes are viewable by everyone"
  ON public.nft_attributes FOR SELECT USING (true);

-- Attributes: Anyone can insert
CREATE POLICY "Anyone can insert attributes"
  ON public.nft_attributes FOR INSERT WITH CHECK (true);

-- Users: Everyone can view
CREATE POLICY "Users are viewable by everyone"
  ON public.users FOR SELECT USING (true);

-- Users: Anyone can insert
CREATE POLICY "Anyone can insert users"
  ON public.users FOR INSERT WITH CHECK (true);

-- Users: Anyone can update
CREATE POLICY "Anyone can update users"
  ON public.users FOR UPDATE USING (true) WITH CHECK (true);

-- Status History: Everyone can view
CREATE POLICY "Status history is viewable by everyone"
  ON public.issue_status_history FOR SELECT USING (true);

-- Status History: Anyone can insert
CREATE POLICY "Anyone can add status history"
  ON public.issue_status_history FOR INSERT WITH CHECK (true);

-- Comments: Everyone can view
CREATE POLICY "Comments are viewable by everyone"
  ON public.issue_comments FOR SELECT USING (true);

-- Comments: Anyone can insert
CREATE POLICY "Anyone can comment"
  ON public.issue_comments FOR INSERT WITH CHECK (true);

-- =====================================================
-- GRANTS (CRITICAL FOR ACCESS!)
-- =====================================================
GRANT SELECT, INSERT, UPDATE ON public.issues TO authenticated, anon;
GRANT SELECT, INSERT ON public.nft_attributes TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated, anon;
GRANT SELECT, INSERT ON public.issue_status_history TO authenticated, anon;
GRANT SELECT, INSERT ON public.issue_comments TO authenticated, anon;
GRANT SELECT ON public.nfts TO authenticated, anon;
GRANT SELECT ON public.open_issues TO authenticated, anon;
GRANT SELECT ON public.urgent_issues TO authenticated, anon;
GRANT SELECT ON public.recently_resolved TO authenticated, anon;
GRANT SELECT ON public.issue_stats_by_category TO authenticated, anon;
GRANT SELECT ON public.issue_stats_by_urgency TO authenticated, anon;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.issue_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-log status changes
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
      COALESCE(NEW.resolved_by, NEW.reviewed_by, NEW.submitted_by),
      NEW.resolution_notes
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_issue_status_change
  AFTER UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION log_status_change();

-- =====================================================
-- DONE! 
-- =====================================================
-- Your database is now ready for CTsync!
-- 
-- Tables created:
-- ✅ issues (main evidence table)
-- ✅ nft_attributes (for metadata)
-- ✅ users (wallet tracking)
-- ✅ issue_status_history (audit trail)
-- ✅ issue_comments (future use)
-- ✅ nfts (VIEW - backward compatibility)
--
-- All RLS policies and grants configured!
-- =====================================================
