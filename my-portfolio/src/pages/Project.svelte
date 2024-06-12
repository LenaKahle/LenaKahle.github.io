<script>
    import { onMount } from "svelte";
    import { params } from 'svelte-spa-router';

    let category = params.category;
    let title = params.title;
    let project;

    onMount(async() => {
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        project = projects[category].find(p => p.title === title);
    });
</script>

{#if project}
    <div>{project.title}</div>

    {#each project.description as infotext}
        <div>{infotext}</div>
    {/each}

    {#each project.images as image}
        <img src={image} loading="lazy" alt="project" class="webimage">
    {/each}
{/if}