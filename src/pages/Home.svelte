<script>
    import { onMount } from "svelte";
    import GalleryItem from "../components/GalleryItem.svelte";
    import Card from "../components/Card.svelte";
    import Heading from "../components/Heading.svelte";
    let projects;
    let exampletext = "Portfolio";

    onMount(async() => {
        const response = await fetch('data/projects.json');
        projects = await response.json();
    });
</script>


<!-- <Heading text="Lena's Portfolio" /> -->

<div align="center">
    {#if projects}
        {#each Object.entries(projects) as [title, project]}
            <GalleryItem {title} image={project.image} href="/#/{title}" />
        {/each}
    {/if}

    <Card title="Sewing Projects" image="images/sewing.jpg" tags={["sewing", "another tag", "tag"]} />
</div>
