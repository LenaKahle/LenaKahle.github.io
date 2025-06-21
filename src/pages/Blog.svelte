<script>
    import { onMount } from "svelte";
    import { parse } from "marked"; // or use your preferred markdown parser

    let posts = [];

    // Helper to extract frontmatter and content
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
        // Fetch the list of .md files (you may need to generate this list at build time or via an API)
        const res = await fetch('/blog-posts/index.json');
        const files = await res.json();

        // Fetch and parse each post
        const loadedPosts = await Promise.all(
            files.map(async (filename) => {
                const mdRes = await fetch(`/blog-posts/${filename}`);
                const md = await mdRes.text();
                const { frontmatter } = parseFrontmatter(md);
                return {
                    filename,
                    created: new Date(frontmatter.Created),
                    title: filename.replace(/\.md$/, '').replace(/[-_]/g, ' '),
                };
            })
        );

        posts = loadedPosts.sort((a, b) => b.created - a.created);
    });
</script>

<h1 class="heading mb-8">Blog</h1>
<ul class="flex flex-col gap-4">
    {#each posts as post}
        <li>
            <a class="text-accent1 hover:underline text-2xl" href={`#/blog/${post.filename.replace('.md', '')}`}>
                {post.title}
            </a>
            <span class="ml-2 text-gray-500 text-base">({post.created.toLocaleDateString()})</span>
        </li>
    {/each}
</ul>