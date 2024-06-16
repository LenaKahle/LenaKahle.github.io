<script>
    export let title;
    export let image;
    export let href;
</script>

<div class="relative w-[350px] h-[350px] inline-block overflow-hidden group">
    <a {href}>
        <img src={image} loading="lazy" alt={title} class="transition-transform duration-400 transform group-hover:scale-115">
        <div class="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-80 flex items-center justify-center">
            <div class="text-black uppercase">{title}</div>
        </div>
    </a>
</div>
