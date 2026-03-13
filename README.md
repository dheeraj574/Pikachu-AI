<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy For Free

This project is not a static frontend only app. It uses:

- a React frontend built by Vite
- an Express server in `server.ts`
- a local SQLite database file

Because of that, deploy it as a single Node.js web service.

### Best free option without a subscription

Koyeb is a good fit for this project because its free plan can deploy one web service without requiring a paid subscription.

### Before deploying

1. Push this project to GitHub.
2. Add a `.env` value for `GEMINI_API_KEY`.
3. Keep in mind that SQLite data written after deploy may not persist forever on free hosting unless you attach persistent storage.

### Koyeb steps

1. Create a free account at Koyeb.
2. Click `Create App`.
3. Choose `GitHub` and select this repository.
4. For the service type, choose `Web Service`.
5. Use these values:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Port: leave auto-detect enabled
6. Add environment variable:
   - `GEMINI_API_KEY=your_key_here`
7. Deploy.

After deployment, Koyeb will give you a public URL like `https://your-app.koyeb.app`.

### Important limitation

The app currently uses a local SQLite file. That is fine for demos and personal testing, but any new data added in production can be lost on some free hosting environments after a restart or redeploy.
