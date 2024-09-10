<script>
    import { onMount } from "svelte";
    import GalleryItem from "../components/GalleryItem.svelte";
    import Heading from "../components/Heading.svelte";
    import Project from "./Project.svelte";
    import Popup from "../components/Popup.svelte";
    
    let data;
    let location = window.location.hash.replace('#/', '');
    let category = location.split('/')[0];
    let openProject = false;


    onMount(async() => {
        const response = await fetch('data/projects.json');
        data = await response.json();
        data = data[category];
        console.log(data);
    });

    function openProjectPopup(title) {
        openProject = title;        
    }

    function closeProjectPopup() {
        openProject = false;
    }
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
            <GalleryItem title={project.title} image={project.images[0]} href="/#/{category}" on:click={()=> openProjectPopup(project.title)} />
        {/each}
    {/if}

</div>

<Popup isOpen={openProject} width="w-10/12" on:closePopup={closeProjectPopup}>
    <Project title={openProject} {category} />
</Popup>
