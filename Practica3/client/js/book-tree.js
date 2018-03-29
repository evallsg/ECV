class BookTree {
    constructor(dom_parent_node) {
        this.dom_parent_node = dom_parent_node;
    }
}

function handleClick(event)
{
	console.log(event);
}

BookTree.prototype.loadTree = function(structure) {
    // Create node in which we will append the tree display
    container = document.createElement('div');
    container.id = "tree-simple"
    document.querySelector(this.dom_parent_node).appendChild(container);

  //   simple_chart_config = {
  //       chart: {
  //           container: "#tree-simple",

  //           node: {
		// 		HTMLclass: "book-tree"
		// 	}

		// },

  //       nodeStructure: structure
  //   };

    var my_chart = new Treant(structure);
    
	var nodes = document.querySelectorAll('div.node')

    for(var node of nodes)
        node.addEventListener('click', handleClick);
}