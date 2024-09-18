<script>
    export let text;
    export let mainColor = 'text-accent1';
    export let shadowColor = 'text-accent2';
    export let fontSize = 200;
    let offset = fontSize / 40; 
</script>

<span class={`relative ${shadowColor} font-new-amsterdam flex`} style="font-size: {fontSize}px;">
    {text}
    <span class={`absolute ${mainColor}` } style="font-size: {fontSize}px; top: -{offset}px; left: -{offset}px; ">
            {text}
    </span>
</span>