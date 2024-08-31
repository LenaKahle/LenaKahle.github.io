<script>
    export let text;
    export let mainColor = 'text-accent1';
    export let shadowColor = 'text-accent2';
    export let fontSize = 200;
    let offset = fontSize / 40; 

    let leftOffset = `-${offset}px`;
    let topOffset = `-${offset}px`;
</script>

<span class={`relative ${shadowColor} text-[${fontSize}px] font-new-amsterdam`}>
    {text}
    <span class={`absolute ${mainColor} text-[${fontSize}px]`} style="top: {topOffset}; left: {leftOffset};">
        {text}
    </span>
</span>

<!-- <span class="relative {shadowColor} after:content-['Portfolio'] after:absolute after:{mainColor} after:top-[-{offset}px] {leftOffset} font-new-amsterdam text-[{fontSize}px]">
    {text}
</span> -->



<!-- <div class="relative inline-block font-new-amsterdam {fontSize}">
    <span class='absolute top-0 left-0 {shadowColor}' style='transform: translate({offset}, {offset});'>
        {text}
    </span>
    <span class={mainColor}>
        {text}
    </span>
</div>
 -->
