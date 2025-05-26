function createContent(combatants) {
	return `<div id="edit-initiative-dialog"><h2>${game.i18n.format("fvtt-player-initiative.UI.enterYourValues", {
		name: game.user.name
	})}</h2>
  <div>${combatants
		.map(
			(c) =>
				`<div>
        <label for="combatant-${c.id}">${c.name}</label>
        <input type="number" class="initiative-dialog-input" name="combatant-${c.id}" value="${
					c.initiative != null ? c.initiative : ""
				}"/>
       </div>`
		)
		.join("")}</div></div>`;
}

export class InitiativeEditorDialog extends Dialog {
	_confirming = false;

	constructor(close, combatants) {
		super({
			title: game.i18n.localize("fvtt-player-initiative.UI.rollforInitiative"),
			content: createContent(combatants),
			buttons: {
				confirm: {
					icon: `<i class="fas fa-check"></i>`,
					label: "Confirm",
					callback: () => {
						this._confirming = true;
					}
				}
			},
			close: async () => {
				await this.save();
				close();
			}
		});
		this.combatants = combatants;
	}

	getInputs() {
		const dialog = this.element[0];
		return this.combatants.map((c) => dialog.querySelector(`input[name="combatant-${c.id}"]`));
	}

	validate() {
		const inputs = this.getInputs();
		inputs.forEach((i) => (i.className = "initiative-dialog-input"));
		const invalidInputs = inputs.filter((i) => isNaN(i.valueAsNumber));
		invalidInputs.forEach((i) => (i.className = `${i.className} invalid`));
		if (invalidInputs.length) {
			invalidInputs[0].focus();
			return false;
		}
		return true;
	}

	async close() {
		if (this.validate()) {
			await super.close();
		}
	}

	setCombatants(combatants) {
		const inputs = this.getInputs();
		let needsRerender = this.combatants.length !== combatants.length;
		inputs.forEach((input, i) => {
			const combatant = combatants[i];
			if (input.name !== `combatant-${combatant.id}`) {
				needsRerender = true;
			} else if (combatant.initiative != null) {
				input.valueAsNumber = combatant.initiative;
			}
		});
		this.combatants = combatants;
		if (needsRerender) {
			this.data.content = createContent(combatants);
			this.render(true);
		}
	}

	async save() {
		const inputs = this.getInputs();
		const updates = this.combatants.map((c, i) => ({
			_id: c.id,
			initiative: inputs[i].valueAsNumber
		}));
		await Promise.all(this.combatants.map((c, i) => c.update(updates[i])));
	}
}
