# Claude Code — Global Development Rules
# Luca / aanotherluca
# Read this file at the start of every session before doing anything else.

---

## 🏗️ Component Architecture — The Most Important Section

### The Golden Rule: One Component, One Job
Every component does exactly one thing. If you can describe it with "and", split it.

```
✅ UserAvatar        — shows a user's avatar
✅ PricingCard       — shows a single pricing tier
✅ AuthForm          — handles login/signup form
❌ UserDashboardWithSidebarAndNotifications  — too much, split it
```

### File Structure — Every Component Gets Its Own Folder
```
src/
  components/
    ui/                          # shadcn/ui base components — NEVER modify these
    common/                      # shared across the whole app
      Avatar/
        Avatar.tsx               # component logic only
        Avatar.styles.ts         # styles isolated here
        Avatar.test.tsx          # tests
        index.ts                 # exports only
    features/                   # feature-specific components
      auth/
        LoginForm/
          LoginForm.tsx
          LoginForm.styles.ts
          index.ts
      dashboard/
        MetricsCard/
          MetricsCard.tsx
          MetricsCard.styles.ts
          index.ts
  pages/                        # page-level layout only — no business logic
  hooks/                        # custom hooks — all data fetching lives here
  lib/                          # utilities, API clients
  types/                        # TypeScript types — shared across app
```

### Component Size Limits
- Max **150 lines** per component file — split if larger
- Max **5 props** before using a config object or splitting the component
- More than 2 useState hooks in one component → extract to a custom hook

### Props — Always Typed, Always Explicit
```typescript
// ✅ CORRECT
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

// ❌ WRONG — never any, never untyped
const Button = (props: any) => { ... }
```

### Error Boundaries — Every Feature Section
Wrap every major feature section in an error boundary so one broken component never crashes the whole app:
```typescript
// ✅ Wrap feature sections
<ErrorBoundary fallback={<FeatureError />}>
  <Dashboard />
</ErrorBoundary>

// Pages always get their own error boundary
<ErrorBoundary fallback={<PageError />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</ErrorBoundary>
```

---

## 🎨 Styling Rules — Isolation First

### Never Use Global Styles for Component-Specific Things
```typescript
// ✅ Tailwind classes directly on elements
<div className="flex items-center gap-4 rounded-lg bg-card p-4">

// ✅ cn() helper for conditional classes
import { cn } from '@/lib/utils';
<div className={cn("base-classes", isActive && "active-classes", className)}>

// ❌ Never add component styles to index.css or globals.css
// ❌ Never use inline style={{ }} except for truly dynamic values
```

### Always Accept className Prop
Every component must accept and forward className for composability:
```typescript
interface CardProps {
  className?: string;
  children: React.ReactNode;
}
export const Card = ({ className, children }: CardProps) => (
  <div className={cn("rounded-lg border bg-card p-6", className)}>
    {children}
  </div>
);
```

### Design Tokens — Always Use CSS Variables
Never hardcode colors, spacing, or typography:
```
✅ bg-background, bg-card, bg-primary, bg-muted
✅ text-foreground, text-muted-foreground, text-primary
✅ border-border, ring-ring
✅ rounded-lg, rounded-md (from tailwind config)
❌ bg-[#1a1a2e]    — hardcoded color
❌ text-[14px]     — hardcoded size
❌ bg-white        — breaks dark mode
❌ text-gray-900   — breaks dark mode
```

### Dark Mode — Always Supported
Every component works in both light and dark mode. No exceptions.
Use semantic tokens only — they adapt automatically:
```
✅ bg-background   → adapts to theme
✅ text-foreground → adapts to theme
❌ bg-white        → breaks in dark mode
❌ text-black      → breaks in dark mode
```

---

## 📱 Responsive Design — Mobile First, Always

Build every component mobile-first. Never build desktop then adapt down.

```typescript
// ✅ CORRECT — mobile first
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">

// ❌ WRONG — desktop first
<div className="flex flex-row gap-8 sm:flex-col">
```

### Breakpoints
```
default  →  mobile (< 768px)
md:      →  tablet (768px+)
lg:      →  desktop (1024px+)
xl:      →  wide desktop (1280px+)
```

### Touch Targets
All interactive elements minimum 44x44px on mobile:
```
✅ min-h-[44px] min-w-[44px] on all buttons and links
✅ py-3 px-4 minimum padding on mobile buttons
✅ Adequate spacing between tappable elements (gap-3 minimum)
```

---

## ⚡ Performance Rules

### Lazy Load Everything Not Immediately Visible
```typescript
// ✅ Lazy load pages and heavy components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const HeavyChart = lazy(() => import('./components/HeavyChart'));

// ✅ Always wrap lazy components in Suspense
<Suspense fallback={<PageSkeleton />}>
  <Dashboard />
</Suspense>
```

### Images — Always Optimized
```typescript
// ✅ Always specify dimensions to prevent layout shift
<img src={url} alt={desc} width={400} height={300} loading="lazy" />

// ✅ Use Supabase image transforms for user-uploaded images
const optimized = supabase.storage.from('avatars')
  .getPublicUrl('file.jpg', { transform: { width: 200, height: 200 } });

// ❌ Never load full-size images when thumbnails are needed
```

### Data Fetching — No Waterfalls
```typescript
// ✅ Fetch in parallel
const [user, posts, stats] = await Promise.all([
  getUser(id),
  getPosts(id),
  getStats(id)
]);

// ❌ Never fetch sequentially when parallel is possible
const user = await getUser(id);
const posts = await getPosts(user.id);  // waits unnecessarily
```

### Bundle Size
- Never import entire libraries — named imports only
- Check bundle impact before adding a new dependency
```typescript
// ✅ Named import — only what's needed
import { format } from 'date-fns';

// ❌ Full library import
import * as dateFns from 'date-fns';
```

---

## 🔄 State Management Rules

### State Lives as Close to Where It's Used as Possible
```
Local UI state (open/closed, hover, focus)   → useState in component
Shared feature state                         → useState lifted to parent
Server/async state                           → React Query (useQuery, useMutation)
Global app state (auth, theme, user)         → Context or Zustand
```

### Never Prop Drill More Than 2 Levels
If passing props through 3+ components → use Context or lift to a custom hook.

### Always Handle All 4 Async States
Every data fetch must handle all states:
```typescript
// ✅ REQUIRED — never skip any state
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState />;
return <DataDisplay data={data} />;
```

---

## 🔒 Supabase — Backend Rules

### Row Level Security — Always On
Every table must have RLS enabled. No exceptions. No shipping without it.
```sql
-- Required minimum for every table
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users access own data" ON your_table
  FOR ALL USING (auth.uid() = user_id);

-- Public read, authenticated write
CREATE POLICY "Public read" ON your_table
  FOR SELECT USING (true);
CREATE POLICY "Auth write" ON your_table
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Key Rules
```typescript
// ✅ Frontend — anon key only
const supabase = createClient(url, process.env.VITE_SUPABASE_ANON_KEY);

// ✅ Backend/Edge Functions only — service role
const supabase = createClient(url, process.env.SUPABASE_SERVICE_KEY);

// ❌ NEVER service_role in any frontend code
```

### Always Handle Auth State
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') redirect('/login');
  if (event === 'TOKEN_REFRESHED') updateSession(session);
  if (event === 'USER_UPDATED') refreshUser();
});
```

### Database Queries — Always Typed
```typescript
// ✅ Always select only needed columns, always handle error
const { data, error } = await supabase
  .from('profiles')
  .select('id, name, avatar_url')
  .eq('user_id', userId)
  .single();
if (error) throw error;
```

### Edge Functions — Use for Sensitive Logic
Any logic that involves service_role key, sending emails, or calling third-party APIs with secret keys must run in a Supabase Edge Function — never in frontend code.

---

## 💳 Stripe — Integration Rules

### Always Verify Webhooks
```typescript
// ✅ Always verify — no exceptions
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
// ❌ Never process unverified webhook data
```

### Use Stripe Hosted Pages
- Stripe Checkout for all payments — never custom card forms
- Stripe Customer Portal for subscription management
- Only build custom UI when Stripe hosted pages genuinely can't meet the requirement

### Handle All Payment States
```
payment_intent.succeeded          → activate feature / fulfill order
payment_intent.payment_failed     → notify user, offer retry
customer.subscription.created     → grant access
customer.subscription.deleted     → revoke access immediately
customer.subscription.updated     → update access level
invoice.payment_failed            → notify user, grace period logic
invoice.payment_succeeded         → confirm renewal
```

---

## 🚂 Railway — Node.js Backend Rules

### When to Use Railway
Use Railway for:
- Long-running processes (video processing, batch jobs)
- Complex websocket servers
- Background job queues
- Custom Node.js APIs that can't run as serverless functions

Use Supabase Edge Functions for everything else.

### Structure
```
backend/
  src/
    routes/          # Express routes — thin, delegate to services
    services/        # Business logic lives here
    middleware/      # Auth, validation, error handling
    lib/             # Utilities, DB clients
  index.ts           # Entry point only
```

### Always Validate Inputs
```typescript
// ✅ Validate before any database operation
import { z } from 'zod';
const schema = z.object({ email: z.string().email(), name: z.string().min(1) });
const parsed = schema.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ error: parsed.error });
```

### Error Handling — Consistent Format
```typescript
// ✅ Always return consistent error shape
res.status(400).json({ error: 'Validation failed', details: errors });
res.status(401).json({ error: 'Unauthorized' });
res.status(500).json({ error: 'Internal server error' });

// ❌ Never expose stack traces or internal errors to client
res.status(500).json({ error: err.stack });
```

---

## ♿ Accessibility — Client-Facing Apps

### Minimum Requirements
Every component shipped to clients must meet these basics:
```typescript
// ✅ Images always have alt text
<img src={url} alt="User profile photo" />
<img src={decorative} alt="" role="presentation" />

// ✅ Buttons always have accessible labels
<button aria-label="Close modal">✕</button>

// ✅ Form inputs always have labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✅ Focus visible on all interactive elements
// Never remove outline without a visible replacement
// className="focus:ring-2 focus:ring-primary"

// ✅ Color contrast — never rely on color alone to convey information
```

---

## 🔑 Environment Variables — Naming Convention

Follow this naming convention across all projects for consistency:

```
# Supabase
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY          # never VITE_ prefix — backend only

# Stripe
STRIPE_SECRET_KEY             # backend only
VITE_STRIPE_PUBLISHABLE_KEY   # frontend safe
STRIPE_WEBHOOK_SECRET         # backend only

# Email
RESEND_API_KEY                # backend only

# Railway backend
PORT
DATABASE_URL
NODE_ENV

# App
VITE_APP_URL                  # public app URL
VITE_APP_NAME                 # app display name
```

**Rule:** Any variable with VITE_ prefix is public and safe for frontend. Anything without VITE_ is backend/secret only.

---

## 🌿 Git Rules

### Commit Message Format
```
feat: add Stripe subscription flow
fix: resolve login redirect loop
style: update dashboard card spacing
refactor: extract auth logic to useAuth hook
chore: update dependencies
```

### Before Every Commit
1. No TypeScript errors
2. No console.logs
3. CONTEXT.md updated
4. .env not staged

### Branch When Working on Big Features
```
main           → always deployable, always stable
feature/name   → new features in progress
fix/name       → bug fixes
```

---

## ✅ Every Feature Checklist

Before any feature is marked done, verify all boxes:

### Frontend
- [ ] Works on mobile (375px minimum)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1280px)
- [ ] Works in dark mode
- [ ] Loading state implemented
- [ ] Error state implemented with retry where possible
- [ ] Empty state implemented
- [ ] Error boundary wrapping the feature
- [ ] No TypeScript errors
- [ ] No console errors or warnings
- [ ] Images have alt text
- [ ] Buttons have accessible labels

### Backend
- [ ] RLS policy added for any new Supabase table
- [ ] All inputs validated before database write
- [ ] Errors handled and returned in consistent format
- [ ] No sensitive keys in frontend code
- [ ] Webhook signatures verified (Stripe)

### Performance
- [ ] No unnecessary re-renders
- [ ] Heavy components lazy loaded
- [ ] Images optimized and sized correctly
- [ ] No sequential fetches that could be parallel

### General
- [ ] No component over 150 lines
- [ ] No prop drilling more than 2 levels
- [ ] All async operations handle loading + error + empty
- [ ] CONTEXT.md updated

---

## 🚫 Never Do These

```
❌ import * as X                             — named imports only
❌ TypeScript any type                       — always type properly
❌ Hardcoded colors or pixel sizes           — always use tokens
❌ Modify files in components/ui/            — extend, never modify shadcn
❌ Business logic in page components         — pages are layout only
❌ Direct database calls from components     — always through hooks
❌ console.log in production code            — proper error handling only
❌ .env committed to git                     — always in .gitignore
❌ service_role key in frontend code         — backend/edge functions only
❌ Unverified webhook processing             — always verify signatures
❌ CSS in globals.css for components         — component-level styles only
❌ Remove focus outlines without replacement — accessibility requirement
❌ Sequential fetches when parallel works    — always Promise.all
```

---

## 📝 CONTEXT.md — Session Rules

**Start of every session:**
```
Read CONTEXT.md and PRD.md and continue where we left off.
```

**End of every session:**
```
Update CONTEXT.md with what we built today, current state of each 
feature, any known bugs, and next steps.
```

CONTEXT.md must always contain:
- What the project is (brief)
- Tech stack being used
- What has been built (feature by feature)
- Current work in progress
- Known issues or bugs
- Key decisions made and why
- Next steps
