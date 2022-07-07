<script lang="ts">
  import { IsLoggedIn } from "../../lib/store/store";
</script>

{#if $IsLoggedIn}
  <div class="badge badge-success">Connected</div>
{:else}
  <div class="badge badge-error">Disconnected</div>
{/if}
