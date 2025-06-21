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

<div class="flex flex-col md:flex-row justify-between m-2">
    {#if project}
        <div class="w-full md:w-auto">
            <h1 class="text-[40px] md:text-[100px] font-new-amsterdam">{project.title}</h1>
            <div class="text-left">
                {#each project.description as infotext}
                    <p>{infotext}</p>
                {/each}
            </div>
        </div>
        <div class="w-full">
            <Gallery images={project.images} />
        </div>
    {/if}
</div>
