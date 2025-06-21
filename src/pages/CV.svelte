<script>
    import { onMount } from "svelte";

    let cv;
    const keys = ['education', 'experience', 'awards and scholarships', 'extracurricular activities'];

    onMount(async() => {
        const response = await fetch('data/cv.json');
        cv = await response.json();
    });
</script>

<div align="center" class="flex flex-col items-center justify-center">
    <div>
        <h1 class="heading">
            Lena Kahle
        </h1>
        <a class="font-new-amsterdam tracking-widest hover:underline text-[40px]" target="_blank" href={cv?.linkedin}>LINKEDIN →</a>
    </div>

    {#if cv}
        <div class="w-full md:w-2/3 flex flex-col gap-8 mb-8">
            {#each keys as key}
                <div>
                    <div class="font-new-amsterdam text-[40px] md:text-[60px] mb-2 text-left ml-2">{key}</div>
                    <div class="flex flex-col gap-6">
                        {#each cv[key] as item}
                            <div class="bg-bright rounded-lg shadow p-4 flex flex-col gap-2">
                                <div class="flex flex-col md:flex-row md:items-center md:gap-4">
                                    <span class="text-accent1 font-semibold text-md md:text-xl min-w-[90px]">{item.period}</span>
                                    <span class="font-semibold text-lg md:text-2xl flex-1">{item.title}</span>
                                    {#if item.location}
                                        <span class="text-right text-base md:text-lg text-gray-700 md:min-w-[120px]">{item.location}</span>
                                    {/if}
                                </div>
                                {#if item.details}
                                    <ul class="list-disc list-inside mt-1 ml-4 text-left">
                                        {#each item.details as detail}
                                            <li>{detail}</li>
                                        {/each}
                                    </ul>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}

            <div class="bg-bright rounded-lg shadow p-4">
                <div class="mb-2"><strong>Languages:</strong>
                    <span>
                        {#each cv["languages"] as language, i}
                            {@html language}{i < cv["languages"].length - 1 ? ', ' : ''}
                        {/each}
                    </span>
                </div>
                <div class="mb-2"><strong>IT Skills (Personal Projects / Working Experience):</strong>
                    <span>
                        {#each cv["itSkills"] as skill, i}
                            {skill}{i < cv["itSkills"].length - 1 ? ', ' : ''}
                        {/each}
                    </span>
                </div>
                <div><strong>Personal Interests:</strong>
                    <span>
                        {#each cv["personalInterests"] as interest, i}
                            {@html interest}{i < cv["personalInterests"].length - 1 ? ', ' : ''}
                        {/each}
                    </span>
                </div>
            </div>
        </div>
    {/if}
</div>
