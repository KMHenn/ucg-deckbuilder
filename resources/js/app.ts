import './bootstrap';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, h, DefineComponent } from 'vue';
import jQuery from 'jquery';
window.$ = jQuery;

// Global theme toggle functionality
$(function(){
    $('#toggle-dark,#toggle-light').on('click', () => { 
        console.log('clicked toggle');
        $('body').toggleClass('dark');
        $('#toggle-dark').toggleClass('hidden');
        $('#toggle-light').toggleClass('hidden'); 
    });
});

// Initialize inertia
createInertiaApp({
    title: (title) => 'UCG Deckbuilder',
    resolve: (name) => resolvePageComponent(
        `./pages/${name}.vue`, 
        import.meta.glob<DefineComponent>('./pages/**/*.vue')
    ),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});