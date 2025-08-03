// auth.js
import { UserManager } from 'https://cdn.jsdelivr.net/npm/oidc-client-ts@2.0.3/+esm';

const clientId = '4r6e4dq8ln3s4oqoveb6fr8sf7';
const domain = 'https://us-east-1j7mnsvnal.auth.us-east-1.amazoncognito.com'; // ✅ This is your Hosted UI domain

const redirectUri = 'https://jessaherz.de/shop.html';

const config = {
    authority: domain,
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email phone',
};

export const userManager = new UserManager(config);

export async function handleRedirectCallback() {
    if (!window.location.search.includes('code=')) {
        return null;
    }

    try {
        const user = await userManager.signinRedirectCallback();
        localStorage.setItem('userId', user.profile.sub);
        return user;
    } catch (error) {
        console.error('Redirect callback failed:', error);
        return null;
    }
}

export async function getCurrentUser() {
    return await userManager.getUser();
}

export async function login() {
    await userManager.signinRedirect();
}

export function logout() {
    const logoutUrl = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(redirectUri)}`;
    localStorage.removeItem('userId');
    window.location.href = logoutUrl;
}
