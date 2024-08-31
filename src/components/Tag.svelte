<script>
    export let title;

    function toggleTag() {
        console.log("todo: add tag to url or remove from url if included");
    }
</script>

<button on:click={toggleTag} class="block bg-accent1 hover:bg-accent1-hover text-bright font-semibold rounded-lg shadow py-1 px-2">
    {title}
</button>