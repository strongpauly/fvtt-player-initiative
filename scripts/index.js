import { InitiativeEditor } from "./InitiativeEditor.js";
import { InitiativeEditorDialog } from "./InitiativeEditorDialog.js";
import { InitiativeEditorDialogV2 } from "./InitiativeEditorDialogV2.js";
import { PLAYER_INITIATIVE } from "./constants.js";

/**
 * @type InitiativeEditorDialog |InitiativeEditorDialogV2 | undefined
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
				if (game.release.generation >= 12) {
					dialog = new InitiativeEditorDialogV2(myCombatants);
					dialog.addEventListener("close", () => {
						// if (game.combat.combatants.filter((c) => c.isOwner && c.initiative == null).length) {
						// 	dialog.render(true);
						// 	return;
						// }
						dialog = null;
					});
				} else {
					dialog = new InitiativeEditorDialog(() => {
						dialog = null;
					}, myCombatants);
				}
				dialog.render(true);
			} else {
				dialog.setCombatants(myCombatants);
			}
		}
	}
});
