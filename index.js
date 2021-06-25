(function () {
  let dialog;
  Hooks.on("renderCombatTracker", async () => {
    if (game.combat && !game.user.isGM) {
      const myCombatants = game.combat.combatants.filter((c) => c.isOwner);
      myCombatants.forEach((c) => new InitiativeEditor(c));

      if (
        !dialog &&
        !game.combat.started &&
        myCombatants.filter((myC) => myC.initiative == null).length > 0
      ) {
        dialog = new InitiativeEditorDialog(
          () => (dialog = null),
          myCombatants
        );
        dialog.render(true);
      }
    }
  });
})();
