<script lang="ts">
  import {
    ChangeTheme,
    ClearPassword,
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

    // PWA A2HS
    A2HS();

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
    if (!IsRightPassword) {
      ClearPassword(); // If stored
      return SetIsLoggedIn(false);
    }

    SetIsLoggedIn(true);
    window.sessionStorage.setItem("connected", "true");
  };

  const A2HS = () => {
    /* Other Types */
    interface BeforeInstallPromptEvent extends Event {
      readonly platforms: Array<string>;
      readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
      }>;
      prompt(): Promise<void>;
    }

    window.addEventListener(
      "beforeinstallprompt",
      (e: BeforeInstallPromptEvent) => {
        e.preventDefault();
        let deferredPrompt = e;

        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the A2HS prompt");
          } else {
            console.log("User dismissed the A2HS prompt");
          }
        });
      }
    );
  };
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
