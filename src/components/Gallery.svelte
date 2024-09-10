<script>
    import { onMount, onDestroy } from "svelte";

    export let images = [];
    let currentIndex = 0;

    function goNext() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function goPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    function setCurrentImage(index) {
        currentIndex = index;
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowLeft') {
            goPrev();
        }
        if (event.key === 'ArrowRight') {
            goNext();
        }

    };

    onMount(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    });

    onDestroy(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });

</script>

<!-- Gallery Container -->
<div class="flex flex-col items-center">
    <!-- Main Image Display with Chevrons -->
    <div class="relative w-auto h-96 overflow-hidden rounded-lg">
        <!-- Left Chevron -->
        <button class="absolute left-2 top-1/2 transform -translate-y-1/2 text-bright z-10 rounded-full p-1 hover:bg-dark hover:bg-opacity-10" on:click={goPrev}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <!-- Main Image -->
        <img src={images[currentIndex]} alt="featured" loading="lazy" class="h-full object-contain"/>

        <!-- Right Chevron -->
        <button class="absolute right-2 top-1/2 transform -translate-y-1/2 text-bright z-10 rounded-full p-1 hover:bg-dark hover:bg-opacity-10" on:click={goNext}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <!-- Description Overlay -->
        <!-- <div class="absolute bottom-0 w-full bg-white bg-opacity-75 text-center p-2 text-sm">
            {descriptions[currentIndex]}
        </div> -->
    </div>

    <!-- Thumbnail Row -->
    <div class="flex mt-4 space-x-4 overflow-x-auto">
        {#each images as image, index}
            <img
                src={image}
                alt="Thumbnail"
                class="w-24 h-24 object-cover cursor-pointer rounded-lg hover:opacity-100 transition-opacity duration-300"
                on:click={() => setCurrentImage(index)}
                class:opacity-50={index !== currentIndex}
            />
        {/each}
    </div>
</div>
