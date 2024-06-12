<script>
    import Router from 'svelte-spa-router'; // https://github.com/ItalyPaleAle/svelte-spa-router
    import routes from './routes.js';
    import TailwindCss from './TailwindCss.svelte';
    import Header from './components/Header.svelte';
</script>

<main>
    <div class="max-h-screen flex flex-col">
        <Header />
        <Router routes={routes}  />
    </div>
    
    <TailwindCss />
</main>