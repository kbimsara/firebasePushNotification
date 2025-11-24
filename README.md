# 🔔 Firebase Push Notification with Next.js

A complete Firebase Cloud Messaging (FCM) push notification test system built with Next.js 15, featuring both foreground and background notification support with automatic deployment via GitHub Actions.

## ✨ Features

- 🔔 **Push Notifications** - Full support for foreground & background notifications
- 🔥 **Firebase Cloud Messaging** - Complete FCM integration
- ⚡ **Next.js 15** - Built with the latest Next.js App Router
- 🎨 **Tailwind CSS** - Modern, responsive UI design
- 🔐 **Secure Backend** - Server-side notification sending with Firebase Admin SDK
- 🚀 **Auto Deployment** - GitHub Actions workflow for Vercel deployment
- 📱 **Service Worker** - Background notification handling

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase project created
- Vercel account (for deployment)
- GitHub account (for CI/CD)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/kbimsara/firebasePushNotification.git
cd firebasePushNotification
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

#### A. Get Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Project Settings** → **General**
4. Scroll to "Your apps" and copy the configuration

#### B. Generate VAPID Key
1. In Firebase Console, go to **Project Settings** → **Cloud Messaging**
2. Scroll to "Web Push certificates"
3. Click **"Generate key pair"**
4. Copy the generated key

#### C. Get Service Account Credentials
1. Go to **Project Settings** → **Service accounts**
2. Click **"Generate new private key"**
3. Download the JSON file
4. Extract `client_email` and `private_key` values

#### D. Enable Firebase Cloud Messaging API
1. Visit [Google Cloud Console - FCM API](https://console.cloud.google.com/apis/library/fcm.googleapis.com)
2. Select your Firebase project
3. Click **"Enable"**

### 4. Set up environment variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration (Client-side - exposed to browser)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (Server-side - keep private)
FIREBASE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"

# Firebase Cloud Messaging - VAPID Key for web push
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_starting_with_B
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and allow notification permissions when prompted.

## 🌐 Deployment to Vercel via GitHub Actions

This project includes automatic deployment to Vercel when code is merged from `dev` to `main` branch.

### Setup Steps

#### 1. Get Vercel Token
- Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
- Click **"Create Token"**
- Give it a name (e.g., "GitHub Actions Deploy")
- Copy and save the token securely

#### 2. Link Project to Vercel
```bash
# Install Vercel CLI globally
npm install -g vercel

# Link your project
vercel link
```

This creates `.vercel/project.json` with your `orgId` and `projectId`.

#### 3. Add GitHub Secrets

Go to your GitHub repository:  
`Settings → Secrets and variables → Actions → New repository secret`

Add these **three secrets**:

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `VERCEL_TOKEN` | Your Vercel token | From step 1 |
| `VERCEL_ORG_ID` | team_xxxxx... | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | prj_xxxxx... | From `.vercel/project.json` |

#### 4. Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add **all** environment variables from your `.env` file
5. Make sure to select **Production**, **Preview**, and **Development** for each variable

#### 5. Deploy

Push your code to trigger deployment:

```bash
# Commit your changes on dev branch
git add .
git commit -m "Your commit message"
git push origin dev

# Merge dev to main to trigger deployment
git checkout main
git merge dev
git push origin main
```

The GitHub Action will automatically:
- Build your Next.js application
- Deploy to Vercel production
- Make it live on your domain

## 📁 Project Structure

```
firebasePushNotification/
├── app/
│   ├── api/
│   │   └── send-notification/
│   │       └── route.ts              # API endpoint for sending notifications
│   ├── hooks/
│   │   └── useFCM.ts                 # Custom React hooks for FCM
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout component
│   └── page.tsx                      # Main page with notification UI
├── public/
│   └── firebase-messaging-sw.js      # Service worker for background notifications
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions deployment workflow
├── firebase.ts                       # Firebase configuration and initialization
├── .env                              # Environment variables (not committed)
├── .gitignore                        # Git ignore file
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Project dependencies
```

## 🔧 How It Works

1. **Service Worker Registration**: The app registers a service worker (`firebase-messaging-sw.js`) to handle background notifications
2. **Permission Request**: Requests notification permission from the user's browser
3. **FCM Token Generation**: Generates a unique FCM token for the device/browser
4. **Notification Sending**: Uses Firebase Admin SDK on the server-side to send push notifications
5. **Notification Display**: 
   - **Foreground**: Displays notifications when the app is open
   - **Background**: Service worker handles notifications when app is closed

## 🎯 Usage

1. Open the application in your browser
2. Click **"Allow"** when prompted for notification permissions
3. Your FCM token will be displayed
4. Enter a notification **title** and **message**
5. Click **"Send Test Notification"**
6. Receive the notification (works even if you close the tab!)

## 🛠️ Troubleshooting

### "Invalid VAPID Key" Error
- Ensure you've generated a VAPID key in Firebase Console
- Verify `NEXT_PUBLIC_FIREBASE_VAPID_KEY` is correctly set in `.env`
- Key should start with "B" and be ~88 characters long

### "Permission Denied" Error
- Enable Firebase Cloud Messaging API in Google Cloud Console
- Verify service account credentials are correct
- Check that private key includes proper newline characters (`\n`)

### Notifications Not Appearing
- Verify browser notification permissions are granted
- Check that service worker is registered (DevTools → Application → Service Workers)
- Look for errors in browser console
- Ensure FCM token is successfully generated

### GitHub Actions Deployment Fails
- Verify all three GitHub secrets are added correctly
- Check that environment variables are set in Vercel dashboard
- Review GitHub Actions logs for specific error messages

## 🔐 Security Notes

- Never commit `.env` file to version control
- Keep your Firebase service account credentials private
- The `.gitignore` file excludes sensitive files
- Use GitHub Secrets for CI/CD credentials

## 📚 Technologies Used

- **Next.js 15** - React framework with App Router
- **Firebase** - Backend services and Cloud Messaging
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - Hosting and deployment platform
- **GitHub Actions** - CI/CD automation

## 📄 License

MIT License - feel free to use this project for learning or production!

## 👤 Author

**kbimsara**
- GitHub: [@kbimsara](https://github.com/kbimsara)
- Repository: [firebasePushNotification](https://github.com/kbimsara/firebasePushNotification)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show your support

Give a ⭐️ if this project helped you!
