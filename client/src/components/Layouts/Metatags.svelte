<script>
  import { onMount } from "svelte";

  export let title = null;
  onMount(() => {
    const PagePath = window?.location?.pathname;

    if (!title)
      title = `GoYtdl${
        PagePath === "/" ? " / Home" : PagePath.replace("/", " / ")
      }`;
  });
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
