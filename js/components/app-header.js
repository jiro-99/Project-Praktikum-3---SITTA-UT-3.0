function registerAppHeader() {
    Vue.component('app-header', {
        props: {
            activeTab: {
                type: String,
                default: 'dashboard'
            },
            user: {
                type: Object,
                default: null
            }
        },

        methods: {
            changeTab(tab) {
                this.$emit('change-tab', tab);
            },

            logout() {
                this.$emit('logout');
            }
        },

        template: '#tpl-app-header'
    });
}
