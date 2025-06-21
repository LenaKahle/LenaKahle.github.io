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
        <div class="flex flex-col md:flex-row items-center mx-1 mb-2 justify-center md:gap-4">
            <Heading text={category} />
            <p class="w-full md:w-1/3 text-center md:text-left">
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

