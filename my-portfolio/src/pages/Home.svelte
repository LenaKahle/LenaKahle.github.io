<script>
    import { onMount } from "svelte";
    import GalleryItem from "../components/GalleryItem.svelte";
    let projects;

    onMount(async() => {
        const response = await fetch('data/projects.json');
        projects = await response.json();
    });
</script>

{#if projects}
    {#each Object.entries(projects) as [title, project]}
        <GalleryItem {title} image={project.image} href="/{title}" />
    {/each}
{/if}