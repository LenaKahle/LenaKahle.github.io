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

<div align="center">
    <Heading text="Lena Kahle CV"/>
    <!-- <h1 class="text-4xl font-bold">CURRICULUM VITAE</h1> -->
    <a target="_blank" href={cv?.linkedin}>LINKEDIN: LENA KAHLE</a>
    <div class="w-44 h-1 bg-secondary-dark m-auto mt-4"></div>

    {#if cv}
        <table>
            {#each keys as key}
                <tr> 
                    <td colspan="3" class="font-semibold uppercase text-lg">{key}</td>
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
                <td colspan="2"><strong>German</strong> native speaker, <strong>English</strong> fluent,<strong>French</strong> good working knowledge, <strong>Latin</strong> proficiency certificate (Latinum), <strong>Italian</strong> basic knowledge</td>
            </tr>

            <tr>
                <td><strong>IT Skills (Personal Projects / Working Experience)</strong></td>
                <td colspan="2">MS Office, Java, Python (incl. django), Svelte (JS framework), PHP, SQL, GIMP, Scribus, Inkscape, Krita</td>
            </tr>
            <tr>
                <td><strong>IT Skills (University Courses)</strong></td>
                <td colspan="2">OCaml, x86 Assembly, C, MATLAB</td>
            </tr>

            <tr>
                <td><strong>Personal Interests</strong></td>
                <td colspan="2"><a style="color:SteelBlue" href="/#/sewing" target="_blank">sewing</a>, <a style="color:SteelBlue" href="/#/linocuts" target="_blank">printmaking</a>, <a style="color:SteelBlue" href="/#/photography" target="_blank">photography</a>, Dungeons and Dragons</td>
            </tr>
        </table>
    {/if}
</div>
