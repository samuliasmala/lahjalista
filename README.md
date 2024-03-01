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

### Setting the environment variables

Create `.env` file using `.env.example` as a template.

Change the DATABASE_URL variable to match your database user's details.

For example: `DATABASE_URL="postgresql://johndoe:JohnDoeDoesPostgres@localhost:5432/johnDB?schema=public"`

`johnDB` in DATABASE_URL can be named whatever wanted. Prisma will make a new database if it does not exist.

### Run the migratiation

Run the migrations:

```bash
npx prisma migrate deploy
```

after this, the database is set up!

### Start development server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
