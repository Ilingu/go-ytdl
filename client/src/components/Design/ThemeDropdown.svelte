<script>
  import { ChangeTheme } from "lib/utils/ClientFuncs";
  import { THEMES } from "lib/utils/types/enums";
</script>

<div class="dropdown dropdown-end h-10">
  <label tabindex={0} class="btn btn-ghost rounded-btn flex gap-1" for>
    <svg
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
    Themes
    <svg
      width="12px"
      height="12px"
      class="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048"
    >
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
    </svg>
  </label>

  <ul
    tabindex={0}
    class="menu dropdown-content p-2 shadow bg-primary rounded-box w-52 mt-4"
  >
    {#each Object.values(THEMES) as theme}
      <li class="capitalize font-semibold" on:click={() => ChangeTheme(theme)}>
        <a class="btn" href={null}>{theme}</a>
      </li>
    {/each}
  </ul>
</div>

<style>
  ul {
    width: 250px !important;
    overflow: scroll !important;
  }
</style>
