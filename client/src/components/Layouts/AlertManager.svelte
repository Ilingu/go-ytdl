<script lang="ts">
  import Alerts from "@components/Design/Alerts.svelte";
  import { AlertArgsShape } from "lib/utils/types/interfaces";
  import { AlertType } from "lib/utils/types/types";
  import { onMount } from "svelte";

  let text: string = null;
  let type: AlertType = null;
  let duration: number = 5000;

  let visible = false;

  onMount(() => {
    document.addEventListener(
      "ui-alert",
      ({
        detail: { text: AlertText, type: AlertType, duration: AlertDuration },
      }: CustomEvent<AlertArgsShape>) => {
        if (visible) return; // Refuse all alerts when one is already displayed

        text = AlertText;
        type = AlertType;
        if (AlertDuration) duration = AlertDuration;

        PushAlertElement(duration);
      }
    );
  });

  const PushAlertElement = (time: number) => {
    visible = true; // Show alert
    setTimeout(() => {
      visible = false; // Hide Alert
      // Reset Fields
      text = null;
      type = null;
      duration = 5000;
    }, time);
  };
</script>

{#if visible}
  <Alerts {text} {type} />
{/if}
