<script lang="ts">
  import { fade } from "svelte/transition";
  import type { AlertType } from "lib/utils/types/types";

  export let text: string;
  export let type: AlertType;

  const GenerateIcon = () => {
    if (type === "info")
      return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
    if (type === "success")
      return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
    if (type === "warning")
      return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
    if (type === "error")
      return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
    return "none";
  };
</script>

<div
  class={`alert-type-${type} alert shadow-lg w-1/6 absolute top-2 right-2`}
  transition:fade
>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-current flex-shrink-0 w-6 h-6"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d={GenerateIcon()}
      /></svg
    >
    <span>{text}</span>
  </div>
</div>

<style>
  .alert-type-info {
    color: rgb(0, 43, 61);
    background-color: #3abff8;
  }
  .alert-type-success {
    color: rgb(0, 51, 32);
    background-color: #36d399;
  }
  .alert-type-warning {
    color: rgb(56, 40, 0);
    background-color: #fbbd23;
  }
  .alert-type-error {
    color: rgb(71, 0, 0);
    background-color: #f87272;
  }
</style>
