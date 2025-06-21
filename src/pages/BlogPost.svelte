<script>
    import { onMount } from "svelte";
    import { parse } from "marked"; // or use your preferred markdown parser
    export let params; // expects { filename }

    let html = '';
    let title = '';
    let created = '';

    function parseFrontmatter(md) {
        const match = md.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
        if (!match) return { frontmatter: {}, content: md };
        const frontmatter = {};
        match[1].split('\n').forEach(line => {
            const [key, ...rest] = line.split(':');
            if (key && rest.length) frontmatter[key.trim()] = rest.join(':').trim();
        });
        return { frontmatter, content: match[2] };
    }

    onMount(async () => {
        const res = await fetch(`/blog-posts/${params.filename}.md`);
        const md = await res.text();
        const { frontmatter, content } = parseFrontmatter(md);
        title = params.filename.replace(/[-_]/g, ' ');
        created = frontmatter.Created;
        html = parse(content);
    });
</script>

<div class="prose max-w-none">
    <h1 class="heading mb-2">{title}</h1>
    <div class="text-gray-500 mb-4">{created}</div>
    {@html html}
</div>