// hooks/useFirebaseAuth.ts
'use client';

import { useState, useEffect } from 'react';
import {
    signInAnonymously,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export const useFirebaseAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInAnon = async () => {
        try {
            setError(null);
            setLoading(true);
            await signInAnonymously(auth);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
            console.error('Anonymous sign-in error:', err);
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            setError(null);
            setLoading(true);
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
            console.error('Google sign-in error:', err);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setError(null);
            await firebaseSignOut(auth);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign out');
            console.error('Sign-out error:', err);
        }
    };

    return {
        user,
        loading,
        error,
        signInAnon,
        signInWithGoogle,
        signOut,
        isAuthenticated: !!user,
    };
};
