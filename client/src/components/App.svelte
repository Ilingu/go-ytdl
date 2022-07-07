<script lang="ts">
  import { onMount } from "svelte";
  import {
    GetPassword,
    HandleDownload,
    PushAlert,
    SetIsLoggedIn,
  } from "lib/utils/ClientFuncs";
  import debounce from "lodash.debounce";
  import {
    HandleApiCall,
    IsEmptyString,
    IsValidURL,
    ParseYoutubeUrl,
  } from "lib/utils/UtilsFuncs";

  let YoutubeUrl: string = "";
  let ToMp3 = true;

  let loading = false;

  onMount(() => {
    SetIsLoggedIn(true);
  });

  const WaitDebounce = debounce(() => {
    // Call info
  }, 500);

  const HandleSubmit = async () => {
    const VideoID = ParseYoutubeUrl(YoutubeUrl);
    if (!VideoID || !IsValidURL(YoutubeUrl))
      return PushAlert({
        text: "Invalid Youtube Url",
        type: "warning",
        duration: 3600,
      });

    const password = GetPassword();
    if (!password)
      return PushAlert({
        text: "Please login!",
        type: "warning",
        duration: 3000,
      });

    loading = true; // loading

    const ToMp3Copy = ToMp3;
    const { success, data: DownloadableFileUrl } = await HandleApiCall<string>(
      "download",
      password,
      {
        youtubeURL: YoutubeUrl,
        toMp3: ToMp3,
      }
    ); // Fetching file

    loading = false; // loading
    YoutubeUrl = ""; // Reset

    if (!success || IsEmptyString(DownloadableFileUrl))
      return PushAlert({
        text: "Cannot Download this video",
        type: "error",
        duration: 6000,
      });

    HandleDownload(DownloadableFileUrl, VideoID as string, ToMp3Copy); // Download file
  };
  const HandleChange = (evt: {
    currentTarget: EventTarget & HTMLInputElement;
  }) => {
    YoutubeUrl = evt.currentTarget.value;
    WaitDebounce();
  };
</script>

<form
  on:submit|preventDefault={HandleSubmit}
  class="w-full flex flex-col justify-center items-center"
>
  <div class="form-control w-full max-w-xs mb-2">
    <label class="label" for="LoginInput">
      <span class="label-text">Youtube Video URL:</span>
    </label>
    <input
      type="url"
      placeholder="https://youtu.be/ooOELrGMn14"
      value={YoutubeUrl}
      on:change={HandleChange}
      id="LoginInput"
      class="input input-bordered w-full max-w-xs"
    />
  </div>
  <div class="form-control w-full max-w-xs mb-2">
    <label class="cursor-pointer label">
      <span class="label-text"
        >Convert to <span class="font-bold">.mp3</span></span
      >
      <input
        type="checkbox"
        bind:checked={ToMp3}
        class="checkbox checkbox-secondary"
      />
    </label>
  </div>
  <div class="form-control w-full max-w-xs">
    {#if loading}
      <progress class="progress progress-secondary w-full" />
    {:else}
      <button type="submit" class="btn gap-2">
        <span class="fa fa-download" />
        Download
      </button>
    {/if}
  </div>
</form>
