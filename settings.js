Hooks.on("init", function () {
  game.settings.register(
    PLAYER_INITIATIVE.MODULE_NAME,
    PLAYER_INITIATIVE.SETTINGS.SHOW_DIALOG,
    {
      name: "fvtt-player-initiative.UI.Settings.showDialog",
      hint: "fvtt-player-initiative.UI.Settings.showDialogHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    }
  );
});
