module.exports = class Player {
    constructor(id) {
        this.active = false;
        this.hand = [];
        this.tableHand = [];
        this.realId = parseInt(id);
        this.id = parseInt(this.realId) + 1;
        this.name = "Player " + this.id;
    }
    defaultState(id){
        this.active = false;
        this.hand = [];
        this.tableHand = [];
        this.realId = parseInt(id);
        this.id = parseInt(this.realId) + 1;
        this.name = "Player " + this.id;
    }
    setActive(activeState){
        this.active = activeState;
        //console.log(this);
    }
}
