Hooks.on("renderCombatTracker", function() {
    if(game.combat) {
        game.combat.combatants.filter(c => c.owner).map(c => 
            new InitiativeEditor(c)
        );
    }
});

