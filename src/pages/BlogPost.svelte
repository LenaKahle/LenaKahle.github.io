<script>
  import { onMount } from "svelte";
  import { marked } from "marked";
  import LoadingSpinner from "../components/LoadingSpinner.svelte";

  export let params; // expects { post }
  let loading = true;

  let title = "";
  let created = "";
  let html = "";

  onMount(async () => {
    const indexRes = await fetch('/blog-posts/index.json');
    const posts = await indexRes.json();
    const postMeta = posts.find(p => p.slug === params.post);

    if (postMeta) {
      created = postMeta.created;
      title = postMeta.title;
    } else {
      title = "Post not found";
      created = "";
    }

    const res = await fetch(`/blog-posts/${params.post}/${params.post}.md`);
    const md = await res.text();
    html = marked(md);
    loading = false;
  });
</script>

{#if loading}
  <LoadingSpinner />
{:else}
  <div class="flex flex-col items-center w-full px-2 sm:px-4">
    <div class="w-full md:w-2/3 flex flex-col mb-8">
  <h1 class="heading heading-size-sm heading-size-md text-center">{title}</h1>
      <p class="text-gray-500 text-sm mb-2 text-center">{created}</p>
      <article class="prose w-full max-w-full">
        {@html html}
      </article>
    </div>
  </div>
{/if}
