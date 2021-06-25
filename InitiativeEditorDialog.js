class InitiativeEditorDialog extends Dialog {
  constructor(close, combatants) {
    super({
      title: "Roll for initiatve!",
      content: `<div id="edit-initiative-dialog"><h2>${
        game.user.name
      } enter your initiative values!</h2>
      <div>${combatants
        .map(
          (c) =>
            `<div>
            <label for="combatant-${c.id}">${c.name}</label>
            <input type="number" class="initiative-dialog-input" name="combatant-${c.id}" value="${c.initiative}"/>
           </div>`
        )
        .join("")}</div></div>`,
      buttons: {
        confirm: {
          icon: `<i class="fas fa-check"></i>`,
          label: "Confirm",
          callback: () => {},
        },
      },
      default: "confirm",
      close: async () => {
        const inputs = this.getInputs();
        const updates = combatants.map((c, i) => ({
          _id: c.id,
          initiative: inputs[i].valueAsNumber,
        }));
        // await Combatant.updateDocuments(updates);
        await Promise.all(combatants.map((c, i) => c.update(updates[i])));
        close();
      },
    });
    this.combatants = combatants;
  }

  getInputs() {
    const dialog = this._element[0];
    return this.combatants.map((c) =>
      dialog.querySelector(`input[name="combatant-${c.id}"]`)
    );
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
}
