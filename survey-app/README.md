# Habesha Survey

The market share study, as its own app. Separate from the wheel: its
own URL, its own icon on the phone, its own sign-in. A BA doing field
research never passes through the activation screens.

## What it does

Sign in, then one screen per question:

1. Outlet name and outlet ID, typed from the route sheet
2. Rank the brands by sales, highest first
3. Crates bought in a typical week
4. Main reason Habesha sells less than other brands

Brands are Habesha, Harar, Dashen, Bedele, St. George, Meta, and a
free-text Other. They live in `src/services/surveyService.js`, in the
order they appear on screen.

A completed questionnaire that cannot reach the server is kept on the
phone and uploaded next time the app opens. The home screen shows how
many are waiting and why the last attempt failed.

## Backend

Same Apps Script deployment and same spreadsheet as the wheel app. This
app only ever sends two actions, `login` and `addSurvey`, and writes to
the `Surveys` tab.

`src/config.js` holds the `/exec` URL. If the backend is redeployed to a
new URL, both apps need it.

## Deploying

A second Vercel project pointed at this folder of the same repo:

1. Vercel → Add New → Project → import `habesha-app` again
2. Root Directory: `survey-app`
3. Deploy

`vercel.json` already handles SPA routing. Pushes to `main` rebuild both
projects, each from its own folder.

## Local

```
npm install
npm run dev
```
