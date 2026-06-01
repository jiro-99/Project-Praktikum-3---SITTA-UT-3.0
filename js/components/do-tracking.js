function registerDoTracking() {
    Vue.component('do-tracking', {
        props: {
            tracking: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                searchTerm: '',
                selectedDO: '',
                progressText: '',
                watcherMessage: ''
            };
        },

        computed: {
            trackingList() {
                return Object.keys(this.tracking).map((key) => this.tracking[key]);
            },

            selectedTracking() {
                return this.selectedDO ? this.tracking[this.selectedDO] || null : null;
            },

            trackingInfo() {
                if (!this.selectedTracking) {
                    return {};
                }

                return {
                    'Nomor DO': this.selectedTracking.nomorDO,
                    'NIM': this.selectedTracking.nim,
                    'Nama': this.selectedTracking.nama,
                    'Status': this.selectedTracking.status,
                    'Ekspedisi': this.selectedTracking.ekspedisi,
                    'Paket': this.selectedTracking.paket
                };
            }
        },

        watch: {
            searchTerm(newValue) {
                if (!newValue) {
                    this.selectedDO = '';
                }
            },

            selectedDO(newValue) {
                this.watcherMessage = newValue
                    ? 'Detail tracking berhasil ditampilkan.'
                    : '';
            }
        },

        methods: {
            searchTracking() {
                const query = this.searchTerm.trim().toUpperCase();

                if (!query) {
                    Swal.fire('Input Kosong', 'Masukkan nomor DO atau NIM.', 'warning');
                    return;
                }

                const found = this.trackingList.find((item) => {
                    return item.nomorDO.toUpperCase() === query || item.nim === query;
                });

                if (!found) {
                    this.selectedDO = '';
                    Swal.fire('Data Tidak Ditemukan', 'Nomor DO atau NIM tidak tersedia.', 'error');
                    return;
                }

                this.selectedDO = found.nomorDO;
            },

            resetSearch() {
                this.searchTerm = '';
                this.selectedDO = '';
                this.watcherMessage = 'Pencarian direset menggunakan tombol Esc.';
            },

            submitProgress() {
                if (!this.progressText.trim() || !this.selectedDO) {
                    Swal.fire('Data Belum Lengkap', 'Isi keterangan progress pengiriman.', 'warning');
                    return;
                }

                this.$emit('add-progress', {
                    nomorDO: this.selectedDO,
                    keterangan: this.progressText.trim()
                });

                this.progressText = '';
            },

            progressValue(status) {
                const value = String(status).toLowerCase();

                if (value.includes('selesai') || value.includes('dikirim')) {
                    return 100;
                }

                if (value.includes('perjalanan')) {
                    return 70;
                }

                return 35;
            }
        },

        template: '#tpl-do-tracking'
    });
}
