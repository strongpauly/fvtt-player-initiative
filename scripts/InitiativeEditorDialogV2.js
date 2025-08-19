import { PLAYER_INITIATIVE } from "./constants.js";

export class InitiativeEditorDialogV2 extends foundry.applications.api.HandlebarsApplicationMixin(
	foundry.applications.api.ApplicationV2
) {
	#combatants;
	#saving = false;

	constructor(combatants, options = {}) {
		super({
			...options,
			window: {
				title: game.i18n.format("fvtt-player-initiative.UI.enterYourValues", {
					name: game.user.name
				})
			}
		});
		this.#combatants = combatants;
	}

	/** @inheritDoc */
	static DEFAULT_OPTIONS = {
		id: "initiative-editor-{id}",
		tag: "form",
		window: {
			icon: "fa-regular fa-swords",
			contentClasses: ["standard-form"]
		},
		classes: ["initiative-editor-dialog"],
		position: {
			width: 350,
			height: "auto"
		},
		form: {
			submitOnChange: false,
			closeOnSubmit: false,
			handler: this._onSubmitForm
		}
	};

	/** @override */
	static PARTS = {
		form: {
			template: `modules/${PLAYER_INITIATIVE.MODULE_NAME}/templates/dialog-form-content.hbs`
		},
		footer: {
			template: `modules/${PLAYER_INITIATIVE.MODULE_NAME}/templates/dialog-form-footer.hbs`
		}
	};

	setCombatants(combatants) {
		if (this.#saving) {
			return;
		}
		this.#combatants = combatants;
		this.render(true);
	}

	/** @inheritDoc */
	async _prepareContext(_options) {
		const context = {
			combatants: this.#combatants
		};
		return context;
	}

	async _preparePartContext(partId, context) {
		switch (partId) {
			case "footer":
				context.canRollAll = false; //context.combatants.length > 1;
				break;
			case "form":
				break;
		}
		return context;
	}

	/** @inheritDoc */
	async _onSubmitForm(formConfig, event) {
		event.preventDefault();
		this._toggleSubmission(false);
		let valid = true;
		const inputs = this.#combatants.map((combatant) => {
			const input = this.getInput(combatant.id);
			if (isNaN(input.valueAsNumber)) {
				input.classList.add("invalid");
				valid = false;
				return input;
			}
			input.classList.remove("invalid");
			return input;
		});

		if (!valid) {
			this._toggleSubmission(true);
			return;
		}

		await super._onSubmitForm(formConfig, event);
		this.element?.querySelectorAll("input").forEach((input) => (input.disabled = true));
		this.#saving = true;

		let parseInitiative = (value) => value;
		switch (game.system.id) {
			case "dnd5e":
				if (game.settings.get("dnd5e", "initiativeDexTiebreaker")) {
					parseInitiative = (value, combatant) =>
						Math.floor(value) + combatant.actor.system.abilities.dex.value / 100;
				}
				break;
			default:
				break;
		}

		const updates = this.#combatants.map((c, i) => {
			const initiative = parseInitiative(inputs[i].valueAsNumber, c);
			return {
				_id: c.id,
				initiative
			};
		});
		await Promise.all(this.#combatants.map((c, i) => c.update(updates[i])));
		await this.close();
		this.#saving = false;
	}

	_onRender(_context, _options) {
		this.element?.querySelectorAll("a.roll-initiative-button").forEach((button) => {
			button.addEventListener("click", () => {
				const combatantId = button.attributes?.["data-combatant-id"].value;
				this._rollInitiative(combatantId);
			});
		});
		this.element.querySelector("button#roll-all")?.addEventListener("click", () => {
			this.#combatants.forEach((c) => this._rollInitiative(c.id));
		});
	}

	getInput(combatantId) {
		return this.element.querySelector(`input[name="combatant-${combatantId}-input"]`);
	}

	async _rollInitiative(combatantId) {
		const combatant = this.#combatants.find((c) => c.id === combatantId);
		await combatant.actor.rollInitiativeDialog();
	}

	/**
	 * Toggle the state of the submit button.
	 * @param {boolean} enabled  Whether the button is enabled.
	 * @protected
	 */
	_toggleSubmission(enabled) {
		const submit = this.element.querySelectorAll('button[type="submit"]');
		submit.forEach((button) => {
			button.disabled = !enabled;
			const icon = button.querySelector("i");
			if (enabled) {
				icon.className = icon.oldClassName;
				delete icon.oldClassName;
				return;
			} else {
				icon.oldClassName = icon.className;
				icon.className = "fas fa-spinner fa-pulse";
			}
		});
	}
}
