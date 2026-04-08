# Hoose Task Tracker

Tap an NFC tag → confirmation page → logs a completed task to Google Tasks.

---

## Setup credentials

### 1.1 Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)

### 1.2 Enable the Tasks API

1. **APIs & Services → Library**
2. Search **Google Tasks API** → **Enable**

### 1.3 Create OAuth2 credentials

1. **APIs & Services → Credentials → + Create Credentials → OAuth client ID**
2. Configure consent screen if prompted:
   - User type: **External**
   - App name: `NFC Task Tracker`
   - Add your Google account as a test user
   - Scope: `https://www.googleapis.com/auth/tasks`
3. Application type: **Web application**
4. Authorized redirect URIs: add `https://developers.google.com/oauthplayground`
5. **Create** → copy **Client ID** and **Client Secret**

### 1.4 Get a refresh token

1. Go to [developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)
2. Click ⚙️ top right → check **Use your own OAuth credentials** → paste Client ID and Secret
3. Left panel → **Tasks API v1** → select `https://www.googleapis.com/auth/tasks`
4. **Authorize APIs** → sign in → Allow
5. **Exchange authorization code for tokens** → copy the **Refresh token**

---

## Adding new tasks

Edit `src/app/tasks.ts`:

```ts
{ id: "my-new-task", name: "My new task", icon: "🪴" },
```

Rebuild:
```bash
npm run build
```

## Running on server
```aiignore
NODE_OPTIONS=--max-old-space-size=4096 npm run build
nohup npm run start > app.log 2>&1 & #run in background
```

## Tail logs
```aiignore
tail -f app.log
```

## Kill server
```aiignore
fuser -k 3000/tcp
```