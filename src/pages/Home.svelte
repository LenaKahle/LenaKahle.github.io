<script>
    import { onMount } from "svelte";
    import ProjectIcon from "../components/ProjectIcon.svelte";
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
        <p class="font-new-amsterdam text-[48px] md:text-[100px]">Welcome to my portfolio!</p>
        <p>
            I'm Lena, a computer science and archaeology student. On this website, I feature some of my creative projects.
        </p>
        <p>
            For more information about my background, check out <a href='/#/cv' class="text-accent2 hover:text-accent1-hover">my CV</a>!
        </p>
    </div>
    
    {#if projects}
        <div class="flex flex-col justify-center w-full md:w-2/3 mb-8 gap-4">
            {#each Object.entries(projects) as [title, projects]}
                <div class="flex flex-col md:flex-row items-center md:justify-between">
                    <div class="flex flex-row">
                        {#each projects.projects.slice(0, 3) as projectItem}
                            <ProjectIcon 
                                title={projectItem.title} 
                                image={projectItem.images[0]} 
                                category={title} 
                            />
                        {/each}
                    </div>
                    
                    <div class="flex flex-col w-full md:w-auto px-4">
                        <button
                            on:click={() => push("/" + title)}
                        >
                            <div class="flex flex-col items-end md:items-start">
                                <h2 class="heading">
                                    {title}
                                </h2>
                                <p class="font-new-amsterdam tracking-widest hover:underline">See More Projects →</p>
                            </div>
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
