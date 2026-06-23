# Artricenter — Agent Notes

## Workflow Rules

### 1. No deploy without explicit approval
Before running any deployment command (`python deploy.py`, `python3 deploy_ftp.py`, `npm run deploy`, FTP upload, etc.), the agent MUST ask the user for confirmation. Never auto-deploy after a build.

### 2. No git commit without explicit approval
Before creating any git commit, the agent MUST ask the user for confirmation. This includes conventional commits, `git commit -m`, and any automated commit flow.

### 3. Builds and tests can run freely
`npm run build`, `npm run test`, `npm run preview`, and local verification are allowed without asking.

### 4. File edits are allowed within the current task
Writing or editing source files to complete the requested work is allowed; stop before committing or deploying.

### 5. When in doubt, ask
If a command has side effects on production, on the repository history, or on shared state, ask first.
