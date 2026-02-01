// lib/firebase/admin.ts

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let adminDb: Firestore;
let adminAuth: Auth;

if (!getApps().length) {
    try {
        app = initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
                clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        adminDb = getFirestore(app);
        adminAuth = getAuth(app);
    } catch (error) {
        console.error('Firebase admin initialization error:', error);
        throw error;
    }
} else {
    app = getApps()[0];
    adminDb = getFirestore(app);
    adminAuth = getAuth(app);
}

export { app as adminApp, adminDb, adminAuth };
