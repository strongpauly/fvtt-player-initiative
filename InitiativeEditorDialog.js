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
      close: async (html) => {
        const dialog = html[0];
        const updates = combatants.map((c) => ({
          _id: c.id,
          initiative: dialog.querySelector(`input[name="combatant-${c.id}"]`)
            .valueAsNumber,
        }));
        // await Combatant.updateDocuments(updates);
        await Promise.all(combatants.map((c, i) => c.update(updates[i])));
        close();
      },
    });
  }
}
