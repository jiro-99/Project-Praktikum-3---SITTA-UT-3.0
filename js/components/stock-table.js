function registerStockTable() {
    Vue.component('ba-stock-table', {
        props: {
            items: {
                type: Array,
                required: true
            },
            upbjjList: {
                type: Array,
                required: true
            },
            kategoriList: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                keyword: '',
                filterUpbjj: '',
                filterKategori: '',
                filterReorder: false,
                sortBy: 'judul',
                watcherMessage: ''
            };
        },

        computed: {
            filteredKategoriList() {
                if (!this.filterUpbjj) {
                    return [];
                }

                const categories = this.items
                    .filter((item) => item.upbjj === this.filterUpbjj)
                    .map((item) => item.kategori);

                return Array.from(new Set(categories));
            },

            filteredItems() {
                let result = this.items.slice();
                const query = this.keyword.trim().toLowerCase();

                if (query) {
                    result = result.filter((item) => {
                        return item.kode.toLowerCase().includes(query) ||
                            item.judul.toLowerCase().includes(query) ||
                            item.upbjj.toLowerCase().includes(query);
                    });
                }

                if (this.filterUpbjj) {
                    result = result.filter((item) => item.upbjj === this.filterUpbjj);
                }

                if (this.filterKategori) {
                    result = result.filter((item) => item.kategori === this.filterKategori);
                }

                if (this.filterReorder) {
                    result = result.filter((item) => {
                        return Number(item.qty) < Number(item.safety) ||
                            Number(item.qty) === 0;
                    });
                }

                return result.sort((a, b) => {
                    if (this.sortBy === 'judul') {
                        return a.judul.localeCompare(b.judul);
                    }

                    return Number(a[this.sortBy]) - Number(b[this.sortBy]);
                });
            },

            totalMenipis() {
                return this.items.filter((item) => {
                    return Number(item.qty) > 0 && Number(item.qty) < Number(item.safety);
                }).length;
            },

            totalKosong() {
                return this.items.filter((item) => Number(item.qty) === 0).length;
            }
        },

        watch: {
            filterUpbjj(newValue, oldValue) {
                this.filterKategori = '';

                if (newValue) {
                    this.watcherMessage = 'Kategori diperbarui untuk UT-Daerah ' + newValue + '.';
                } else if (oldValue) {
                    this.watcherMessage = 'Filter UT-Daerah direset.';
                }
            },

            filterReorder(newValue) {
                this.watcherMessage = newValue
                    ? 'Mode reorder aktif. Data yang tampil hanya stok menipis atau kosong.'
                    : 'Mode reorder dinonaktifkan.';
            },

            sortBy(newValue) {
                this.watcherMessage = 'Data diurutkan berdasarkan ' + newValue + '.';
            }
        },

        methods: {
            resetFilter() {
                this.keyword = '';
                this.filterUpbjj = '';
                this.filterKategori = '';
                this.filterReorder = false;
                this.sortBy = 'judul';
            }
        },

        template: '#tpl-stock-table'
    });
}
