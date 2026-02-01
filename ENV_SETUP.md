# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Firebase Client Configuration
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Firebase Admin (Server-side)
```env
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

### External APIs
```env
NEXT_PUBLIC_CHATBOT_API_URL=https://mosque-of-india-chatbot.onrender.com
NEXT_PUBLIC_ALADHAN_API_URL=https://api.aladhan.com/v1
```

## Firebase Setup Instructions

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Anonymous" and "Google" providers
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Add security rules (see below)
5. Get credentials:
   - Project Settings > General > Your apps > Web app
   - Copy the config values to `.env.local`
6. For Admin SDK:
   - Project Settings > Service accounts
   - Generate new private key
   - Copy values to `.env.local`

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Conversations: users can only access their own
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Messages: users can only access messages in their conversations
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/conversations/$(resource.data.conversationId)) &&
        get(/databases/$(database)/documents/conversations/$(resource.data.conversationId)).data.userId == request.auth.uid;
    }
  }
}
```

## Dependencies Installation

Run the following command to install required packages:

```bash
npm install firebase firebase-admin react-markdown remark-gfm
```

Note: If you encounter PowerShell execution policy errors, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use CMD instead of PowerShell to run npm commands.
