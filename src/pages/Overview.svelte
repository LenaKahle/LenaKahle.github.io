<script>
    import { onMount } from "svelte";
    import GalleryItem from "../components/GalleryItem.svelte";
    let data;
    let area = window.location.hash.replace('#/', '');

    onMount(async() => {
        const response = await fetch('data/projects.json');
        data = await response.json();
        data = data[area];
        console.log(data);
    });
</script>

<div align="center">
    {#if data}
        {#each data.projects as project}
            <GalleryItem title={project.title} image={project.images[0]} href="/#/{project.title}" />
        {/each}
    {/if}
</div>