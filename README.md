# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/822b4d26-11a1-4772-bb57-88d46eff375e

## Authentication System (Demo Mode)

This project includes a **simulated authentication system** for demonstration purposes. 

### ⚠️ IMPORTANT: Demo Mode Only
This authentication system stores user data in localStorage and is NOT secure for production use. It's designed for rapid prototyping and testing.

### Features
- Sign In / Sign Up with email and password
- Session persistence across page reloads
- Automatic "Create account?" prompt for new emails
- Wallet address linking to user accounts
- Authorization headers on API calls

### How It Works
1. **User data** is stored in localStorage as JSON
2. **Session tokens** use format `SIM-TOKEN-<uuid>`
3. **Passwords** are base64 encoded (NOT secure - for demo only)
4. **API calls** automatically include `Authorization: Bearer <token>`

### Testing Steps
1. Click "Sign In" in the navigation
2. Try signing in with a non-existent email - you'll see "Create account?" prompt
3. Create an account with name, email, and password (min 6 chars)
4. After sign-in, see "Welcome, [Name]" in the nav with dropdown menu
5. Connect a wallet to link it to your account
6. Sign out and sign back in - session persists

### Migrating to Production Auth
Replace the simulated auth with a real solution:

1. **Backend Setup** - Choose one:
   - JWT with Node.js/Express backend
   - Firebase Authentication
   - Supabase Auth (recommended for Lovable projects)
   - Auth0, Clerk, or other auth providers

2. **Replace AuthContext.tsx**:
   ```typescript
   // Replace localStorage with real API calls
   const signIn = async (email, password) => {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       body: JSON.stringify({ email, password })
     });
     const { token, user } = await response.json();
     // Store token securely (httpOnly cookie recommended)
   }
   ```

3. **Update API client** in `src/lib/api.ts` to use real tokens

4. **Add backend validation** for the `SIM-TOKEN-` format during migration

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/822b4d26-11a1-4772-bb57-88d46eff375e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/822b4d26-11a1-4772-bb57-88d46eff375e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
