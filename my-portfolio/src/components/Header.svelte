<script>
    import Button from '../components/Button.svelte';
    import Sidebar from './Sidebar.svelte';

    export let pageTitle;
    export let description;

    let sidebarVisible = false;
</script>

<div class="flex gap-10 justify-between items-center pt-2 pb-2 px-4 text-secondary-text shadow z-20">
    <!-- Left section with menu -->
    <div class="items-center flex-shrink-0 flex">
        <Button on:click={() => sidebarVisible = !sidebarVisible} variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </Button>
    </div>

    <div class="absolute left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center">
        <div class="font-bold text-lg leading-tight">{pageTitle}</div>
        {#if description}
            <div class="text-sm leading-tight">{description}</div>
        {/if}
    </div>

    <div class="font-semibold">
        Berufsberatungsfragebogen
    </div>
</div>

<!-- <Sidebar bind:sidebarVisible /> -->