## Getting Started

### Lint before pushing

To prevent code with linter errors going to repository enable a prepush script which runs linters before pushing the code:

```bash
$ git config --local core.hooksPath .githooks/
```

To skip prepush hook use `--no-verify` option:

```bash
$ git push --no-verify
```

### Start development server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
