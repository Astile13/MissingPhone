# Working together

Use one repository named `wanderlock`, with three frontend and two backend members. Each person uses their own GitHub account, local Git name/email, commits and feature branches. Do not share passwords or commit using another member's account.

1. Read `docs/API.md`, `docs/ARCHITECTURE.md` and `docs/TEAM.md` before implementation. Agree on interface changes with the affected owners first.
2. Create an Issue using the Task template, assign its owner, fill completion criteria, dependencies and a target date. Add it to the Project board.
3. Update local main, then create a branch for ONE task:
   ```bash
   git switch main
   git pull --ff-only
   git switch -c feature/m2-answer-retry
   ```
4. Move the Issue to **In progress**. Keep commits small and explain intent:
   ```bash
   git add client/src/main.js
   git commit -m "fix: preserve answer while retrying a lost response"
   git push -u origin feature/m2-answer-retry
   ```
5. Open a pull request into `main`. Complete the template; link `Closes #12`; attach screenshots for UI changes. Move the Issue to **Review**.
6. A different member reviews the diff, runs relevant checks and asks the author to explain the logic. Every member reviews and understands their AI-generated code. Record tool use in `docs/AI-USE-LOG.md`.
7. Resolve comments; all checks must pass. Reviewer approves; merge (squash is simplest), delete the feature branch, and move the Issue to **Done**. Never self-approve as a replacement for peer review.
8. Pull main before the next branch. Coordinate edits to shared files. Resolve conflicts locally by reading both changes, preserving intended behaviour and running checks; do not blindly choose "ours" or "theirs".

Working practice: one peer approval is required even if the repository plan cannot enforce it. Enable branch rules where supported: require pull requests, one approval, dismiss stale approvals, resolve conversations, require `Tests and build`, block force pushes and deletion. The owner should not routinely bypass checks. See `docs/GITHUB-SETUP.md` for account setup.

Do not commit `.env`, database exports, bearer tokens, node_modules or screenshots containing credentials. Test against disposable databases. Never change a previously applied migration; add a numbered file and agree on the rollout.
