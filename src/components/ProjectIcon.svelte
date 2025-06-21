<script>
    import ProjectDetails from "../pages/ProjectDetails.svelte";
    import Popup from "./Popup.svelte";
    
    export let title;
    export let image;
    export let category;

    let openProject = false;

    function openProjectPopup() {
        openProject = true;        
    }

    function closeProjectPopup() {
        openProject = false;
    }

</script>

<div class="relative inline-block overflow-hidden group mx-1 w-[120px] md:w-[250px] h-[120px] md:h-[250px]">
    <button on:click={openProjectPopup}>
        <img src={image} loading="lazy" alt={title} class="transition-transform duration-400 transform group-hover:scale-115">
        <div class="absolute top-0 left-0 w-full h-full bg-bright opacity-0 transition-opacity duration-300 group-hover:opacity-80 flex items-center justify-center">
            <div class="text-black text-[40px] font-new-amsterdam leading-tight">{title}</div>
        </div>
    </button>
</div>

<Popup isOpen={openProject} on:closePopup={closeProjectPopup}>
    <ProjectDetails {title} {category} />
</Popup>
