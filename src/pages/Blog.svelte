<script>
  import { onMount } from "svelte";
  import LoadingSpinner from "../components/LoadingSpinner.svelte";

  let posts = [];
  let loading = true;

  onMount(async () => {
    const res = await fetch('/blog-posts/index.json');
    posts = (await res.json()).sort((a, b) => new Date(b.created) - new Date(a.created));
    loading = false;
  });
</script>

<div class="flex flex-col items-center w-full px-2 sm:px-4">
  <div class="w-full max-w-2xl flex flex-col gap-4">
    <h1 class="heading heading-size-sm heading-size-md text-center mb-6">Blog</h1>
    {#if loading}
      <LoadingSpinner />
    {:else}
      {#each posts as post}
        <a
          href={`#/blog/${post.slug}`}
          class="block bg-bright rounded-lg shadow hover:shadow-lg transition-shadow p-4 border border-accent1/10 hover:border-accent1"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span class="font-semibold text-lg text-accent1">{post.title}</span>
            <span class="text-sm text-gray-500">{new Date(post.created).toLocaleDateString()}</span>
          </div>
        </a>
      {/each}
    {/if}
  </div>
</div>
