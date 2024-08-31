<script>
    import { onMount, onDestroy } from "svelte";
    export let isOpen = false;
    export let width = "w-1/2";

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closePopup();
        }
    };

    const handleClickOutside = (event) => {
        if (event.target.id === 'popup-overlay') {
            closePopup();
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

    function closePopup() {
        isOpen = false;
    }
</script>

{#if isOpen}
    <div id="popup-overlay" class="fixed inset-0 flex items-center justify-center bg-dark bg-opacity-75" on:click={handleClickOutside} aria-label="Close Popup" role="presentation">
        <div class="bg-bright p-6 rounded-lg shadow-lg relative {width} max-h-[calc(100vh-150px)]">
            <button class="absolute top-2 right-2 rounded-full p-1 text-accent1 hover:bg-dark hover:bg-opacity-10" on:click={closePopup}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <slot />
            
        </div>
    </div>
{/if}
