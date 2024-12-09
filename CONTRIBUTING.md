## Dev

### Setup

Install dependencies with `pnpm install`

### Commands

- **Dev**: `pnpm run dev`
- **Build**: `pnpm run build`
- **Test**: `pnpm run test`
- **Lint**: `pnpm run lint`
- **Format**: `pnpm run format:check`, `pnpm run format:write`
- **Documentation**: `pnpm run doc`

### Submit a PR

Before you submit a PR, make sure that:

- All the tests pass ✅ and your code is covered
- Your code is properly formatted with Prettier
- You code doesn't raise any ESlint warning
- Your changes are explained in your PR

When in doubt, [Create a new issue](https://github.com/hypercerts-org/marketplace-sdk/issues/new) to discuss your proposal first.

### Release

- Create a [personal access token](https://github.com/settings/tokens/new?scopes=repo&description=release-it) (Don't change the default scope)
- Create an `.env` (copy `.env.template`) and set you github personal access token.
- `pnpm run release` will run all the checks, build, and publish the package, and publish the github release note.
- `pnpm run release --dry-run` simulates a release process.
