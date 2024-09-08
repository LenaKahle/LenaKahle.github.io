<script>
    import { onMount } from "svelte";
    import {push} from "svelte-spa-router";

    let location = window.location.hash.replace('#/', '');

    let category = location.split('/')[0];
    let title = location.split('/')[1].split('_').join(' ');
    let project;

    onMount(async() => {
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        project = projects[category].projects.find(p => p.title === title);
    });
</script>


<div align="center">
    <button on:click={() => push("/" + category)}>Back to the {category} projects overview</button>

    {#if project}
        <h1 class="text-[100px] leading-tight font-new-amsterdam">{project.title}</h1>

        <p class="w-2/3 text-left">
            {#each project.description as infotext}
                <div>{infotext}</div>
            {/each}
        </p>



        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            {#each project.images as image}
                <img src={image} loading="lazy" alt="project" class="w-[350px] h-auto">
            {/each}
        </div>
    {/if}
</div>