function registerAppModal() {
    Vue.component('app-modal', {
        props: ['title'],
        template: '#tpl-app-modal'
    });
}
