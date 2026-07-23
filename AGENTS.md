# Important Rules

- Maintain a todo list for complex or long-running tasks. Update task status as work progresses.
- Port 3000 is reserved for the platform relay; never use it for applications or dev servers.
- Run long-running processes (dev servers, etc.) in the background so the terminal remains available.
- Be concise and direct. Avoid unnecessary detail.
- /shared is a workspace storage directory. Files placed here persist across sandbox restarts. Use it for sharing artifacts, datasets, or outputs between sessions.
- /cloudflare is a read-only Cloudflare context library (same content as `cloudflare/` in the Seal worker VFS). Layout: `context/{facts,voice,proof,mappings,mrk-messaging,hosts,slide-templates,forecast-profiles}/`, `skills/<name>/SKILL.md` (auto-registered as opencode skills — discover via your skill list), `commands/<name>.md` (auto-registered as opencode slash commands — invokable as `/<name>`). Skills and commands are loaded by OpenCode directly from this mount via `OPENCODE_CONFIG_DIR=/cloudflare`, so the catalog stays in sync with the upstream library on every cold boot. Use context/facts/ for any Cloudflare metric you cite; use context/voice/ before drafting customer- or blog-facing prose. Python scripts under skills/\*/scripts/ depend on upstream utilities not shipped here; treat SKILL.md files as structural/voice guidance only, not as executable scripts. Writes fail EROFS.
- This is a cloud container with limited disk space. Avoid large downloads, clean up build artifacts, and prefer lightweight installs.
- You would be running alongside other opencode sessions, therefore be mindful of code changes and avoid conflicts. Eg, commit only changes you have made, and don't change the global git working branch. Try to work in separate git worktrees and clean them up after creating any PRs.
- Use `bun` instead of `npm` for all Node.js/JavaScript package management (install, run, test, build).
- Always make sure you are on the latest branch. Always sync with the remote before any development.
- Search for AGENTS.md file in the directories you are working in. These have essential rules for working on projects, which MUST be respected.

## GitLab Usage

- Prefer GitLab over GitHub when repo host is not explicitly specified.
- Use `glab repo clone <namespace/repo>` as the default clone path for internal repos.
- If the task asks you to inspect, debug, change, or fix Seal itself, the Seal agent, or its own implementation, and does not name another repo, work in `cloudflare/cto/cto-agent` (`glab repo clone cloudflare/cto/cto-agent`; https://gitlab.cfdata.org/cloudflare/cto/cto-agent). Seal's implementation lives primarily under `apps/seal/`.
- If using `git` directly, use `gitlab.cfdata.org` URLs (for example: `git clone https://gitlab.cfdata.org/group/repo.git`).
- Do not use `gitlab-access.cfdata.org` for clone URLs. The platform rewrites `gitlab.cfdata.org` internally.
- For GitLab API calls, use `gitlab-access.cfdata.org` (for example: `https://gitlab-access.cfdata.org/api/v4/...`).
- HTTPS egress is intercepted per-host — the platform injects credentials for known provider hosts automatically.

## Code Quality

- Strict DRY. No duplicated logic.
- Simplicity over cleverness — complexity must be justified. Robustness comes from simplicity.
- Fewer the moving parts, better the system.
- Design systems to be self healing and resilient. Remember the swiss cheese model of failure - multiple layers of defense.
- Find the architecturally correct solution, not the quickest. No hacky shortcuts.
- Clean, self-documenting code. If a comment is needed to explain what code does, rewrite the code.
- Comments explain _why_ (gotchas, architectural decisions, section markers), never _what_. Write them as part of the codebase, not as notes about your changes.
- Every abstraction earns its existence.

## Network Requirements

All dev servers inside this sandbox MUST bind to `0.0.0.0` (not localhost/127.0.0.1). The container proxy cannot reach services bound to localhost.

- Vite/Next.js/Nuxt: use `--host 0.0.0.0`
- Wrangler: use `--ip 0.0.0.0` (NOT --host)
- Generic: set `HOST=0.0.0.0` environment variable
- Express/Hono: use `.listen(port, '0.0.0.0')`
