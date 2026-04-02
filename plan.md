1. Update `sessionRef` typing in `src/pages/Chat.tsx` from `useRef<any>(null)` to `useRef<WebSocket | null>(null)`.
2. Verify the change by reading the `src/pages/Chat.tsx` file and confirm the change was applied successfully.
3. Run `npm run lint` and `npm run test` to verify the changes are correct and no functionality is broken.
4. Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
5. Submit the code changes with a descriptive branch name and commit message.
