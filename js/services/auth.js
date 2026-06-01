const SittaAuth = {
    storageKeys: {
        status: 'sittaLoginStatus',
        user: 'sittaUserLogin'
    },

    users: [
        {
            id: 1,
            nama: 'Admin SITTA',
            email: 'admin@ut.ac.id',
            password: 'admin123',
            role: 'Administrator',
            lokasi: 'Pusat'
        },
        {
            id: 2,
            nama: 'Ryan Qory Azmarudin',
            email: 'ryan@ut.ac.id',
            password: 'ryan123',
            role: 'UPBJJ-UT',
            lokasi: 'Jakarta'
        }
    ],

    login(email, password) {
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const normalizedPassword = String(password || '').trim();

        const user = this.users.find((item) => {
            return item.email.toLowerCase() === normalizedEmail &&
                item.password === normalizedPassword;
        });

        if (!user) {
            return null;
        }

        const safeUser = {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role,
            lokasi: user.lokasi
        };

        localStorage.setItem(this.storageKeys.status, 'true');
        localStorage.setItem(this.storageKeys.user, JSON.stringify(safeUser));

        return safeUser;
    },

    isLoggedIn() {
        return localStorage.getItem(this.storageKeys.status) === 'true' &&
            Boolean(localStorage.getItem(this.storageKeys.user));
    },

    getUser() {
        const raw = localStorage.getItem(this.storageKeys.user);

        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw);
        } catch (error) {
            this.clear();
            return null;
        }
    },

    clear() {
        localStorage.removeItem(this.storageKeys.status);
        localStorage.removeItem(this.storageKeys.user);
    },

    logout() {
        this.clear();
        window.location.href = 'login.html';
    },

    requireLogin() {
        if (this.isLoggedIn()) {
            return true;
        }

        window.location.href = 'login.html';
        return false;
    },

    redirectIfLoggedIn() {
        if (this.isLoggedIn()) {
            window.location.href = 'index.html';
            return true;
        }

        return false;
    }
};
