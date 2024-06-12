<!-- based on https://github.com/WebDevSimplified/youtube-react-ts-tailwind-home-page/blob/main/src/components/Button.tsx -->
<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let variant = "default";
    export let size = "default"; 
    export let className = ""; // additional class names

    const variantStyles = {
        default: "bg-secondary hover:bg-secondary-hover text-secondary-text",
        ghost: "hover:bg-gray-100 text-secondary-text", 
        dark: "bg-secondary-dark hover:bg-secondary-dark-hover text-secondary",
    };

    const sizeStyles = {
        default: "rounded-full p-2 px-4 flex items-center justify-center",
        icon: "rounded-full w-10 h-10 flex items-center justify-center p-2.5"
    };
</script>

<button class="{variantStyles[variant]} {sizeStyles[size]} {className}" on:click={() => dispatch('click')}>
    <slot />
</button>