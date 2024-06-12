<script>
    export let title;
    export let image;
    export let href;
</script>

<div class="relative w-[350px] h-[350px] inline-block overflow-hidden">
    <a {href}>
        <img src={image} loading="lazy" alt={title} class="block w-full h-full object-cover transition-transform transform scale-100 hover:scale-115">
        <div class="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-opacity duration-300 hover:opacity-100">
            <div class="text-black">{title}</div>
        </div>
    </a>
</div>
