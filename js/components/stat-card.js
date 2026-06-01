function registerStatCard() {
    Vue.component('stat-card', {
        props: ['label', 'value'],
        template: '#tpl-stat-card'
    });
}
