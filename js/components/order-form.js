function registerOrderForm() {
    Vue.component('order-form', {
        props: {
            nextDo: {
                type: String,
                required: true
            },
            paketList: {
                type: Array,
                required: true
            },
            pengirimanList: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                watcherMessage: '',
                form: this.emptyForm()
            };
        },

        computed: {
            selectedPaket() {
                return this.paketList.find((item) => item.kode === this.form.paket) || null;
            },

            totalHarga() {
                return this.selectedPaket ? Number(this.selectedPaket.harga) : 0;
            }
        },

        watch: {
            nextDo(newValue) {
                this.form.nomorDO = newValue;
            },

            'form.paket'(newValue) {
                this.watcherMessage = newValue
                    ? 'Paket dipilih. Detail isi dan total harga diperbarui otomatis.'
                    : '';
            },

            'form.ekspedisi'(newValue) {
                if (newValue) {
                    this.watcherMessage = 'Ekspedisi pengiriman telah dipilih.';
                }
            }
        },

        methods: {
            emptyForm() {
                return {
                    nomorDO: this.nextDo,
                    nim: '',
                    nama: '',
                    ekspedisi: '',
                    paket: '',
                    tanggalKirim: localDateValue()
                };
            },

            validate() {
                if (!this.form.nim ||
                    !this.form.nama ||
                    !this.form.ekspedisi ||
                    !this.form.paket ||
                    !this.form.tanggalKirim) {
                    Swal.fire('Data Belum Lengkap', 'Lengkapi seluruh data Delivery Order.', 'warning');
                    return false;
                }

                if (!/^[0-9]+$/.test(this.form.nim)) {
                    Swal.fire('NIM Tidak Valid', 'NIM hanya boleh berisi angka.', 'warning');
                    return false;
                }

                return true;
            },

            submitOrder() {
                if (!this.validate()) {
                    return;
                }

                const expedition = this.pengirimanList.find((item) => {
                    return item.kode === this.form.ekspedisi;
                });

                this.$emit('created', {
                    nomorDO: this.form.nomorDO,
                    nim: this.form.nim,
                    nama: this.form.nama,
                    status: 'Diproses',
                    ekspedisi: expedition ? expedition.nama : this.form.ekspedisi,
                    tanggalKirim: this.form.tanggalKirim,
                    paket: this.selectedPaket.kode,
                    total: this.totalHarga,
                    perjalanan: [
                        {
                            waktu: localDateTimeValue(),
                            keterangan: 'Delivery Order dibuat pada sistem SITTA UT 3.0.'
                        }
                    ]
                });

                this.form = this.emptyForm();
            }
        },

        template: '#tpl-order-form'
    });
}
