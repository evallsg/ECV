class BookTree {
    constructor(dom_parent_node) {
        this.dom_parent_node = dom_parent_node;
    }
}

BookTree.prototype.loadTree = function(structure) {
    // Create node in which we will append the tree display
    container = document.createElement('div');
    container.id = "tree-simple"
    document.querySelector(this.dom_parent_node).appendChild(container);

    var my_chart = new Treant(structure);

}