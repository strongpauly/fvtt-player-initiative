Hooks.on("renderCombatTracker", async () => {
  if (game.combat) {
    if (!game.user.isGM) {
      game.combat.combatants
        .filter((c) => c.isOwner)
        .map((c) => new InitiativeEditor(c));
    }
  }
});
