<script>
    import { onMount } from "svelte";
    import GalleryItem from "../components/GalleryItem.svelte";
    import Heading from "../components/Heading.svelte";
    import Button from "../components/Button.svelte";
    let projects;

    onMount(async() => {
        const response = await fetch('data/projects.json');
        projects = await response.json();
    });
</script>


<div align="center">

    <div class="flex flex-row items-center justify-center px-8 gap-4">
        <Heading text="Portfolio"/>
        <p class="w-1/3 text-left">
            Hey! I'm Lena, a computer science and archaeology student. On this website, I feature some of my creative projects. For more information about my background, check out <a href='/#/cv' class="text-accent1 hover:text-accent1-hover">my CV</a>! <br>
        </p>
    </div>
    
    {#if projects}
        {#each Object.entries(projects) as [title, project]}
            <GalleryItem {title} image={project.image} href="/#/{title}" />
        {/each}
    {/if}

    <Button>
        Programming Project
    </Button>
    <!-- <Card title="Sewing Projects" image="images/sewing.jpg" tags={["sewing", "another tag", "tag"]} /> -->
</div>
