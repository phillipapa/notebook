import { useGoogleLogin } from '@react-oauth/google';
import { type JSX, useState } from 'react';
import { createAlert } from '@/utils/createAlert';
import type { LoginState } from '@/configs/interfaces';

export const SignInMenu = ({ onLogin, onLogout }: LoginState): JSX.Element => {
    const [user, setUser] = useState<{ name: string; email: string; } | null>(null);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tokenResponse),
            });
            const data = await res.json();
            setUser({ name: data.name, email: data.email });
            if (onLogin) {
                onLogin(tokenResponse.access_token!)
            }
        },
        onError: () => createAlert('Error', 'Login Failed, please try again', 'error'),
        scope: 'https://www.googleapis.com/auth/drive.file',
    });

    const logout = () => {
        setUser(null);
        if (onLogout) {
            onLogout()
        }
    }

    return (
        <div className="flex items-center space-x-4">
            {user ? (
                <>
                <span>{user.name}</span>
                <button onClick={logout} className="bg-yellow-400 text-black font-semibold px-3 py-1 rounded">Sign out</button>
                </>
            ) : (
                <button onClick={(e) => { e.preventDefault(); login(); }} className="bg-green-400 text-black font-semibold px-3 py-1 rounded">Sign in with Google</button>
            )}
        </div>
    );
}
