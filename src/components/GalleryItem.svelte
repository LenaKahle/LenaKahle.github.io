<script>
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    export let title;
    export let image;
    export let href;
</script>

<div class="relative w-[350px] h-[350px] inline-block overflow-hidden group mx-1">
    <a {href} on:click={() => dispatch('click')}>
        <img src={image} loading="lazy" alt={title} class="transition-transform duration-400 transform group-hover:scale-115">
        <div class="absolute top-0 left-0 w-full h-full bg-bright opacity-0 transition-opacity duration-300 group-hover:opacity-80 flex items-center justify-center">
            <div class="text-black text-[40px] font-new-amsterdam leading-tight">{title}</div>
        </div>
    </a>
</div>
