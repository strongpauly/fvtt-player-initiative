class InitiativeEditor {
  constructor(combatant) {
    this.combatant = combatant;
    this.parentDiv = document.querySelector(
      `li.combatant[data-combatant-id="${combatant.id}"] .token-initiative`
    );
    this.parentDiv.className = `${this.parentDiv.className} initiative-editable`;
    const originalChildren = Array.from(this.parentDiv.children);

    let editing = false;

    const toggle = () => {
      editing = !editing;
      Array.from(this.parentDiv.children).forEach((child) =>
        this.parentDiv.removeChild(child)
      );
      if (editing) {
        const input = document.createElement("input");
        input.className = "initiative-input";
        input.type = "number";
        initialiseInitiativeInput(input, combatant, toggle);
        this.parentDiv.appendChild(input);
        input.focus();
      } else {
        originalChildren.forEach((child) => this.parentDiv.appendChild(child));
      }
    };

    this.parentDiv.addEventListener("click", (evt) => {
      evt.stopPropagation();
      evt.stopImmediatePropagation();
      evt.preventDefault();
      evt.cancelBubble = true;
      toggle();
    });
  }
}
