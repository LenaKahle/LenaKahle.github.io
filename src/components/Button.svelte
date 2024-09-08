<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let mainColor = 'accent1';
    export let shadowColor = 'accent2';
</script>


<button class="" on:click={() => dispatch('click')}>
    <rect class="relative bg-{shadowColor}" />
    <rect class="w-4 h-4 absolute bg-{mainColor}" style="top: 2px; left: 2px;">
    <slot />
</button>