-- ============================================================
-- MyRehab SaaS Medical Rehabilitation Platform
-- Initial Schema Migration
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: organizations
-- ============================================================
CREATE TABLE "organizations" (
    "id"                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"                TEXT        NOT NULL,
    "slug"                TEXT        UNIQUE NOT NULL,
    "logo_url"            TEXT,
    "subscription_tier"   TEXT        NOT NULL DEFAULT 'starter',
    "subscription_status" TEXT        NOT NULL DEFAULT 'trial',
    "trial_ends_at"       TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
    "max_doctors"         INT         NOT NULL DEFAULT 3,
    "max_patients"        INT         NOT NULL DEFAULT 20,
    "settings"            JSONB       NOT NULL DEFAULT '{}',
    "created_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: profiles
-- ============================================================
CREATE TABLE "profiles" (
    "id"              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "organization_id" UUID        REFERENCES "organizations"("id") ON DELETE SET NULL,
    "role"            TEXT        NOT NULL DEFAULT 'patient'
                                  CHECK ("role" IN ('super_admin', 'admin', 'doctor', 'patient')),
    "name"            TEXT        NOT NULL,
    "phone"           TEXT,
    "avatar_url"      TEXT,
    "is_active"       BOOLEAN     NOT NULL DEFAULT TRUE,
    "telegram_chat_id" TEXT,
    "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: doctors
-- ============================================================
CREATE TABLE "doctors" (
    "id"                UUID           PRIMARY KEY REFERENCES "profiles"("id") ON DELETE CASCADE,
    "organization_id"   UUID           NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "specialization"    TEXT,
    "license_number"    TEXT,
    "experience_years"  INT,
    "bio"               TEXT,
    "consultation_fee"  DECIMAL(10,2),
    "working_hours"     JSONB
);

-- ============================================================
-- TABLE: patients
-- ============================================================
CREATE TABLE "patients" (
    "id"                  UUID           PRIMARY KEY REFERENCES "profiles"("id") ON DELETE CASCADE,
    "organization_id"     UUID           NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "date_of_birth"       DATE,
    "gender"              TEXT           CHECK ("gender" IN ('male', 'female')),
    "blood_type"          TEXT,
    "height_cm"           DECIMAL(5,2),
    "weight_kg"           DECIMAL(5,2),
    "allergies"           TEXT[]         NOT NULL DEFAULT '{}',
    "emergency_contact"   JSONB,
    "assigned_doctor_id"  UUID           REFERENCES "doctors"("id") ON DELETE SET NULL,
    "diagnosis_primary"   TEXT,
    "diagnosis_icd10"     TEXT[]         NOT NULL DEFAULT '{}'
);

-- ============================================================
-- TABLE: icd10_codes
-- ============================================================
CREATE TABLE "icd10_codes" (
    "code"            TEXT    PRIMARY KEY,
    "description_uz"  TEXT,
    "description_ru"  TEXT    NOT NULL,
    "description_en"  TEXT,
    "category"        TEXT    NOT NULL,
    "chapter"         TEXT    NOT NULL
);

-- ============================================================
-- TABLE: medical_records
-- ============================================================
CREATE TABLE "medical_records" (
    "id"                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "patient_id"            UUID        NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
    "doctor_id"             UUID        NOT NULL REFERENCES "doctors"("id") ON DELETE RESTRICT,
    "organization_id"       UUID        NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "visit_date"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "chief_complaint"       TEXT,
    "anamnesis"             TEXT,
    "objective_data"        TEXT,
    "diagnosis_codes"       TEXT[]      NOT NULL DEFAULT '{}',
    "diagnosis_description" TEXT,
    "treatment_plan"        TEXT,
    "prescriptions"         JSONB       NOT NULL DEFAULT '[]',
    "voice_transcript"      TEXT,
    "attachments"           TEXT[]      NOT NULL DEFAULT '{}',
    "follow_up_date"        DATE,
    "status"                TEXT        NOT NULL DEFAULT 'draft'
                                        CHECK ("status" IN ('draft', 'completed')),
    "created_at"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: appointments
-- ============================================================
CREATE TABLE "appointments" (
    "id"                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "patient_id"         UUID        NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
    "doctor_id"          UUID        NOT NULL REFERENCES "doctors"("id") ON DELETE RESTRICT,
    "organization_id"    UUID        NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "scheduled_at"       TIMESTAMPTZ NOT NULL,
    "duration_minutes"   INT         NOT NULL DEFAULT 30,
    "type"               TEXT        NOT NULL DEFAULT 'in_person'
                                     CHECK ("type" IN ('in_person', 'video')),
    "status"             TEXT        NOT NULL DEFAULT 'scheduled'
                                     CHECK ("status" IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    "reason"             TEXT,
    "notes"              TEXT,
    "video_room_url"     TEXT,
    "telegram_notified"  BOOLEAN     NOT NULL DEFAULT FALSE,
    "created_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: exercises
-- ============================================================
CREATE TABLE "exercises" (
    "id"               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    "organization_id"  UUID    REFERENCES "organizations"("id") ON DELETE CASCADE,  -- NULL = global
    "name"             TEXT    NOT NULL,
    "description"      TEXT,
    "video_url"        TEXT,
    "thumbnail_url"    TEXT,
    "category"         TEXT    CHECK ("category" IN ('strength', 'flexibility', 'cardio', 'balance', 'coordination')),
    "difficulty"       TEXT    CHECK ("difficulty" IN ('beginner', 'intermediate', 'advanced')),
    "duration_minutes" INT,
    "muscle_groups"    TEXT[]  NOT NULL DEFAULT '{}',
    "instructions"     TEXT[]  NOT NULL DEFAULT '{}',
    "created_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: rehab_plans
-- ============================================================
CREATE TABLE "rehab_plans" (
    "id"               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    "patient_id"       UUID    NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
    "doctor_id"        UUID    NOT NULL REFERENCES "doctors"("id") ON DELETE RESTRICT,
    "organization_id"  UUID    NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "name"             TEXT    NOT NULL,
    "description"      TEXT,
    "diagnosis_codes"  TEXT[]  NOT NULL DEFAULT '{}',
    "start_date"       DATE    NOT NULL,
    "end_date"         DATE,
    "status"           TEXT    NOT NULL DEFAULT 'active'
                               CHECK ("status" IN ('active', 'completed', 'paused', 'cancelled')),
    "created_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: plan_exercises
-- ============================================================
CREATE TABLE "plan_exercises" (
    "id"                  UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
    "plan_id"             UUID  NOT NULL REFERENCES "rehab_plans"("id") ON DELETE CASCADE,
    "exercise_id"         UUID  NOT NULL REFERENCES "exercises"("id") ON DELETE RESTRICT,
    "sets"                INT,
    "reps"                INT,
    "duration_seconds"    INT,
    "frequency_per_week"  INT,
    "day_of_week"         INT[] NOT NULL DEFAULT '{}',
    "notes"               TEXT,
    "order_index"         INT   NOT NULL DEFAULT 0
);

-- ============================================================
-- TABLE: exercise_logs
-- ============================================================
CREATE TABLE "exercise_logs" (
    "id"                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "plan_exercise_id"  UUID        NOT NULL REFERENCES "plan_exercises"("id") ON DELETE CASCADE,
    "patient_id"        UUID        NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
    "completed_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "sets_completed"    INT,
    "reps_completed"    INT,
    "duration_seconds"  INT,
    "pain_level"        INT         CHECK ("pain_level" BETWEEN 0 AND 10),
    "notes"             TEXT,
    "date"              DATE        NOT NULL DEFAULT CURRENT_DATE
);

-- ============================================================
-- TABLE: vitals
-- ============================================================
CREATE TABLE "vitals" (
    "id"                       UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    "patient_id"               UUID           NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
    "recorded_by"              UUID           REFERENCES "profiles"("id") ON DELETE SET NULL,
    "recorded_at"              TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "heart_rate"               INT,
    "blood_pressure_systolic"  INT,
    "blood_pressure_diastolic" INT,
    "temperature_celsius"      DECIMAL(4,2),
    "oxygen_saturation"        INT,
    "weight_kg"                DECIMAL(5,2),
    "pain_level"               INT            CHECK ("pain_level" BETWEEN 0 AND 10),
    "notes"                    TEXT
);

-- ============================================================
-- TABLE: symptom_logs
-- ============================================================
CREATE TABLE "symptom_logs" (
    "id"             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "patient_id"     UUID        NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
    "logged_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "symptoms"       JSONB       NOT NULL DEFAULT '[]',
    "pain_location"  TEXT,
    "pain_level"     INT         CHECK ("pain_level" BETWEEN 0 AND 10),
    "description"    TEXT
);

-- ============================================================
-- TABLE: lab_results
-- ============================================================
CREATE TABLE "lab_results" (
    "id"              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "patient_id"      UUID        NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
    "ordered_by"      UUID        NOT NULL REFERENCES "doctors"("id") ON DELETE RESTRICT,
    "organization_id" UUID        NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "test_name"       TEXT        NOT NULL,
    "test_code"       TEXT,
    "results"         JSONB       NOT NULL DEFAULT '[]',
    "status"          TEXT        NOT NULL DEFAULT 'pending'
                                  CHECK ("status" IN ('pending', 'in_progress', 'completed')),
    "ordered_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "completed_at"    TIMESTAMPTZ,
    "notes"           TEXT
);

-- ============================================================
-- TABLE: inventory_items
-- ============================================================
CREATE TABLE "inventory_items" (
    "id"               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    "organization_id"  UUID           NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "name"             TEXT           NOT NULL,
    "category"         TEXT           CHECK ("category" IN ('medication', 'consumable', 'equipment')),
    "unit"             TEXT           NOT NULL DEFAULT 'pcs',
    "quantity"         DECIMAL(10,3)  NOT NULL DEFAULT 0,
    "min_quantity"     DECIMAL(10,3)  NOT NULL DEFAULT 0,
    "unit_price"       DECIMAL(10,2),
    "supplier"         TEXT,
    "expiry_date"      DATE,
    "barcode"          TEXT,
    "created_at"       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "updated_at"       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: inventory_usage
-- ============================================================
CREATE TABLE "inventory_usage" (
    "id"                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    "inventory_item_id" UUID           NOT NULL REFERENCES "inventory_items"("id") ON DELETE RESTRICT,
    "organization_id"   UUID           NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "used_by"           UUID           REFERENCES "profiles"("id") ON DELETE SET NULL,
    "patient_id"        UUID           REFERENCES "patients"("id") ON DELETE SET NULL,
    "quantity"          DECIMAL(10,3)  NOT NULL,
    "reason"            TEXT,
    "used_at"           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: analytics_events
-- ============================================================
CREATE TABLE "analytics_events" (
    "id"              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "organization_id" UUID        REFERENCES "organizations"("id") ON DELETE SET NULL,
    "user_id"         UUID        REFERENCES "profiles"("id") ON DELETE SET NULL,
    "event_type"      TEXT        NOT NULL,
    "source"          TEXT,
    "campaign"        TEXT,
    "properties"      JSONB       NOT NULL DEFAULT '{}',
    "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE "notifications" (
    "id"         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id"    UUID        NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
    "type"       TEXT        NOT NULL,
    "title"      TEXT        NOT NULL,
    "body"       TEXT,
    "data"       JSONB       NOT NULL DEFAULT '{}',
    "is_read"    BOOLEAN     NOT NULL DEFAULT FALSE,
    "sent_via"   TEXT[]      NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: dmed_sync_logs
-- ============================================================
CREATE TABLE "dmed_sync_logs" (
    "id"              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "organization_id" UUID        NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "record_type"     TEXT        NOT NULL,
    "record_id"       UUID        NOT NULL,
    "dmed_id"         TEXT,
    "sync_status"     TEXT        NOT NULL DEFAULT 'pending'
                                  CHECK ("sync_status" IN ('pending', 'synced', 'failed', 'skipped')),
    "last_synced_at"  TIMESTAMPTZ,
    "error_message"   TEXT,
    "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIGGER: auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION "fn_set_updated_at"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply updated_at trigger to all tables that have the column
CREATE TRIGGER "trg_organizations_updated_at"
    BEFORE UPDATE ON "organizations"
    FOR EACH ROW EXECUTE FUNCTION "fn_set_updated_at"();

CREATE TRIGGER "trg_profiles_updated_at"
    BEFORE UPDATE ON "profiles"
    FOR EACH ROW EXECUTE FUNCTION "fn_set_updated_at"();

CREATE TRIGGER "trg_medical_records_updated_at"
    BEFORE UPDATE ON "medical_records"
    FOR EACH ROW EXECUTE FUNCTION "fn_set_updated_at"();

CREATE TRIGGER "trg_appointments_updated_at"
    BEFORE UPDATE ON "appointments"
    FOR EACH ROW EXECUTE FUNCTION "fn_set_updated_at"();

CREATE TRIGGER "trg_rehab_plans_updated_at"
    BEFORE UPDATE ON "rehab_plans"
    FOR EACH ROW EXECUTE FUNCTION "fn_set_updated_at"();

CREATE TRIGGER "trg_inventory_items_updated_at"
    BEFORE UPDATE ON "inventory_items"
    FOR EACH ROW EXECUTE FUNCTION "fn_set_updated_at"();

-- ============================================================
-- INDEXES
-- ============================================================

-- organizations
CREATE INDEX "idx_organizations_slug"      ON "organizations"("slug");
CREATE INDEX "idx_organizations_created_at" ON "organizations"("created_at");

-- profiles
CREATE INDEX "idx_profiles_organization_id"            ON "profiles"("organization_id");
CREATE INDEX "idx_profiles_role"                       ON "profiles"("role");
CREATE INDEX "idx_profiles_organization_id_created_at" ON "profiles"("organization_id", "created_at");

-- doctors
CREATE INDEX "idx_doctors_organization_id" ON "doctors"("organization_id");

-- patients
CREATE INDEX "idx_patients_organization_id"            ON "patients"("organization_id");
CREATE INDEX "idx_patients_assigned_doctor_id"         ON "patients"("assigned_doctor_id");
CREATE INDEX "idx_patients_organization_id_created_at" ON "patients"("organization_id");  -- patients has no created_at, index org only

-- icd10_codes: full-text search across all description columns
CREATE INDEX "idx_icd10_codes_fts"
    ON "icd10_codes"
    USING gin(
        to_tsvector('simple',
            COALESCE("description_ru", '') || ' ' ||
            COALESCE("description_en", '') || ' ' ||
            COALESCE("description_uz", '') || ' ' ||
            "code"
        )
    );
CREATE INDEX "idx_icd10_codes_category" ON "icd10_codes"("category");
CREATE INDEX "idx_icd10_codes_chapter"  ON "icd10_codes"("chapter");

-- medical_records
CREATE INDEX "idx_medical_records_patient_id"            ON "medical_records"("patient_id");
CREATE INDEX "idx_medical_records_doctor_id"             ON "medical_records"("doctor_id");
CREATE INDEX "idx_medical_records_organization_id"       ON "medical_records"("organization_id");
CREATE INDEX "idx_medical_records_organization_created"  ON "medical_records"("organization_id", "created_at");
CREATE INDEX "idx_medical_records_visit_date"            ON "medical_records"("visit_date");

-- appointments
CREATE INDEX "idx_appointments_patient_id"           ON "appointments"("patient_id");
CREATE INDEX "idx_appointments_doctor_id"            ON "appointments"("doctor_id");
CREATE INDEX "idx_appointments_organization_id"      ON "appointments"("organization_id");
CREATE INDEX "idx_appointments_organization_created" ON "appointments"("organization_id", "created_at");
CREATE INDEX "idx_appointments_scheduled_at"         ON "appointments"("scheduled_at");
CREATE INDEX "idx_appointments_status"               ON "appointments"("status");

-- exercises
CREATE INDEX "idx_exercises_organization_id" ON "exercises"("organization_id");
CREATE INDEX "idx_exercises_category"        ON "exercises"("category");

-- rehab_plans
CREATE INDEX "idx_rehab_plans_patient_id"            ON "rehab_plans"("patient_id");
CREATE INDEX "idx_rehab_plans_doctor_id"             ON "rehab_plans"("doctor_id");
CREATE INDEX "idx_rehab_plans_organization_id"       ON "rehab_plans"("organization_id");
CREATE INDEX "idx_rehab_plans_organization_created"  ON "rehab_plans"("organization_id", "created_at");
CREATE INDEX "idx_rehab_plans_status"                ON "rehab_plans"("status");

-- plan_exercises
CREATE INDEX "idx_plan_exercises_plan_id"     ON "plan_exercises"("plan_id");
CREATE INDEX "idx_plan_exercises_exercise_id" ON "plan_exercises"("exercise_id");

-- exercise_logs
CREATE INDEX "idx_exercise_logs_plan_exercise_id" ON "exercise_logs"("plan_exercise_id");
CREATE INDEX "idx_exercise_logs_patient_id"       ON "exercise_logs"("patient_id");
CREATE INDEX "idx_exercise_logs_date"             ON "exercise_logs"("date");

-- vitals
CREATE INDEX "idx_vitals_patient_id"   ON "vitals"("patient_id");
CREATE INDEX "idx_vitals_recorded_at"  ON "vitals"("recorded_at");
CREATE INDEX "idx_vitals_recorded_by"  ON "vitals"("recorded_by");

-- symptom_logs
CREATE INDEX "idx_symptom_logs_patient_id" ON "symptom_logs"("patient_id");
CREATE INDEX "idx_symptom_logs_logged_at"  ON "symptom_logs"("logged_at");

-- lab_results
CREATE INDEX "idx_lab_results_patient_id"            ON "lab_results"("patient_id");
CREATE INDEX "idx_lab_results_ordered_by"            ON "lab_results"("ordered_by");
CREATE INDEX "idx_lab_results_organization_id"       ON "lab_results"("organization_id");
CREATE INDEX "idx_lab_results_organization_created"  ON "lab_results"("organization_id", "ordered_at");
CREATE INDEX "idx_lab_results_status"                ON "lab_results"("status");

-- inventory_items
CREATE INDEX "idx_inventory_items_organization_id"      ON "inventory_items"("organization_id");
CREATE INDEX "idx_inventory_items_organization_created" ON "inventory_items"("organization_id", "created_at");
CREATE INDEX "idx_inventory_items_category"             ON "inventory_items"("category");
CREATE INDEX "idx_inventory_items_barcode"              ON "inventory_items"("barcode");

-- inventory_usage
CREATE INDEX "idx_inventory_usage_inventory_item_id" ON "inventory_usage"("inventory_item_id");
CREATE INDEX "idx_inventory_usage_organization_id"   ON "inventory_usage"("organization_id");
CREATE INDEX "idx_inventory_usage_patient_id"        ON "inventory_usage"("patient_id");
CREATE INDEX "idx_inventory_usage_used_by"           ON "inventory_usage"("used_by");
CREATE INDEX "idx_inventory_usage_used_at"           ON "inventory_usage"("used_at");

-- analytics_events
CREATE INDEX "idx_analytics_events_organization_id"      ON "analytics_events"("organization_id");
CREATE INDEX "idx_analytics_events_user_id"              ON "analytics_events"("user_id");
CREATE INDEX "idx_analytics_events_event_type"           ON "analytics_events"("event_type");
CREATE INDEX "idx_analytics_events_organization_created" ON "analytics_events"("organization_id", "created_at");

-- notifications
CREATE INDEX "idx_notifications_user_id"    ON "notifications"("user_id");
CREATE INDEX "idx_notifications_is_read"    ON "notifications"("is_read");
CREATE INDEX "idx_notifications_created_at" ON "notifications"("created_at");

-- dmed_sync_logs
CREATE INDEX "idx_dmed_sync_logs_organization_id"      ON "dmed_sync_logs"("organization_id");
CREATE INDEX "idx_dmed_sync_logs_record_id"            ON "dmed_sync_logs"("record_id");
CREATE INDEX "idx_dmed_sync_logs_sync_status"          ON "dmed_sync_logs"("sync_status");
CREATE INDEX "idx_dmed_sync_logs_organization_created" ON "dmed_sync_logs"("organization_id", "created_at");

-- ============================================================
-- ROW LEVEL SECURITY: Enable on all tables
-- ============================================================
ALTER TABLE "organizations"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "doctors"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "patients"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "icd10_codes"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "medical_records"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "appointments"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "exercises"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rehab_plans"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "plan_exercises"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "exercise_logs"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vitals"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "symptom_logs"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lab_results"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inventory_items"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inventory_usage"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "analytics_events"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "dmed_sync_logs"    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER: reusable org-match expression embedded in each policy
-- A user matches if they share the same organization OR are super_admin
-- ============================================================

-- ============================================================
-- RLS POLICIES: organizations
-- ============================================================
CREATE POLICY "organizations_select"
    ON "organizations" FOR SELECT
    TO authenticated
    USING (
        "id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "organizations_insert"
    ON "organizations" FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "organizations_update"
    ON "organizations" FOR UPDATE
    TO authenticated
    USING (
        "id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "organizations_delete"
    ON "organizations" FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: profiles
-- ============================================================
CREATE POLICY "profiles_select"
    ON "profiles" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR "id" = auth.uid()
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "profiles_insert"
    ON "profiles" FOR INSERT
    TO authenticated
    WITH CHECK (
        "id" = auth.uid()
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" IN ('super_admin', 'admin'))
    );

CREATE POLICY "profiles_update"
    ON "profiles" FOR UPDATE
    TO authenticated
    USING (
        "id" = auth.uid()
        OR "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "id" = auth.uid()
        OR "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "profiles_delete"
    ON "profiles" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: doctors
-- ============================================================
CREATE POLICY "doctors_select"
    ON "doctors" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "doctors_insert"
    ON "doctors" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "doctors_update"
    ON "doctors" FOR UPDATE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "doctors_delete"
    ON "doctors" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: patients
-- ============================================================
CREATE POLICY "patients_select"
    ON "patients" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "patients_insert"
    ON "patients" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "patients_update"
    ON "patients" FOR UPDATE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "patients_delete"
    ON "patients" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: icd10_codes (read-only for all authenticated)
-- ============================================================
CREATE POLICY "icd10_codes_select"
    ON "icd10_codes" FOR SELECT
    TO authenticated
    USING (true);

-- No INSERT / UPDATE / DELETE policies — only super_admin via service role

-- ============================================================
-- RLS POLICIES: medical_records
-- ============================================================
CREATE POLICY "medical_records_select"
    ON "medical_records" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "medical_records_insert"
    ON "medical_records" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "medical_records_update"
    ON "medical_records" FOR UPDATE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "medical_records_delete"
    ON "medical_records" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: appointments
-- ============================================================
CREATE POLICY "appointments_select"
    ON "appointments" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "appointments_insert"
    ON "appointments" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "appointments_update"
    ON "appointments" FOR UPDATE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "appointments_delete"
    ON "appointments" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: exercises (org-scoped or global)
-- ============================================================
CREATE POLICY "exercises_select"
    ON "exercises" FOR SELECT
    TO authenticated
    USING (
        "organization_id" IS NULL  -- global exercises visible to all
        OR "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "exercises_insert"
    ON "exercises" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "exercises_update"
    ON "exercises" FOR UPDATE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "exercises_delete"
    ON "exercises" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: rehab_plans
-- ============================================================
CREATE POLICY "rehab_plans_select"
    ON "rehab_plans" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "rehab_plans_insert"
    ON "rehab_plans" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "rehab_plans_update"
    ON "rehab_plans" FOR UPDATE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "rehab_plans_delete"
    ON "rehab_plans" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: plan_exercises (scoped via rehab_plans)
-- ============================================================
CREATE POLICY "plan_exercises_select"
    ON "plan_exercises" FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "rehab_plans" rp
            WHERE rp."id" = "plan_exercises"."plan_id"
              AND (
                  rp."organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
                  OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
              )
        )
    );

CREATE POLICY "plan_exercises_insert"
    ON "plan_exercises" FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "rehab_plans" rp
            WHERE rp."id" = "plan_exercises"."plan_id"
              AND (
                  rp."organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
                  OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
              )
        )
    );

CREATE POLICY "plan_exercises_update"
    ON "plan_exercises" FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "rehab_plans" rp
            WHERE rp."id" = "plan_exercises"."plan_id"
              AND (
                  rp."organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
                  OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
              )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "rehab_plans" rp
            WHERE rp."id" = "plan_exercises"."plan_id"
              AND (
                  rp."organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
                  OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
              )
        )
    );

CREATE POLICY "plan_exercises_delete"
    ON "plan_exercises" FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "rehab_plans" rp
            WHERE rp."id" = "plan_exercises"."plan_id"
              AND (
                  rp."organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
                  OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
              )
        )
    );

-- ============================================================
-- RLS POLICIES: exercise_logs
-- Org members can manage all; patients can only access their own rows
-- ============================================================
CREATE POLICY "exercise_logs_select"
    ON "exercise_logs" FOR SELECT
    TO authenticated
    USING (
        -- Patient sees only their own logs
        "patient_id" = auth.uid()
        -- Org staff (doctor/admin) sees all within org via plan linkage
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (
                  p."role" = 'super_admin'
                  OR EXISTS (
                      SELECT 1 FROM "patients" pat
                      WHERE pat."id" = "exercise_logs"."patient_id"
                        AND pat."organization_id" = p."organization_id"
                  )
              )
        )
    );

CREATE POLICY "exercise_logs_insert"
    ON "exercise_logs" FOR INSERT
    TO authenticated
    WITH CHECK (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (
                  p."role" = 'super_admin'
                  OR EXISTS (
                      SELECT 1 FROM "patients" pat
                      WHERE pat."id" = "exercise_logs"."patient_id"
                        AND pat."organization_id" = p."organization_id"
                  )
              )
        )
    );

CREATE POLICY "exercise_logs_update"
    ON "exercise_logs" FOR UPDATE
    TO authenticated
    USING (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (
                  p."role" = 'super_admin'
                  OR EXISTS (
                      SELECT 1 FROM "patients" pat
                      WHERE pat."id" = "exercise_logs"."patient_id"
                        AND pat."organization_id" = p."organization_id"
                  )
              )
        )
    )
    WITH CHECK (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (
                  p."role" = 'super_admin'
                  OR EXISTS (
                      SELECT 1 FROM "patients" pat
                      WHERE pat."id" = "exercise_logs"."patient_id"
                        AND pat."organization_id" = p."organization_id"
                  )
              )
        )
    );

CREATE POLICY "exercise_logs_delete"
    ON "exercise_logs" FOR DELETE
    TO authenticated
    USING (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (
                  p."role" = 'super_admin'
                  OR EXISTS (
                      SELECT 1 FROM "patients" pat
                      WHERE pat."id" = "exercise_logs"."patient_id"
                        AND pat."organization_id" = p."organization_id"
                  )
              )
        )
    );

-- ============================================================
-- RLS POLICIES: vitals
-- Patients can only access their own rows
-- ============================================================
CREATE POLICY "vitals_select"
    ON "vitals" FOR SELECT
    TO authenticated
    USING (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "patients" pat ON pat."id" = "vitals"."patient_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (p."role" = 'super_admin' OR pat."organization_id" = p."organization_id")
        )
    );

CREATE POLICY "vitals_insert"
    ON "vitals" FOR INSERT
    TO authenticated
    WITH CHECK (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "patients" pat ON pat."id" = "vitals"."patient_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (p."role" = 'super_admin' OR pat."organization_id" = p."organization_id")
        )
    );

CREATE POLICY "vitals_update"
    ON "vitals" FOR UPDATE
    TO authenticated
    USING (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "patients" pat ON pat."id" = "vitals"."patient_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (p."role" = 'super_admin' OR pat."organization_id" = p."organization_id")
        )
    )
    WITH CHECK (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "patients" pat ON pat."id" = "vitals"."patient_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (p."role" = 'super_admin' OR pat."organization_id" = p."organization_id")
        )
    );

CREATE POLICY "vitals_delete"
    ON "vitals" FOR DELETE
    TO authenticated
    USING (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "patients" pat ON pat."id" = "vitals"."patient_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (p."role" = 'super_admin' OR pat."organization_id" = p."organization_id")
        )
    );

-- ============================================================
-- RLS POLICIES: symptom_logs
-- Patients can only access their own rows
-- ============================================================
CREATE POLICY "symptom_logs_select"
    ON "symptom_logs" FOR SELECT
    TO authenticated
    USING (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "patients" pat ON pat."id" = "symptom_logs"."patient_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (p."role" = 'super_admin' OR pat."organization_id" = p."organization_id")
        )
    );

CREATE POLICY "symptom_logs_insert"
    ON "symptom_logs" FOR INSERT
    TO authenticated
    WITH CHECK (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "patients" pat ON pat."id" = "symptom_logs"."patient_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (p."role" = 'super_admin' OR pat."organization_id" = p."organization_id")
        )
    );

CREATE POLICY "symptom_logs_update"
    ON "symptom_logs" FOR UPDATE
    TO authenticated
    USING (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "patients" pat ON pat."id" = "symptom_logs"."patient_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (p."role" = 'super_admin' OR pat."organization_id" = p."organization_id")
        )
    )
    WITH CHECK (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "patients" pat ON pat."id" = "symptom_logs"."patient_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (p."role" = 'super_admin' OR pat."organization_id" = p."organization_id")
        )
    );

CREATE POLICY "symptom_logs_delete"
    ON "symptom_logs" FOR DELETE
    TO authenticated
    USING (
        "patient_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "patients" pat ON pat."id" = "symptom_logs"."patient_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('doctor', 'admin', 'super_admin')
              AND (p."role" = 'super_admin' OR pat."organization_id" = p."organization_id")
        )
    );

-- ============================================================
-- RLS POLICIES: lab_results
-- ============================================================
CREATE POLICY "lab_results_select"
    ON "lab_results" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "lab_results_insert"
    ON "lab_results" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "lab_results_update"
    ON "lab_results" FOR UPDATE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "lab_results_delete"
    ON "lab_results" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: inventory_items
-- ============================================================
CREATE POLICY "inventory_items_select"
    ON "inventory_items" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "inventory_items_insert"
    ON "inventory_items" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "inventory_items_update"
    ON "inventory_items" FOR UPDATE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "inventory_items_delete"
    ON "inventory_items" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: inventory_usage
-- ============================================================
CREATE POLICY "inventory_usage_select"
    ON "inventory_usage" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "inventory_usage_insert"
    ON "inventory_usage" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "inventory_usage_update"
    ON "inventory_usage" FOR UPDATE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "inventory_usage_delete"
    ON "inventory_usage" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: analytics_events
-- ============================================================
CREATE POLICY "analytics_events_select"
    ON "analytics_events" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "analytics_events_insert"
    ON "analytics_events" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR "organization_id" IS NULL
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "analytics_events_update"
    ON "analytics_events" FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "analytics_events_delete"
    ON "analytics_events" FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: notifications
-- Users can only access their own notifications
-- ============================================================
CREATE POLICY "notifications_select"
    ON "notifications" FOR SELECT
    TO authenticated
    USING (
        "user_id" = auth.uid()
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "notifications_insert"
    ON "notifications" FOR INSERT
    TO authenticated
    WITH CHECK (
        "user_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "profiles" p
            JOIN "profiles" target ON target."id" = "notifications"."user_id"
            WHERE p."id" = auth.uid()
              AND p."role" IN ('admin', 'doctor', 'super_admin')
              AND (p."role" = 'super_admin' OR target."organization_id" = p."organization_id")
        )
    );

CREATE POLICY "notifications_update"
    ON "notifications" FOR UPDATE
    TO authenticated
    USING (
        "user_id" = auth.uid()
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "user_id" = auth.uid()
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "notifications_delete"
    ON "notifications" FOR DELETE
    TO authenticated
    USING (
        "user_id" = auth.uid()
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

-- ============================================================
-- RLS POLICIES: dmed_sync_logs
-- ============================================================
CREATE POLICY "dmed_sync_logs_select"
    ON "dmed_sync_logs" FOR SELECT
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "dmed_sync_logs_insert"
    ON "dmed_sync_logs" FOR INSERT
    TO authenticated
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "dmed_sync_logs_update"
    ON "dmed_sync_logs" FOR UPDATE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    )
    WITH CHECK (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );

CREATE POLICY "dmed_sync_logs_delete"
    ON "dmed_sync_logs" FOR DELETE
    TO authenticated
    USING (
        "organization_id" = (SELECT "organization_id" FROM "profiles" WHERE "id" = auth.uid())
        OR EXISTS (SELECT 1 FROM "profiles" WHERE "id" = auth.uid() AND "role" = 'super_admin')
    );
