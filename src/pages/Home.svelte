<script>
    import { onMount } from "svelte";
    import ProjectIcon from "../components/ProjectIcon.svelte";
    import Heading from "../components/Heading.svelte";
    import { push } from "svelte-spa-router";
    let projects;

    onMount(async() => {
        const response = await fetch('data/projects.json');
        projects = await response.json();
        console.log(projects)
    });
</script>


<div align="center">
    <div class="items-center justify-center m-8 gap-4">
        <p class="font-new-amsterdam text-[100px]">Welcome to my portfolio!</p>
        <p>
            I'm Lena, a computer science and archaeology student. On this website, I feature some of my creative projects.

        </p>
        <p>For more information about my background, check out <a href='/#/cv' class="text-accent1 hover:text-accent1-hover">my CV</a>!</p>
    </div>
    
    {#if projects}
        <div class="flex flex-col mx-4 justify-center w-2/3 mb-8">
            {#each Object.entries(projects) as [title, projects]}
                <div class="flex flex-row items-center justify-between">
                    <div class="flex">
                        {#each projects.projects.slice(0, 3) as projectItem}
                            <ProjectIcon title={projectItem.title} image={projectItem.images[0]} size="250px" category={title} />
                        {/each}
                    </div>
                    
                    <div class="flex flex-col">
                        <button class="" on:click={() => push("/" + title)}>
                            <Heading text={title} fontSize=100 />
                            <p class="font-new-amsterdam tracking-widest hover:underline">See All Projects →</p>
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <!-- <Card title="Sewing Projects" image="images/sewing.jpg" tags={["sewing", "another tag", "tag"]} /> -->
</div>
