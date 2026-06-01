const SittaApi = {
    templateFiles: [
        'templates/status-badge.html',
        'templates/stat-card.html',
        'templates/app-header.html',
        'templates/app-modal.html',
        'templates/stock-table.html',
        'templates/do-tracking.html',
        'templates/order-form.html'
    ],

    async fetchText(path) {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error('Gagal membaca file: ' + path);
        }

        return response.text();
    },

    async loadTemplates() {
        const templates = await Promise.all(
            this.templateFiles.map((path) => this.fetchText(path))
        );

        document.getElementById('template-host').innerHTML = templates.join('\n');
    },

    async loadData() {
        const response = await fetch('data/dataBahanAjar.json');

        if (!response.ok) {
            throw new Error('File JSON tidak dapat dibaca. Jalankan project melalui Live Server.');
        }

        const raw = await response.json();

        return {
            upbjjList: raw.upbjjList || [],
            kategoriList: raw.kategoriList || [],
            pengirimanList: this.normalizePengiriman(raw.pengirimanList || []),
            paket: raw.paket || [],
            stok: raw.stok || [],
            tracking: this.normalizeTracking(raw.tracking || [])
        };
    },

    normalizePengiriman(items) {
        return items.map((item) => {
            const lower = item.nama.toLowerCase();
            const isExpress = item.kode === 'EXP' || lower.includes('ekspres');

            return {
                kode: item.kode,
                nama: isExpress ? 'JNE Express' : 'JNE Regular',
                estimasi: item.nama
            };
        });
    },

    normalizeTracking(rawTracking) {
        const normalized = {};

        if (Array.isArray(rawTracking)) {
            rawTracking.forEach((entry) => {
                Object.keys(entry).forEach((nomorDO) => {
                    if (!normalized[nomorDO]) {
                        normalized[nomorDO] = this.enrichTracking(nomorDO, entry[nomorDO]);
                    }
                });
            });
        } else {
            Object.keys(rawTracking).forEach((nomorDO) => {
                normalized[nomorDO] = this.enrichTracking(nomorDO, rawTracking[nomorDO]);
            });
        }

        return normalized;
    },

    enrichTracking(nomorDO, data) {
        return {
            nomorDO,
            nim: data.nim || '',
            nama: data.nama || '',
            status: data.status || 'Diproses',
            ekspedisi: data.ekspedisi || '',
            tanggalKirim: data.tanggalKirim || '',
            paket: data.paket || '',
            total: Number(data.total || 0),
            perjalanan: data.perjalanan || []
        };
    }
};
