<script>
    export let title;
    export let image;
    export let href;
</script>

<div class="relative w-[350px] h-[350px] inline-block overflow-hidden">
    <a {href}>
        <img src={image} loading="lazy" alt={title} class="block w-[350px] h-[350px] flex-[25%] transition-all duration-400">
        <div class="overlay overlayFade">
            <div class="text">{title}</div>
        </div>
    </a>
</div>
