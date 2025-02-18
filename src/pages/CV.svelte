<script>
    import { onMount } from "svelte";
    import Heading from "../components/Heading.svelte";

    let cv;
    const keys = ['education', 'experience', 'awards and scholarships', 'extracurricular activities'];

    onMount(async() => {
        const response = await fetch('data/cv.json');
        cv = await response.json();
        console.log(cv);
    });
</script>

<div align="center" class="flex flex-col items-center justify-center">
    <div class="">
        <Heading text="Lena Kahle CV"/>
        <a class="font-new-amsterdam tracking-widest hover:underline text-[40px]" target="_blank" href={cv?.linkedin}>LINKEDIN: LENA KAHLE</a>
    </div>

    {#if cv}
        <table class="w-2/3 mb-8">
            {#each keys as key}
                <tr> 
                    <td colspan="3" class="font-semibold font-new-amsterdam text-[60px]">{key}</td>
                </tr>
                {#each cv[key] as item}
                    <tr>
                        <td>{item.period}</td>
                        <td><div class="font-semibold">{item.title}</div>
                            <ul class="list-disc list-inside">
                                {#if item.details}
                                    {#each item.details as detail} 
                                        <li>{detail}</li>
                                    {/each}
                                {/if}
                            </ul>
                        </td>
                        {#if item.location}
                            <td>{item.location}</td>
                        {/if}
                    </tr>
                {/each}
            {/each}

            <tr>
                <td><strong>Languages</strong></td>
                <td colspan="2">
                    {#each cv["languages"] as language, i}
                        {@html language}{i < cv["languages"].length - 1 ? ', ' : ''}
                    {/each}
                </td>
            </tr>

            <tr>
                <td><strong>IT Skills (Personal Projects / Working Experience)</strong></td>
                <td colspan="2">
                    {#each cv["itSkills"] as skill, i}
                        {skill}{i < cv["itSkills"].length - 1 ? ', ' : ''}
                    {/each}
                </td>
            </tr>

            <tr>
                <td><strong>Personal Interests</strong></td>
                <td colspan="2">
                    {#each cv["personalInterests"] as interest, i}
                        {@html interest}{i < cv["personalInterests"].length - 1 ? ', ' : ''}
                    {/each}
                </td>
            </tr>
        </table>
    {/if}
</div>
