<script lang="ts">
  import { ChangeTheme } from "lib/utils/ClientFuncs";
  import { IsEmptyString } from "lib/utils/UtilsFuncs";
  import { THEMES } from "lib/utils/types/enums";

  import { onMount } from "svelte";

  let title = null;
  onMount(() => {
    // Theme Check
    const Theme = window.localStorage.getItem("app-theme") as THEMES;
    if (!IsEmptyString(Theme)) ChangeTheme(Theme);
    // App Title
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
