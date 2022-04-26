export const initialiseInitiativeInput = (input, combatant, onBlur) => {
  const setInitiative = async (initiative) =>
    combatant.update({ _id: combatant.id, initiative });

  input.valueAsNumber = combatant.initiative;
  input.addEventListener("keypress", (ev) => {
    if (ev.code === "Enter") {
      input.blur();
    }
  });
  input.addEventListener("keydown", (ev) => {
    if (ev.code === "Escape") {
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      ev.preventDefault();
      ev.cancelBubble = true;
      input.valueAsNumber = combatant.initiative;
      input.blur();
    }
  });
  input.addEventListener("blur", () => {
    if (input.valueAsNumber !== combatant.initiative) {
      setInitiative(input.valueAsNumber);
    }
    if (onBlur) {
      onBlur();
    }
  });
  input.addEventListener("click", (ev) => {
    ev.stopPropagation();
    ev.stopImmediatePropagation();
    ev.preventDefault();
    ev.cancelBubble = true;
  });
  return input;
};
