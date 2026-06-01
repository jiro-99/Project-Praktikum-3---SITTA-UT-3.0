new Vue({
    el: '#loginApp',

    data: {
        form: {
            email: '',
            password: ''
        },
        showPassword: false,
        isSubmitting: false
    },

    created() {
        SittaAuth.redirectIfLoggedIn();
    },

    methods: {
        submitLogin() {
            if (this.isSubmitting) {
                return;
            }

            if (!this.form.email || !this.form.password) {
                Swal.fire(
                    'Data Belum Lengkap',
                    'Email dan password wajib diisi.',
                    'warning'
                );
                return;
            }

            this.isSubmitting = true;
            const user = SittaAuth.login(this.form.email, this.form.password);

            if (!user) {
                this.isSubmitting = false;
                Swal.fire(
                    'Login Gagal',
                    'Email atau password yang Anda masukkan salah.',
                    'error'
                );
                return;
            }

            Swal.fire({
                title: 'Login Berhasil',
                text: 'Selamat datang, ' + user.nama + '.',
                icon: 'success',
                confirmButtonText: 'Masuk Dashboard'
            }).then(() => {
                window.location.href = 'index.html';
            });
        },

        togglePassword() {
            this.showPassword = !this.showPassword;
        },

        showHelp() {
            Swal.fire({
                title: 'Bantuan Login',
                html: `
                    <p>Gunakan akun demo berikut:</p>
                    <p><strong>admin@ut.ac.id</strong> / <strong>admin123</strong></p>
                `,
                icon: 'info'
            });
        }
    }
});
