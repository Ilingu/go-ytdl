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
  import { VideoInfosShape } from "lib/utils/types/interfaces";

  let YoutubeUrl: string = "";
  let ToMp3 = true;

  let loading = false;
  let VideoInfos: VideoInfosShape = null;

  onMount(() => {
    SetIsLoggedIn(true);
    document.cookie = `SessionActive=yes; expires=${new Date(
      Date.now() * 36000
    ).toUTCString()};`;
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
    const {
      success,
      data: { FileUrl, title, thumbnail, author, duration },
    } = await HandleApiCall("download", password, {
      youtubeURL: YoutubeUrl,
      videoID: VideoID as string, // backup, in case youtubeURL is invalid
      toMp3: ToMp3,
    }); // Fetching file

    loading = false; // loading
    YoutubeUrl = ""; // Reset

    if (!success || IsEmptyString(FileUrl))
      return PushAlert({
        text: "Cannot Download this video",
        type: "error",
        duration: 6000,
      });

    HandleDownload(FileUrl, VideoID as string, ToMp3Copy); // Download file
    VideoInfos = {
      title,
      thumbnail,
      author,
      duration,
    };
  };

  const HandleChange = (evt: {
    currentTarget: EventTarget & HTMLInputElement;
  }) => {
    YoutubeUrl = evt.currentTarget.value;
    WaitDebounce();
  };
</script>

{#if VideoInfos !== null}
  <section class="w-full flex flex-col justify-center items-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img
          src={VideoInfos?.thumbnail}
          alt="Video Poster"
          class="rounded-xl"
        />
      </figure>
      <div class="card-body items-center text-center">
        <h2 class="card-title">{VideoInfos?.title}</h2>
        <p>{VideoInfos?.author} -- {VideoInfos?.duration}</p>
        <div class="card-actions justify-end">
          <button
            class="btn btn-sm btn-primary flex gap-2"
            on:click={() => (VideoInfos = null)}
            ><i class="fa-solid fa-arrow-rotate-right" /> Download another video</button
          >
        </div>
      </div>
    </div>
  </section>
{:else}
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
{/if}
