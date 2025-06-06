import { InitiativeEditor } from "./InitiativeEditor.js";
import { InitiativeEditorDialog } from "./InitiativeEditorDialog.js";
import { PLAYER_INITIATIVE } from "./constants.js";

/**
 * @type InitiativeEditorDialog | undefined
 */
let dialog;
Hooks.on("renderCombatTracker", async () => {
	if (game.combat && !game.user.isGM) {
		const myCombatants = game.combat.combatants.filter((c) => c.isOwner);
		myCombatants.forEach((c) => new InitiativeEditor(c));

		const needsInitiative = myCombatants.filter((myC) => myC.initiative == null);
		if (
			game.settings.get(PLAYER_INITIATIVE.MODULE_NAME, PLAYER_INITIATIVE.SETTINGS.SHOW_DIALOG) &&
			(needsInitiative.length > 0 || dialog)
		) {
			if (!dialog) {
				dialog = new InitiativeEditorDialog(() => (dialog = null), myCombatants);
				dialog.render(true);
			} else {
				dialog.setCombatants(myCombatants);
			}
		}
	}
});
