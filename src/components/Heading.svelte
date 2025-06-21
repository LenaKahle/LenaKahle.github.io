<script>
    export let text;
    export let mainColor = 'text-accent1';
    export let shadowColor = 'text-accent2';
    export let fontSize = 100;
    let offset = fontSize / 40; 
</script>

<span class={`relative ${shadowColor} font-new-amsterdam flex text-[${fontSize}px]`}>
    {text}
    <span class={`absolute ${mainColor} text-[${fontSize}px]` } style="top: -{offset}px; left: -{offset}px; ">
            {text}
    </span>
</span>