---
name: project-channel-handoff
description: Create a new project channel and transfer curated project context into it. Use when a user wants a fresh Discord/communication channel for an active project and needs the essential context moved cleanly instead of dumping raw chat history. Best for repo-backed projects with architecture, decisions, docs, links, and next steps that should be posted as a structured handoff pack.
---

# Project Channel Handoff

Use this skill when a project needs its own new channel and the user wants the project context transferred into it.

## Workflow
1. Build a **curated context pack** instead of dumping raw history.
2. Include only durable project context:
   - project overview
   - core repos
   - architecture
   - important docs
   - key decisions
   - current status
   - known priorities / next steps
   - important commits or links
3. Create the new channel.
4. Post the context pack as multiple structured messages.
5. Keep the first message short and orienting; post the heavy context in follow-up sections.

## Rules
- Prefer structured handoff over literal full-history transfer.
- Do not include secrets, tokens, or private local-only paths unless explicitly necessary and safe.
- Split long context into readable chunks.
- Name the channel clearly from the project slug.
- If a reusable script exists, use it instead of rebuilding by hand.

## Included script
Use `scripts/create-project-channel.js` for Discord channel creation and context posting.

### Expected inputs
- guild id
- channel name / project name
- path to handoff context JSON
- optional parent category id
- optional topic

### Example
```bash
node scripts/create-project-channel.js \
  --guild-id <guild_id> \
  --name "prospecting-app" \
  --context ./assets/prospecting-app-context.json
```

## Included asset
- `assets/prospecting-app-context.json` is an example context pack for the Prospecting App project.

## What good looks like
A future agent should be able to enter the new channel, read the posted handoff messages, and understand the project quickly without needing the original chat transcript.
