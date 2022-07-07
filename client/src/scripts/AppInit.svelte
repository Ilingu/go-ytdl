<script lang="ts">
  import {
    ChangeTheme,
    GetPassword,
    SetIsLoggedIn,
  } from "lib/utils/ClientFuncs";
  import { IsEmptyString } from "lib/utils/UtilsFuncs";
  import { THEMES } from "lib/utils/types/enums";

  import { onMount } from "svelte";
  import { IsPasswordValid } from "lib/utils/ServerFuncs";

  let title = "GoYtdl";
  onMount(() => {
    // Theme Check
    const Theme = window.localStorage.getItem("app-theme") as THEMES;
    if (!IsEmptyString(Theme)) ChangeTheme(Theme);

    // App Title
    const PagePath = window?.location?.pathname;
    const HomePage = PagePath === "/";
    title = `GoYtdl${HomePage ? " / Home" : PagePath.replace("/", " / ")}`;

    // Check Connected State
    if (!HomePage) CheckUserState();
  });

  const CheckUserState = async () => {
    const SSRes = window.sessionStorage.getItem("connected");
    if (SSRes && !IsEmptyString(SSRes) && JSON.parse(SSRes) === true)
      return SetIsLoggedIn(true);

    const UserPassword = GetPassword();
    if (!UserPassword) return;

    const IsRightPassword = await IsPasswordValid(UserPassword);
    if (!IsRightPassword) return;

    SetIsLoggedIn(true);
    window.sessionStorage.setItem("connected", "true");
  };
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
