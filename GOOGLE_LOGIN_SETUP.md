# Setting up Google Login

Google sign-in needs real OAuth credentials from Google. Without them the
"Continue with Google" button can't work (it has no app to talk to). Follow
these steps once — it takes ~5 minutes.

## 1. Create an OAuth client in Google Cloud Console

1. Go to <https://console.cloud.google.com/apis/credentials>.
2. Pick a project (or create one — any name, e.g. `MayiEat`).
3. If prompted, configure the **OAuth consent screen**:
   - User type: **External**
   - App name: `MayiEat`, add your email as support + developer contact.
   - Scopes: the defaults (`email`, `profile`, `openid`) are enough.
   - Under **Test users**, add the Google account(s) you'll log in with
     (required while the app is in "Testing" mode).
4. Back on **Credentials**, click **Create Credentials → OAuth client ID**.
5. Application type: **Web application**.
6. Add these exactly (note the dev port is **3001**):

   **Authorized JavaScript origins**
   ```
   http://localhost:3001
   ```

   **Authorized redirect URIs**
   ```
   http://localhost:3001/api/auth/callback/google
   ```

   > Testing from your phone on the same WiFi? Also add your PC's LAN address,
   > e.g. `http://192.168.1.50:3001` (origin) and
   > `http://192.168.1.50:3001/api/auth/callback/google` (redirect URI).

7. Click **Create**. Copy the **Client ID** and **Client secret**.

## 2. Put the credentials in your `.env` files

**`frontend/.env.local`** — used by Auth.js for the browser login flow:

```env
NEXT_PUBLIC_API_URL="/api/v1"
# Generate a strong value:  openssl rand -base64 32
NEXTAUTH_SECRET="<a-strong-random-32+-char-string>"
GOOGLE_CLIENT_ID="<your-client-id>.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="<your-client-secret>"
```

**`backend/.env`** — the backend verifies the Google token, so it needs the
**same Client ID** (the secret is not required here):

```env
GOOGLE_CLIENT_ID="<your-client-id>.apps.googleusercontent.com"
```

## 3. Restart the dev servers

```bash
npm run dev
```

Open <http://localhost:3001/login> and click **Continue with Google**.

## How the flow works (for reference)

1. Auth.js redirects to Google, the user consents, Google returns an
   **ID token** to the frontend.
2. The frontend posts that ID token to the backend `POST /api/v1/auth/google`.
3. The backend verifies it against `GOOGLE_CLIENT_ID`, upserts the user, and
   returns its own JWT, which the session carries as `backendJwt`.

## Troubleshooting

- **`redirect_uri_mismatch`** — the redirect URI in Google Console must match
  the URL bar exactly, including `http`, host, and port `3001`.
- **`Access blocked` / `403`** — add your Google account under **Test users**
  on the consent screen.
- **Bounced back to `/login` with an error banner** — the backend rejected the
  token. Confirm `GOOGLE_CLIENT_ID` is identical in `frontend/.env.local` and
  `backend/.env`, and that the backend is running on port 4000.
- **`UntrustedHost`** — already handled (`trustHost: true` in `auth.ts`), but if
  you still see it in production, set `NEXTAUTH_URL` to your canonical URL.
- **No credentials yet?** In development you can still use the
  **"Continue as Dev User"** button on the login page to bypass Google.
