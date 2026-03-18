-- 003_fleet_registry.sql
-- OpenClaw Manager: Fleet Registry + Skills Registry
-- Executar via: bun bridge.js migrate

-- Fleet Registry
CREATE TABLE IF NOT EXISTS openclaw_fleet (
  claw_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claw_name TEXT NOT NULL UNIQUE,
  owner_name TEXT NOT NULL,
  owner_email TEXT,
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'provisioning'
    CHECK (status IN ('provisioning', 'active', 'inactive', 'error', 'retired')),
  supabase_project_ref TEXT,
  vps_host TEXT,
  setup_completed_at TIMESTAMPTZ,
  skills_count INTEGER DEFAULT 0,
  last_health_check TIMESTAMPTZ,
  last_health_status TEXT
    CHECK (last_health_status IN ('healthy', 'degraded', 'offline', 'idle', 'error')),
  integrations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fleet_status ON openclaw_fleet(status);
CREATE INDEX IF NOT EXISTS idx_fleet_owner ON openclaw_fleet(owner_name);

-- Skills Registry
CREATE TABLE IF NOT EXISTS openclaw_skills (
  skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claw_id UUID NOT NULL REFERENCES openclaw_fleet(claw_id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_slug TEXT NOT NULL,
  skill_type TEXT NOT NULL
    CHECK (skill_type IN ('heartbeat', 'cron', 'on-demand', 'event-driven')),
  version TEXT DEFAULT '1.0.0',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'error', 'retired', 'deploying')),
  config_path TEXT,
  deployed_at TIMESTAMPTZ DEFAULT now(),
  last_execution TIMESTAMPTZ,
  execution_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_skills_slug_claw ON openclaw_skills(skill_slug, claw_id);
CREATE INDEX IF NOT EXISTS idx_skills_claw ON openclaw_skills(claw_id);
CREATE INDEX IF NOT EXISTS idx_skills_status ON openclaw_skills(status);

-- Updated_at trigger function (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_fleet_updated_at
  BEFORE UPDATE ON openclaw_fleet
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_skills_updated_at
  BEFORE UPDATE ON openclaw_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
