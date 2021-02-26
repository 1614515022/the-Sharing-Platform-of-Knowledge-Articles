import NavBar from './NavBar.vue';

let MyPlugin = {};

MyPlugin.install = function(Vue){
    Vue.component(NavBar.name,NavBar);

}

export default MyPlugin;