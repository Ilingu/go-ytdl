<script lang="ts">
  import { PushAlert } from "lib/utils/ClientFuncs";
  import { IsEmptyString } from "lib/utils/UtilsFuncs";

  let password: string = "";

  const HandleSubmit = () => {
    if (IsEmptyString(password))
      return PushAlert({
        text: "Empty Fields",
        type: "warning",
        duration: 2500,
      });

    // Call
  };
</script>

<form
  on:submit|preventDefault={HandleSubmit}
  class="w-full flex flex-col justify-center items-center"
>
  <div class="form-control w-full max-w-xs mb-2">
    <label class="label" for="LoginInput">
      <span class="label-text">App Password:</span>
    </label>
    <input
      type="password"
      placeholder="Type here"
      bind:value={password}
      id="LoginInput"
      class="input input-bordered w-full max-w-xs"
    />
  </div>
  <div class="form-control w-full max-w-xs">
    <button type="submit" class="btn gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      Login
    </button>
  </div>
</form>
