<script>
    import { onMount } from "svelte";
    import Gallery from "../components/Gallery.svelte";

    export let title;
    export let category;
    let project;

    onMount(async() => {
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        project = projects[category].projects.find(p => p.title === title);
    });
</script>

<div class="flex flex-row justify-between m-2">
    {#if project}
    
        <div class="w-auto">
            <h1 class="text-[100px] leading-none font-new-amsterdam">{project.title}</h1>

            <p class="text-left">
                {#each project.description as infotext}
                    <p>{infotext}</p><br>
                {/each}
            </p>
    
        </div>

        <div class="w-full">
            <Gallery images={project.images} />
        </div>
    {/if}
</div>
