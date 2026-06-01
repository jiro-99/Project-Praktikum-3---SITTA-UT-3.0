function localDateValue() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;

    return new Date(now.getTime() - offset)
        .toISOString()
        .slice(0, 10);
}

function localDateTimeValue() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;

    return new Date(now.getTime() - offset)
        .toISOString()
        .slice(0, 19);
}

function registerFilters() {
    Vue.filter('rupiah', function (value) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(Number(value || 0));
    });

    Vue.filter('buah', function (value) {
        return Number(value || 0) + ' buah';
    });

    Vue.filter('tanggal-indo', function (value) {
        if (!value) {
            return '-';
        }

        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(value));
    });

    Vue.filter('tanggal-jam-indo', function (value) {
        if (!value) {
            return '-';
        }

        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(value));
    });
}

function emptyStockForm() {
    return {
        index: null,
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: '',
        qty: '',
        safety: '',
        catatanHTML: ''
    };
}

async function startApp() {
    if (!SittaAuth.requireLogin()) {
        return;
    }

    try {
        await SittaApi.loadTemplates();
        const data = await SittaApi.loadData();

        registerFilters();
        registerStatusBadge();
        registerStatCard();
        registerAppHeader();
        registerAppModal();
        registerStockTable();
        registerDoTracking();
        registerOrderForm();

        new Vue({
            el: '#app',

            data: {
                user: SittaAuth.getUser(),
                tab: 'dashboard',
                state: data,
                stockModal: {
                    open: false,
                    mode: 'create'
                },
                stockForm: emptyStockForm()
            },

            computed: {
                reorderCount() {
                    return this.state.stok.filter((item) => {
                        return Number(item.qty) < Number(item.safety) || Number(item.qty) === 0;
                    }).length;
                },

                trackingCount() {
                    return Object.keys(this.state.tracking).length;
                },

                nextDONumber() {
                    const year = new Date().getFullYear();
                    const prefix = 'DO' + year + '-';
                    const numbers = Object.keys(this.state.tracking)
                        .filter((key) => key.startsWith(prefix))
                        .map((key) => Number(key.replace(prefix, '')))
                        .filter((number) => !Number.isNaN(number));
                    const next = numbers.length ? Math.max(...numbers) + 1 : 1;

                    return prefix + String(next).padStart(3, '0');
                }
            },

            watch: {
                tab(newValue) {
                    console.info('Tab aktif:', newValue);
                }
            },

            methods: {
                logout() {
                    Swal.fire({
                        title: 'Logout',
                        text: 'Apakah Anda yakin ingin keluar dari sistem?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Ya, Logout',
                        cancelButtonText: 'Batal'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            SittaAuth.logout();
                        }
                    });
                },

                setTab(tab) {
                    this.tab = tab;
                },

                openCreateStock() {
                    this.stockModal = {
                        open: true,
                        mode: 'create'
                    };
                    this.stockForm = emptyStockForm();
                },

                openEditStock(item) {
                    const index = this.state.stok.findIndex((data) => {
                        return data.kode === item.kode && data.upbjj === item.upbjj;
                    });

                    this.stockModal = {
                        open: true,
                        mode: 'edit'
                    };
                    this.stockForm = {
                        index,
                        ...item
                    };
                },

                closeStockModal() {
                    this.stockModal.open = false;
                },

                validateStock() {
                    const form = this.stockForm;

                    if (!form.kode || !form.judul || !form.kategori || !form.upbjj || !form.lokasiRak) {
                        Swal.fire('Data Belum Lengkap', 'Lengkapi seluruh field bahan ajar.', 'warning');
                        return false;
                    }

                    if (Number(form.harga) <= 0 || Number(form.qty) < 0 || Number(form.safety) < 0) {
                        Swal.fire('Data Tidak Valid', 'Harga harus lebih dari nol. Qty dan safety tidak boleh negatif.', 'warning');
                        return false;
                    }

                    return true;
                },

                saveStock() {
                    if (!this.validateStock()) {
                        return;
                    }

                    const payload = {
                        kode: this.stockForm.kode.toUpperCase(),
                        judul: this.stockForm.judul,
                        kategori: this.stockForm.kategori,
                        upbjj: this.stockForm.upbjj,
                        lokasiRak: this.stockForm.lokasiRak,
                        harga: Number(this.stockForm.harga),
                        qty: Number(this.stockForm.qty),
                        safety: Number(this.stockForm.safety),
                        catatanHTML: this.stockForm.catatanHTML || '-'
                    };

                    if (this.stockModal.mode === 'create') {
                        const duplicate = this.state.stok.some((item) => {
                            return item.kode === payload.kode && item.upbjj === payload.upbjj;
                        });

                        if (duplicate) {
                            Swal.fire('Data Sudah Ada', 'Gunakan tombol edit untuk memperbarui data.', 'error');
                            return;
                        }

                        this.state.stok.push(payload);
                        Swal.fire('Berhasil', 'Bahan ajar baru berhasil ditambahkan.', 'success');
                    } else {
                        this.$set(this.state.stok, this.stockForm.index, payload);
                        Swal.fire('Berhasil', 'Data bahan ajar berhasil diperbarui.', 'success');
                    }

                    this.closeStockModal();
                },

                deleteStock(item) {
                    Swal.fire({
                        title: 'Hapus Bahan Ajar?',
                        text: 'Data ' + item.judul + ' akan dihapus.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Ya, Hapus',
                        cancelButtonText: 'Batal'
                    }).then((result) => {
                        if (!result.isConfirmed) {
                            return;
                        }

                        const index = this.state.stok.indexOf(item);

                        if (index !== -1) {
                            this.state.stok.splice(index, 1);
                        }

                        Swal.fire('Terhapus', 'Data bahan ajar berhasil dihapus.', 'success');
                    });
                },

                handleNewOrder(order) {
                    this.$set(this.state.tracking, order.nomorDO, order);
                    Swal.fire('Berhasil', 'Delivery Order ' + order.nomorDO + ' berhasil dibuat.', 'success');
                    this.tab = 'tracking';
                },

                addProgress(payload) {
                    const item = this.state.tracking[payload.nomorDO];

                    if (!item) {
                        return;
                    }

                    item.perjalanan.push({
                        waktu: localDateTimeValue(),
                        keterangan: payload.keterangan
                    });
                    item.status = 'Dalam Perjalanan';
                    Swal.fire('Progress Ditambahkan', 'Riwayat perjalanan berhasil diperbarui.', 'success');
                }
            }
        });
    } catch (error) {
        console.error(error);
        Swal.fire(
            'Aplikasi Gagal Dimuat',
            error.message + ' Pastikan project dibuka melalui Live Server.',
            'error'
        );
    }
}

startApp();
