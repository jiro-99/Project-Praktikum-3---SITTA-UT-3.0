function registerStatusBadge() {
    Vue.component('status-badge', {
        props: {
            qty: {
                type: Number,
                required: true
            },
            safety: {
                type: Number,
                required: true
            },
            note: {
                type: String,
                default: '-'
            }
        },

        data() {
            return {
                hover: false
            };
        },

        computed: {
            status() {
                if (Number(this.qty) === 0) {
                    return {
                        text: 'Kosong',
                        icon: '⛔',
                        className: 'status-danger'
                    };
                }

                if (Number(this.qty) < Number(this.safety)) {
                    return {
                        text: 'Menipis',
                        icon: '⚠️',
                        className: 'status-warning'
                    };
                }

                return {
                    text: 'Aman',
                    icon: '✅',
                    className: 'status-success'
                };
            }
        },

        template: '#tpl-status-badge'
    });
}
