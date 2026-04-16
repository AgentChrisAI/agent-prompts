---
name: project-channel-handoff
description: Create a new project channel and transfer curated project context into it. Use when a user wants a fresh Discord or communication channel for an active project and needs the essential context moved cleanly instead of dumping raw chat history. Best for repo-backed projects where you should generate a templated handoff pack covering overview, repos, architecture, docs, key decisions, current status, priorities, and links.
---

# Project Channel Handoff

Use this skill when a project needs a new channel and the important context should be transferred cleanly.

## Goal
Create a reusable, readable handoff pack that future agents and humans can use without reading the original chat history.

## Workflow
1. Build a **curated context pack** instead of dumping raw history.
2. Include durable project context only:
   - project overview
   - core repos and links
   - architecture
   - business/product context
   - design/UX direction
   - important docs
   - key milestones and decisions
   - current status
   - priorities / next steps
3. Generate the context JSON from a reusable template if a project-specific file does not already exist.
4. Create the new channel.
5. Post the handoff pack as multiple structured messages.

## Rules
- Prefer structured handoff over literal full-history transfer.
- Do not include secrets, tokens, or unsafe internal details.
- Split long context into readable chunks.
- Name the channel clearly from the project slug.
- If a reusable script exists, use it instead of hand-building the same process again.

## Included files
### Script: generate templated context
Use `scripts/generate-project-context.js` to create a project context JSON from a reusable template.

Example:
```bash
node scripts/generate-project-context.js \
  --template ./assets/project-context-template.json \
  --project-name "My Project" \
  --out ./assets/my-project-context.json
```

### Script: create channel and post context
Use `scripts/create-project-channel.js` to create a Discord channel and post the handoff pack.

Example:
```bash
node scripts/create-project-channel.js \
  --guild-id <guild_id> \
  --name "my-project" \
  --context ./assets/my-project-context.json
```

## Assets
- `assets/project-context-template.json` — reusable generic handoff template
- `assets/prospecting-app-context.json` — example filled project handoff

## What good looks like
A new channel should open with a short orientation message followed by a structured handoff pack. A future agent should be able to read it and understand the project quickly without needing the original conversation.
