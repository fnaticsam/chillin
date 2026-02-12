# Chillin — Claude Code Development Prompt

Use this prompt with Claude Code to build the product. Copy the entire block below into your terminal session.

---

## The Prompt

```
I'm building Chillin — a premium consumer subscription app where members pay monthly for a human concierge who handles all their customer support issues on their behalf. Think of it as a support advocate: you describe your problem, a human takes ownership, and you track resolution in the app. The tagline is "We handle it. You chill."

Key differentiator: Chillin uses a legally binding Letter of Authority (LoA) framework that authorises our concierges to act on behalf of members with companies. This creates a regulatory moat — similar to how Numan turned healthcare compliance into a competitive advantage.

## Technical Stack

Build this as a Next.js 14+ app (App Router) with:
- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion for animations
- **Backend:** Next.js API routes + server actions
- **Database:** Supabase (Postgres + Auth + Realtime)
- **Payments:** Stripe for subscriptions
- **Real-time:** Supabase Realtime for live issue status updates
- **Voice input:** Web Speech API for voice-to-text issue submission
- **Deployment:** Vercel

## Core Data Models

### Users (members)
- id, email, name, phone
- subscription_tier (member | premium | household)
- stripe_customer_id
- household_id (nullable, links household members)
- loa_signed (boolean — whether they've completed the Letter of Authority)
- loa_signed_at (timestamp)
- created_at

### Issues
- id, user_id, title, description
- company_id (FK to companies)
- company_name, company_category (airline | bank | telco | energy | saas | ecommerce | insurance | council | nhs | hmrc | other)
- status (submitted | triaging | in_progress | awaiting_member | escalated | resolved | closed)
- service_tier (full_resolution | guided | advisory)
- priority (normal | urgent)
- concierge_id (assigned concierge)
- resolution_summary (filled when resolved)
- money_recovered (decimal, nullable)
- created_at, updated_at, resolved_at

### Issue Updates (timeline)
- id, issue_id, type (status_change | message | note | action | member_needed | hold_update)
- content (text description of update)
- author_type (concierge | system | member | ai)
- created_at

### Companies (knowledge base)
- id, name, category, logo_url
- avg_resolution_days (benchmarked from our data)
- service_tier (full_resolution | guided | advisory)
- authority_type (loa_standard | loa_plus_2fa | advisory_only)
- authority_notes (what specific LoA requirements this company has)
- best_contact_method, escalation_notes
- support_phone, support_email, support_url
- ombudsman_route (nullable — which ombudsman handles complaints)
- success_rate (percentage)

### Authority Documents
- id, user_id, company_id (nullable — null means blanket LoA)
- document_type (blanket_loa | company_specific_loa | hmrc_64_8)
- signed_at, expires_at
- status (active | expired | revoked)

### Concierges (internal)
- id, name, email, active_issues_count, specialities

## Pages & Features to Build

### 1. Landing Page (/)
Already designed — use the HTML file I'll provide as reference for styling. Convert to React/Tailwind. Include:
- Hero with waitlist signup (collect email, store in Supabase)
- Problem section, How it works (4 steps), What we handle (3 service tiers with specific examples), Moat section (3 cards), App preview mockup, Pricing, Final CTA
- Responsive, animated with Framer Motion fade-ins on scroll

### 2. Auth (/login, /signup)
- Supabase Auth with email/password and Google OAuth
- After signup, redirect to onboarding

### 3. Onboarding (/onboarding)
- Step 1: Choose subscription tier (Member £49, Premium £99, Household £149)
- Step 2: Stripe checkout for payment
- Step 3: Quick profile setup (name, phone)
- Step 4: Sign the Letter of Authority — present a clear, plain-English explanation of what they're authorising, with the legal text expandable. Digital signature (typed name + checkbox). Store in authority_documents table.
- Step 5: Optional — pre-authorise specific companies (select from list, generates company-specific LoAs if needed)

### 4. Dashboard (/dashboard)
This is the main app screen. Show:
- **Active Issues** — cards showing each open issue with: company name/logo, issue title, current status badge, SERVICE TIER badge (Full Resolution / Guided / Advisory), progress bar, avg resolution time for that company, last update preview
- **"Awaiting You" banner** — if any Tier 2 guided issues need member input (e.g. 2FA code relay), show a prominent alert
- **Resolved Issues** — collapsible history with money recovered highlighted
- **New Issue button** — prominent, always visible
- **Quick Stats** — total issues resolved, avg resolution time, total money saved/recovered
- Real-time updates via Supabase Realtime (status changes appear live without refresh)

### 5. New Issue Flow (/dashboard/new)
This is critical UX — must feel effortless:
- **Voice or text input** — large microphone button that records and transcribes via Web Speech API, or text area
- **AI triage** — after submission, auto-categorise the company, suggest company from our database, determine service tier based on company's authority_type
- **Service tier preview** — BEFORE submission, clearly show: "This is a Full Resolution case — we handle everything" or "This is a Guided case — we'll need you for ~2 minutes when the company needs identity verification"
- **Smart follow-up questions** — based on issue type, ask for: order number, booking reference, account details, screenshots (drag-and-drop upload)
- **Authority check** — if the company requires a specific LoA or the member hasn't signed one yet, prompt them to sign
- **Confirmation screen** — shows: "Here's what we understand", estimated resolution time, service tier, submit button
- File uploads stored in Supabase Storage

### 6. Issue Detail (/dashboard/issue/[id])
- Full timeline of updates (like a chat thread)
- Current status with visual progress indicator
- Service tier badge (Full / Guided / Advisory) prominently displayed
- Company info card (avg resolution time, our success rate, service tier, contact methods we're using)
- **Hold-for-Me status** — for Tier 2 guided cases, show when we're on hold and estimated wait time
- **2FA relay** — when the concierge needs a code from the member, show a prominent card: "Your bank just sent a code to your phone. Tap to relay it to your concierge." One-tap action.
- Member can add messages/context to the thread
- Resolution summary when complete (what happened, what was achieved, money recovered)

### 7. Company Directory (/companies) — public page
- Searchable list of companies we cover
- Each shows: category, avg resolution time, service tier (Full/Guided/Advisory), our success rate
- Authority type indicator (so members know upfront what to expect)
- This is public (marketing/SEO value) — no auth required

### 8. Concierge Dashboard (/concierge) — internal
- List of assigned issues, sorted by priority/age
- Issue detail view with full timeline, company playbook, and action buttons
- Quick actions: update status, add note, send update to member, escalate, request member input
- Company knowledge base search with authority requirements
- Hold-for-Me integration: "Currently on hold with [company] — 23 min elapsed"

## Design System

Use a refined, premium, trustworthy aesthetic. The brand is "chill" but premium — think Aesop meets Monzo.

Reference these Tailwind tokens:
- Colors: slate-900 (ink), stone-50 (paper), emerald-700 (sage/primary), amber-600 (warm accent), red-500 (urgent)
- Font: Use `font-sans` (system) for body, consider importing a serif like Fraunces for headings
- Border radius: rounded-xl for cards, rounded-full for buttons/badges
- Shadows: subtle, layered (shadow-sm for cards, shadow-lg on hover)
- Status badges: colour-coded pills (emerald for active, blue for escalated, green for resolved, amber for triaging, orange for awaiting member)
- Service tier badges: sage/green for Full Resolution, orange for Guided, purple for Advisory

## Key Technical Considerations

1. **Supabase Row Level Security** — members can only see their own issues; concierges can see assigned issues; admin sees all
2. **Realtime subscriptions** — dashboard listens for changes to issues table and issue_updates table
3. **Stripe webhooks** — handle subscription creation, renewal, cancellation, and payment failures. Three tiers: member (£49), premium (£99), household (£149)
4. **Voice transcription** — use Web Speech API with fallback to a text area; transcription happens client-side
5. **File uploads** — images/screenshots stored in Supabase Storage, referenced in issue_updates
6. **Responsive** — must work beautifully on mobile (this is primarily a mobile-first product)
7. **Authority document signing** — digital signature flow with timestamp, stored in DB. Generate PDF of signed LoA for member's records.
8. **2FA relay** — push notification pattern: when concierge flags "awaiting_member", the member's app shows an urgent card. Member taps, enters the code from their SMS, code is relayed to the concierge via Realtime. Target: <30 second round trip.
9. **Seed data** — create a seed script that populates: 50 common UK companies with realistic benchmark data, authority types, ombudsman routes; sample issues in various states across all three service tiers; sample timeline updates including Hold-for-Me and 2FA relay events

## Build Order

1. Set up Next.js project with Tailwind, Supabase client, and Stripe
2. Database schema + seed data (including authority_documents table and company authority_type)
3. Landing page (convert from HTML reference)
4. Auth flow
5. Onboarding with LoA signing
6. Dashboard with mock data (including service tier badges and awaiting-member alerts)
7. New issue flow (voice + text + triage + authority check + service tier preview)
8. Issue detail page with timeline, Hold-for-Me status, and 2FA relay
9. Real-time updates
10. Stripe integration (3 tiers)
11. Concierge dashboard
12. Company directory (public)
13. Polish, animations, responsive testing

Start with step 1 and work through sequentially. Ask me before making major architectural decisions. Prioritise getting the member-facing experience working and polished before the concierge dashboard.
```

---

## Usage Notes

- **With Claude Code:** Paste the entire prompt above into your Claude Code session. It will work through the build order step by step.
- **With Cursor:** Same prompt works — paste into the composer. You may want to break it into smaller tasks.
- **Customisation:** Adjust pricing tiers, colours, and stack as needed.
- **The landing page HTML:** Reference the separate `chillin-landing.html` file for design direction. Tell Claude Code to use it as the visual reference when building the React version.
- **Environment variables needed:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`

## What's New vs. Original Sortd Prompt

Key additions to this version:
- **Letter of Authority framework** — new data model, onboarding step, and authority check in issue submission
- **Three service tiers** — Full Resolution, Guided, Advisory — with company-level mapping
- **Hold-for-Me** — concierge status showing active hold times
- **2FA relay** — real-time code forwarding between member and concierge
- **Premium pricing** — £49/99/149 tiers (up from £19/49/79)
- **Company authority types** — each company has a mapped authority requirement
- **Money recovered tracking** — issues track financial outcomes
- **Awaiting member** status — prominent alerts when member input is needed
