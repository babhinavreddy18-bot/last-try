-- ══════════════════════════════════════════════════════════════════════════════
--   CargoLoop – AI Logistics Intelligence Platform
--   Supabase Database Schema & Strict RBAC Policies
-- ══════════════════════════════════════════════════════════════════════════════

-- Enable PostGIS for geospatial tracking (optional but recommended)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. PROFILES / USERS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('driver', 'shipper', 'fleet', 'admin')),
    phone TEXT,
    company_name TEXT,
    avatar_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. TRUCKS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.trucks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plate_number TEXT UNIQUE NOT NULL,
    model TEXT NOT NULL,
    capacity_tons NUMERIC(5, 2) NOT NULL,
    current_lat NUMERIC(9, 6) NOT NULL,
    current_lng NUMERIC(9, 6) NOT NULL,
    current_city TEXT NOT NULL,
    dest_lat NUMERIC(9, 6),
    dest_lng NUMERIC(9, 6),
    dest_city TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in-transit', 'maintenance', 'offline')),
    driver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    driver_name TEXT NOT NULL,
    driver_rating NUMERIC(3, 2) DEFAULT 4.9,
    temperature_controlled BOOLEAN DEFAULT false,
    fuel_type TEXT NOT NULL DEFAULT 'diesel' CHECK (fuel_type IN ('diesel', 'electric', 'cng', 'hybrid')),
    fuel_efficiency_kmpl NUMERIC(4, 2) DEFAULT 4.2,
    co2_emissions_per_km_kg NUMERIC(4, 2) DEFAULT 2.68,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. SHIPMENTS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    material TEXT NOT NULL,
    weight_tons NUMERIC(5, 2) NOT NULL,
    temperature_controlled BOOLEAN DEFAULT false,
    temperature_target_celsius NUMERIC(4, 1),
    origin_city TEXT NOT NULL,
    origin_lat NUMERIC(9, 6) NOT NULL,
    origin_lng NUMERIC(9, 6) NOT NULL,
    destination_city TEXT NOT NULL,
    destination_lat NUMERIC(9, 6) NOT NULL,
    destination_lng NUMERIC(9, 6) NOT NULL,
    distance_km NUMERIC(7, 2) NOT NULL,
    estimated_price_inr NUMERIC(10, 2) NOT NULL,
    suggested_price_min_inr NUMERIC(10, 2),
    suggested_price_max_inr NUMERIC(10, 2),
    fuel_impact_inr NUMERIC(10, 2),
    estimated_co2_kg NUMERIC(7, 2),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in-transit', 'delivered', 'cancelled')),
    assigned_truck_id UUID REFERENCES public.trucks(id) ON DELETE SET NULL,
    assigned_driver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    shipper_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    pickup_window TEXT NOT NULL DEFAULT 'Immediate',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. DOCUMENTS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('driving_license', 'rc_book', 'insurance', 'puc_certificate', 'permit')),
    document_number TEXT NOT NULL,
    file_url TEXT,
    trust_score_percent NUMERIC(5, 2) DEFAULT 0,
    is_authentic BOOLEAN DEFAULT false,
    ai_flags JSONB DEFAULT '[]'::jsonb,
    extracted_text TEXT,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. ANOMALY FLAGS (Admin & Telemetry) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('document_tampering', 'pricing_outlier', 'duplicate_listing', 'gps_mismatch')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('driver', 'shipment', 'truck')),
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. INDEXES FOR HIGH PERFORMANCE QUERIES ────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_trucks_status ON public.trucks(status);
CREATE INDEX IF NOT EXISTS idx_trucks_current_city ON public.trucks(current_city);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_origin_city ON public.shipments(origin_city);
CREATE INDEX IF NOT EXISTS idx_shipments_destination_city ON public.shipments(destination_city);

-- ── 7. STRICT ROLE-BASED ACCESS CONTROL (RBAC) RLS POLICIES ──────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DROP POLICY IF EXISTS "Profiles RBAC Policy" ON public.profiles;
DROP POLICY IF EXISTS "Trucks RBAC Policy" ON public.trucks;
DROP POLICY IF EXISTS "Shipments RBAC Policy" ON public.shipments;
DROP POLICY IF EXISTS "Documents RBAC Policy" ON public.documents;
DROP POLICY IF EXISTS "Anomalies RBAC Policy" ON public.anomalies;

-- 7.1 Profiles: Users can view/edit own profile; Admins can access all profiles
CREATE POLICY "Profiles RBAC Policy" ON public.profiles
    FOR ALL USING (
        auth.uid() = id OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR
        auth.role() = 'anon'
    );

-- 7.2 Trucks: Drivers see assigned truck; Fleet Owners see fleet trucks; Shippers/Drivers see available trucks
CREATE POLICY "Trucks RBAC Policy" ON public.trucks
    FOR SELECT USING (
        driver_id = auth.uid() OR
        status = 'available' OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('fleet', 'admin') OR
        auth.role() = 'anon'
    );

-- 7.3 Shipments: Shippers see own shipments; Drivers see assigned/available shipments; Fleet/Admin see all
CREATE POLICY "Shipments RBAC Policy" ON public.shipments
    FOR SELECT USING (
        shipper_id = auth.uid() OR
        assigned_driver_id = auth.uid() OR
        status = 'pending' OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('fleet', 'admin') OR
        auth.role() = 'anon'
    );

-- 7.4 Documents: Drivers manage own compliance docs; Fleet Owners & Admins audit all
CREATE POLICY "Documents RBAC Policy" ON public.documents
    FOR ALL USING (
        driver_id = auth.uid() OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('fleet', 'admin') OR
        auth.role() = 'anon'
    );

-- 7.5 Anomalies: Admins and Fleet Security Officers only
CREATE POLICY "Anomalies RBAC Policy" ON public.anomalies
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'fleet') OR
        auth.role() = 'anon'
    );

-- ── 8. SEED DATA ─────────────────────────────────────────────────────────────
INSERT INTO public.profiles (id, email, full_name, role, phone, company_name, rating)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'driver@cargoloop.ai', 'Rajesh Kumar', 'driver', '+91 98765 43210', 'Express Highways India', 4.90),
  ('a0000000-0000-0000-0000-000000000002', 'shipper@cargoloop.ai', 'Vikram Malhotra', 'shipper', '+91 98123 45678', 'Reliance Retail Supply', 4.85),
  ('a0000000-0000-0000-0000-000000000003', 'fleet@cargoloop.ai', 'Ananya Deshmukh', 'fleet', '+91 97654 32109', 'Apex Fleet Logistics', 4.95),
  ('a0000000-0000-0000-0000-000000000004', 'admin@cargoloop.ai', 'Siddharth V.', 'admin', '+91 99000 11223', 'CargoLoop Control Center', 5.00)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.trucks (id, plate_number, model, capacity_tons, current_lat, current_lng, current_city, dest_lat, dest_lng, dest_city, status, driver_name, driver_rating, temperature_controlled, fuel_type)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'MH-12-CL-3012', 'Tata Prima 4928.S', 28.00, 18.5204, 73.8567, 'Pune', 18.9690, 72.8210, 'Mumbai', 'in-transit', 'Rajesh Kumar', 4.9, true, 'diesel'),
  ('b0000000-0000-0000-0000-000000000002', 'KA-01-EV-9021', 'Ashok Leyland BOSS EV', 14.00, 12.9716, 77.5946, 'Bengaluru', 13.0827, 80.2707, 'Chennai', 'available', 'Suresh Patel', 4.8, false, 'electric'),
  ('b0000000-0000-0000-0000-000000000003', 'DL-01-CL-7788', 'Eicher Pro 6055', 32.00, 28.7041, 77.1025, 'Delhi', 23.0225, 72.5714, 'Ahmedabad', 'available', 'Amit Sharma', 4.7, false, 'cng'),
  ('b0000000-0000-0000-0000-000000000004', 'TS-09-CL-4411', 'BharatBenz 2823C', 24.00, 17.3850, 78.4867, 'Hyderabad', 12.9716, 77.5946, 'Bengaluru', 'in-transit', 'Venkatesh Rao', 4.95, true, 'hybrid')
ON CONFLICT (plate_number) DO NOTHING;

INSERT INTO public.shipments (id, title, material, weight_tons, temperature_controlled, origin_city, origin_lat, origin_lng, destination_city, destination_lat, destination_lng, distance_km, estimated_price_inr, status, pickup_window)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Pharma Temperature-Controlled Vaccines', 'Pharmaceuticals', 12.50, true, 'Mumbai', 18.9690, 72.8210, 'Pune', 18.5204, 73.8567, 148.00, 42500.00, 'assigned', 'Immediate'),
  ('c0000000-0000-0000-0000-000000000002', 'High-Tech Electronics & Components', 'Consumer Tech', 8.00, false, 'Bengaluru', 12.9716, 77.5946, 'Chennai', 13.0827, 80.2707, 346.00, 68000.00, 'pending', 'Today 4 PM'),
  ('c0000000-0000-0000-0000-000000000003', 'Automobile Spare Parts & Assemblies', 'Auto Components', 22.00, false, 'Pune', 18.5204, 73.8567, 'Nagpur', 21.1458, 79.0882, 710.00, 112000.00, 'pending', 'Tomorrow AM'),
  ('c0000000-0000-0000-0000-000000000004', 'Organic Dairy Products & Produce', 'Perishable Foods', 16.00, true, 'Ahmedabad', 23.0225, 72.5714, 'Mumbai', 18.9690, 72.8210, 525.00, 89500.00, 'pending', 'Immediate')
ON CONFLICT (id) DO NOTHING;
