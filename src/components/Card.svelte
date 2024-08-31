<script>
    import Tag from "./Tag.svelte";

    export let title = null;
    export let image = null;
    export let description = null;
    export let tags = [];
</script>

<div class="block bg-bright rounded-lg shadow w-1/4 p-2">
    {#if title}
        <h2 class="font-bold text-lg">{title}</h2>
    {/if}

    <img src={image} loading="lazy" alt={image} class="rounded-lg transition-transform duration-400 transform group-hover:scale-115">

    {#if description}
        {description}
    {/if}

    <div class="flex flex-row flex-wrap gap-1 mt-2">
        {#each tags as tag}
            <Tag title={tag} />
        {/each}
    </div>

</div>