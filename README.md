# Cloudflare Customer Information Questionnaire

A web form that collects customer information for quote generation, deployed as a Cloudflare Worker with R2 storage and a role-based admin dashboard.

## Architecture

- **Frontend:** Server-rendered HTML form (no build step) served by the Worker
- **Backend:** Cloudflare Worker (Hono framework) running at the edge
- **Storage:** Cloudflare R2 bucket — each submission is stored as a JSON object
- **Auth:** JWT-based admin authentication with role-based access control
- **Security:** CSRF tokens for mutating API calls, HttpOnly Secure cookies

## User Roles

| Role | Permissions |
|------|------------|
| **Superadmin** | View all submissions, assign distributor (SoftDebut / Nforce), delete submissions, export JSON |
| **User (SoftDebut)** | View only submissions assigned to distributor "SoftDebut" |
| **User (Nforce)** | View only submissions assigned to distributor "Nforce" |

## File Structure

```
src/
├── index.ts            # Main Worker entry — Hono routes
├── auth.ts             # JWT creation/verification, user store, authentication
├── types.ts            # TypeScript interfaces (Env, QuestionnaireSubmission)
└── render/
    ├── form.ts         # Customer-facing questionnaire HTML
    └── admin.ts        # Admin login + dashboard HTML
wrangler.toml           # Cloudflare Worker config (R2 binding, vars)
package.json
tsconfig.json
.dev.vars.example       # Local dev secrets template
```

## Setup

### 1. Prerequisites

- Node.js 18+
- Cloudflare account with Workers + R2 enabled
- Wrangler CLI (`npm install -g wrangler` or use `npx wrangler`)

### 2. Install Dependencies

```bash
npm install
```

### 3. Create R2 Bucket

```bash
npx wrangler r2 bucket create customer-questionnaire
```

### 4. Configure Secrets

Set the following secrets (do NOT commit these to git):

```bash
# JWT signing secret
npx wrangler secret put JWT_SECRET
# Enter a random string, e.g.: openssl rand -base64 32

# Admin passwords (JSON map of username -> password)
npx wrangler secret put ADMIN_PASSWORDS
# Enter: {"superadmin":"your-secure-password","softdebut":"your-password","nforce":"your-password"}
```

### 5. Configure Admin Users (wrangler.toml)

The `ADMIN_USERS` var in `wrangler.toml` defines the user list. Edit it to add/remove users:

```toml
[vars]
ADMIN_USERS = '[{"username":"superadmin","role":"superadmin"},{"username":"softdebut","role":"user","distributor":"SoftDebut"},{"username":"nforce","role":"user","distributor":"Nforce"}]'
```

To add a new distributor user, add an entry with `"role":"user"` and `"distributor":"<DistributorName>"`.

### 6. Local Development

```bash
# Copy dev vars template and fill in values
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your local secrets

# Start dev server
npm run dev
```

The form will be available at `http://localhost:8787/`  
The admin dashboard at `http://localhost:8787/admin/login`

### 7. Deploy

```bash
npm run deploy
```

After deployment, your questionnaire will be live at `https://customer-questionnaire.<your-subdomain>.workers.dev/`.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Public | Customer questionnaire form |
| POST | `/api/submit` | Public | Submit questionnaire data (JSON) |
| GET | `/admin/login` | Public | Admin login page |
| POST | `/admin/login` | Public | Login handler (form-encoded) |
| GET | `/admin/logout` | Admin | Clear session cookie |
| GET | `/admin/dashboard` | Admin | View submissions dashboard |
| POST | `/admin/api/assign-distributor` | Superadmin | Assign distributor to a submission |
| DELETE | `/admin/api/delete/:id` | Superadmin | Delete a submission |
| GET | `/admin/api/export/:id` | Superadmin | Export a submission as JSON |
| GET | `/health` | Public | Health check |

## Workflow

1. Customer fills out the form at `/` and submits
2. Submission is saved to R2 as `submissions/<uuid>.json` with `distributor: ""`
3. Superadmin logs in at `/admin/login`, views all submissions
4. Superadmin assigns each submission to "SoftDebut" or "Nforce" via dropdown
5. Distributor users log in and see only submissions assigned to their distributor
6. Any admin can click "View" to see full submission details in a modal

## Adding New Form Fields

1. Add the field to `QuestionnaireSubmission` interface in `src/types.ts`
2. Add the HTML input in `src/render/form.ts` (use `name="section.fieldName"`)
3. The submit handler in `index.ts` automatically maps nested keys — no change needed if the field follows the `section.field` naming convention

## Security Notes

- Passwords are stored as secrets in Cloudflare (never in code)
- JWT tokens are signed with HMAC-SHA256 and expire after 24 hours
- CSRF tokens protect all mutating API calls
- Cookies are HttpOnly, Secure, and SameSite=Strict
- For production, consider adding rate limiting and IP allowlisting for admin routes
