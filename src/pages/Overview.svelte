<script>
    import { onMount } from "svelte";
    import ProjectIcon from "../components/ProjectIcon.svelte";
    import Heading from "../components/Heading.svelte";
    
    let data;
    let location = window.location.hash.replace('#/', '');
    let category = location.split('/')[0];


    onMount(async() => {
        const response = await fetch('data/projects.json');
        data = await response.json();
        data = data[category];
        console.log(data);
    });

</script>


<div align="center">
    {#if data}
        <div class="flex flex-row items-center justify-center mx-8 gap-4">
            <Heading text={category} />
            <p class="w-1/3 text-left">
                {#each data.description as description}
                    {description}<br>
                {/each}
            </p>
        </div>

        {#each data.projects as project}
            <ProjectIcon title={project.title} image={project.images[0]} {category} />
        {/each}
    {/if}

</div>

