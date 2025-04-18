# Table of contents

- [Getting Started](README.md#getting-started)
- [Google API and Google Spreadsheets Setup](README.md#google-api-and-google-spreadsheets-setup)
- [Troubleshooting Errors](README.md#troubleshooting-errors)

## Getting Started

### Lint before pushing

To prevent code with linter errors from reaching the repository, enable a pre-push script that runs linters before pushing:

```bash
$ git config --local core.hooksPath .githooks/
```

If you need to bypass the pre-push hook for a specific push, you can use the `--no-verify` option:

```bash
$ git push --no-verify
```

### Setting Environment Variables

1. **Create a `.env` file:** Use `.env.example` as a template.
2. **Set the DATABASE_URL variable:** Modify this variable to reflect your database user's details. Here's an example format:

   ```
   DATABASE_URL="postgresql://johndoe:JohnDoeDoesPostgres@localhost:5432/johnDB?schema=public"
   ```

   - `johnDB` in the DATABASE_URL can be named as desired. Prisma will create a new database if it doesn't exist.

### Running Migrations

Run the migrations to set up the database schema:

```bash
npx prisma migrate deploy
```

After this step, your database is ready to go!

### Google API Setup

**Note:** To send feedback to Google Sheets, you'll need a Google Account and [follow these steps](README.md#google-api-and-google-spreadsheets-setup). **If you don't require this functionality, remove the following line from `/pages/api/feedback/index.ts`:**

```ts
sendFeedbackToGoogleSheets({
  feedbackText: parsedFeedback.feedbackText,
  userUUID: userData.uuid,
}).catch((e) => {
  console.error(e);
});
```

### Starting Development Server

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the application.

## Google API and Google Spreadsheets Setup

**Prerequisites:**

- A Google Account

### Google Cloud Resources

Here are some additional resources from Google Cloud to explore, or you can follow the guide below:

- Creating a Project: [https://developers.google.com/workspace/guides/create-project](https://developers.google.com/workspace/guides/create-project)
- Service Accounts: [https://cloud.google.com/iam/docs/service-accounts-create](https://cloud.google.com/iam/docs/service-accounts-create)

### 1. Create a Project

1. Go to [https://console.cloud.google.com/projectcreate](https://console.cloud.google.com/projectcreate) and create a new project.
2. Choose a Project ID freely; you don't need to assign it to an organization.

### 2. Create a Service Account

1. Navigate to "IAM & Admin" -> "Service Accounts" or [https://console.cloud.google.com/iam-admin/serviceaccounts](https://console.cloud.google.com/iam-admin/serviceaccounts).
2. Click "Create service account" in the top bar.
3. Fill in the "Service account detail" fields. Only `Service account ID` is mandatory.
4. Click "Done" after completing the details. Access grants for the Service Account aren't required at this stage.

### 3. Create a Service Account Key

1. Click the three dots next to the Service Account you just created and select "Manage keys."
2. Click "ADD KEY" -> "Create new key" -> "JSON" -> "Create."
3. Save the downloaded JSON file into your project, for example inside the root directory (the file can be saved anywhere inside the project, just remember to set the path in `.env` file). Prepend `google_service_account-` to the filename before saving to ignore it from git. For example:

   ```
   google_service_account-arctic-diode-438812-b5-7338724a2dea.json
   ```

**Important:** You won't be able to retrieve the JSON file again, so keep it secure. If you lose it, you'll need to create a new key for the Service Account.

### 4. Enable Google Sheets API

Go to [https://console.cloud.google.com/apis/api/sheets.googleapis.com/](https://console.cloud.google.com/apis/api/sheets.googleapis.com/) and enable the API. It might take a few minutes for the API to become active.

### 5. Set Up Google Spreadsheets

1. Create a new spreadsheet. The name can be chosen freely.
2. Change the Sheet's name from the bottom to `Palautteet`.
3. The API appends A|B|C rows, so it might be a good idea to give headers to the values. For example: Cell A1: `Palaute`, cell B1: `Palautteen antaja`, cell C1: `Päivämäärä`.

### 6. Sharing the Spreadsheet with the Service Account

1. Click "Share" in the top right corner of the spreadsheet.
2. Add the project's email address (found in the downloaded JSON file under `client_email`) to the sharing list.
3. Grant the Service Account "Editor" privileges.

### 7. Configuring .env Variables

The last step is to modify two values in the `.env` file:

- **SPREADSHEET_ID:** Replace the placeholder with the actual ID of your Google Sheet. You can find the ID in the spreadsheet's URL.
- **GOOGLE_SERVICE_ACCOUNT_JSON_FILE:** Set this value to the filename (if it was not placed inside the root folder, set the file's path. More details in `.env.example`) of the JSON file you downloaded earlier (e.g., `google_service_account-arctic-diode-438812-b5-7338724a2dea.json`).

After making these changes, save the `.env` file.

## Troubleshooting Errors

### Error: `dotenv: not found`

- Ensure you've installed the `dotenv-cli` package. It's usually installed with other dependencies when using `npm i`. If not, use:

  ```bash
  npm i dotenv-cli
  ```

If you still encounter the error, try installing `dotenv-cli` globally:

```bash
npm install -g dotenv-cli
```

**Note:** You might need root access for global installation on Linux.

### Error while running SVGR (npm run svgr)

If you get this following error while running `npm run svgr`:

```
Failed to handle file: public/images/icons/contact-details.svg # NOTE, this is just an example .svg file
/lahjalista/node_modules/@svgr/cli/dist/index.js:435
throw error;
^

Error [ERR_REQUIRE_ESM]: require() of ES Module /lahjalista/node_modules/prettier-plugin-tailwindcss/dist/index.mjs not supported.
Instead change the require of /lahjalista/node_modules/prettier-plugin-tailwindcss/dist/index.mjs to a dynamic import() which is available in all CommonJS modules.
```

Head to `.prettierrc`file and remove the following line:`"plugins": ["prettier-plugin-tailwindcss"]`. Save the `.prettierrc`and try to run`npm run svgr` again. Now it should work. Remember to add the removed line back.
