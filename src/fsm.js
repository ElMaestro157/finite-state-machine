class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
    	this.config = config;
    	this.state = config.initial;

    	this.undoHistory = [];
    	this.undoHistory.push(this.state);

    	this.redoHistory = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
    	return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
    	if (this.config.states[state] === undefined)
    		throw new Error();

    	if (this.redoHistory.length !== 0)
    		this.redoHistory = [];

    	this.undoHistory.push(this.state);
    	this.state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
    	if (this.config.states[this.state].transitions[event] === undefined)
    		throw new Error();

    	if (this.redoHistory.length !== 0)
    		this.redoHistory = [];

    	this.undoHistory.push(this.state);
    	this.state = this.config.states[this.state].transitions[event];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
    	this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
    	if (!event)
    		return Object.getOwnPropertyNames(this.config.states);

    	var sideConfig = this.config;
    	return Object.getOwnPropertyNames(this.config.states).filter(function(element) {
    		return sideConfig.states[element].transitions[event] !== undefined;
    	});
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
    	if (this.undoHistory.length === 1)
    		return false;

    	this.redoHistory.push(this.state);
    	this.state = this.undoHistory.pop();
    	return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
    	if (this.redoHistory.length === 0)
    		return false;

    	this.undoHistory.push(this.state);
    	this.state = this.redoHistory.pop();
    	return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
    	this.undoHistory = [];
    	this.undoHistory.push(this.config.initial);

    	this.redoHistory = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
