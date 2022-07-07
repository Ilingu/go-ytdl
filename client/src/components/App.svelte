<script lang="ts">
  import { onMount } from "svelte";
  import { SetIsLoggedIn } from "lib/utils/ClientFuncs";

  onMount(() => {
    SetIsLoggedIn(true);
  });

  // const HandleSubmit = () => {};
</script>

<section />
