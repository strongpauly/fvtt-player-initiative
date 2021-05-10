class InitiativeEditor {
    constructor(combatant) {
        this.combatant = combatant;
        this.parentDiv = document.querySelector(`li.combatant[data-combatant-id="${this.combatant._id}"] .token-initiative`);

        const originalChildren = Array.from(this.parentDiv.children);
        let editing = false;
    
        const setInitiative = async (initiative) => game.combat.updateCombatant({_id: this.combatant._id, initiative})
        
    
        const toggle = () => {
            editing = !editing;
            Array.from(this.parentDiv.children).forEach(child => this.parentDiv.removeChild(child))
            if(editing) {
                const input = document.createElement('input');
                input.className = "initiative-input";
                input.type="number"
                input.valueAsNumber = this.combatant.initiative;
                input.addEventListener('keypress', (ev) => {
                    if(ev.code === 'Enter') {
                        input.blur()
                    }
                })
                input.addEventListener('keydown', (ev) => {
                    if(ev.code === "Escape") {
                        ev.stopPropagation();
                        ev.stopImmediatePropagation();
                        ev.preventDefault();
                        ev.cancelBubble = true;
                        input.valueAsNumber = this.combatant.initiative;
                        input.blur();
                    }
                })
                input.addEventListener('blur', () => {
                    if(input.valueAsNumber !== this.combatant.initiative) {
                        setInitiative(input.valueAsNumber)
                    }
                    toggle();
                });
                input.addEventListener('click', ev => {
                    ev.stopPropagation();
                    ev.stopImmediatePropagation();
                    ev.preventDefault();
                    ev.cancelBubble = true;
                })
                this.parentDiv.appendChild(input);
                input.focus();
            } else {
                originalChildren.forEach( child => this.parentDiv.appendChild(child))
            }
        }
    
        this.parentDiv.addEventListener('click', (evt) => {
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            evt.preventDefault();
            evt.cancelBubble = true;
            toggle()
        })
    }
}