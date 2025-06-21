<script>
    import Router from 'svelte-spa-router'; // https://github.com/ItalyPaleAle/svelte-spa-router
    import routes from './routes.js';
    import TailwindCss from './TailwindCss.svelte';
    import Header from './components/Header.svelte';
    import './app.css';
</script>

<div class="max-h-screen flex flex-col bg-bright text-dark">
    <Header/>

    <div class='h-screen overflow-auto mt-2 flex flex-col w-full bg-dark bg-opacity-5'>
        <Router routes={routes}  />
    </div>
</div>

<TailwindCss />