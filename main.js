function Node(data) {
  let left = null;
  let right = null;
  data = data;

  return { left, right, data };
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// node.data, left and right stores the value, while start and end stores the indices
function Tree(array) {
  array = [...new Set(array)];
  array.sort((a, b) => a - b);
  let start = 0;
  let end = array.length - 1;

  const buildTree = (array, start, end) => {
    if (start > end) {
      return null;
    }

    const mid = Math.floor((start + end) / 2);
    const node = Node(array[mid]);

    node.left = buildTree(array, start, mid - 1);
    node.right = buildTree(array, mid + 1, end);
    return node;
  };

  let root = buildTree(array, start, end);

  const insert = (value) => {
    const node = Node(value);
    let current = root;
    let prev;
    let branch;
    while (current) {
      if (value > current.data) {
        prev = current;
        current = current.right;
        branch = "right";
      } else {
        prev = current;
        current = current.left;
        branch = "left";
      }
    }

    if (branch === "left") {
      prev.left = node;
    } else {
      prev.right = node;
    }
  };

  const deleteItem = (value) => {
    let current = root;
    let prev = root;
    while (current) {
      if (value === current.data) {
        if (!current.left && !current.right) {
          prev.left = null;
          prev.right = null;
        } else if (current.left === null && current.right !== null) {
          if (value < prev.data) {
            prev.left = current.right;
          } else {
            prev.right = current.right;
          }
        } else if (current.left !== null && current.right === null) {
          if (value < prev.data) {
            prev.left = current.left;
          } else {
            prev.right = current.left;
          }
        } else {
          let nodeToBeRemoved = current;
          current = current.right;
          let beforeNull;
          let lastParentbeforeNull;
          while (current) {
            lastParentbeforeNull = beforeNull;
            beforeNull = current;
            current = current.left;
          }
          if (value < prev.data) {
            prev.left = beforeNull;
            beforeNull.left = nodeToBeRemoved.left;
          } else if (value > prev.data) {
            prev.right = beforeNull;
            beforeNull.left = nodeToBeRemoved.left;
          } else {
            nodeToBeRemoved.data = beforeNull.data;
            if (beforeNull.right) {
              lastParentbeforeNull.left = beforeNull.right;
            } else {
              lastParentbeforeNull.left = null;
            }
          }
        }
      } else if (value > current.data) {
        prev = current;
        current = current.right;
      } else if (value < current.data) {
        prev = current;
        current = current.left;
      }
    }
  };

  const find = (value) => {
    let current = root;
    while (current) {
      if (value === current.data) {
        return current;
      } else {
        if (value > current.data) {
          current = current.right;
        } else {
          current = current.left;
        }
      }
    }
    console.log("Value cannot be found");
  };

  const levelOrder = (callback) => {
    let current = root;
    let queue = [current];
    if (root === null) return;
    while (queue.length > 0) {
      callback(queue[0]);
      if (queue[0].left) {
        queue.push(queue[0].left);
      }
      if (queue[0].right) {
        queue.push(queue[0].right);
      }
      queue.shift();
    }
  };

  const preOrder = (callback) => {
    const recursion = (node) => {
      if (!node) {
        return null;
      }
      callback(node);
      let left = recursion(node.left);
      let right = recursion(node.right);
      return node;
    };
    let current = root;
    recursion(current);
  };

  const inOrder = (callback) => {
    const recursion = (node) => {
      if (!node) {
        return null;
      }
      let left = recursion(node.left);
      callback(node);
      let right = recursion(node.right);
      return node;
    };
    let current = root;
    recursion(current);
  };

  const postOrder = (callback) => {
    const recursion = (node) => {
      if (!node) {
        return null;
      }
      let left = recursion(node.left);
      let right = recursion(node.right);
      callback(node);
      return node;
    };
    let current = root;
    recursion(current);
  };

  const height = (node) => {
    let stack = [];

    const recursion = (node, level = 0) => {
      if (!node) {
        return null;
      }
      level++;
      let left = recursion(node.left, level);
      let right = recursion(node.right, level);
      if (!left || !right) {
        stack.push(level);
      }
      return node.data;
    };
    recursion(node);
    maxHeight = Math.max(...stack);
    return maxHeight;
  };

  const depth = (node) => {
    let current = root;
    let level = -1;
    try {
      while (current) {
        if (node.data === current.data) {
          level++;
          return level;
        } else {
          if (node.data > current.data) {
            current = current.right;
          } else {
            current = current.left;
          }
          level++;
        }
      }
    } catch (error) {
      console.error("Cannot initiate depth travserse.");
    }
  };

  const isBalanced = () => {
    const left = root.left;
    const right = root.right;
    const leftHeight = height(left);
    console.log("lh", leftHeight);
    const rightHeight = height(right);
    console.log("rh", rightHeight);

    if (Math.abs(leftHeight - rightHeight) > 1) {
      return false;
    } else {
      return true;
    }
  };

  const rebalance = () => {
    let newArray = [];
    inOrder((nodes) => {
      newArray.push(nodes.data);
    });
    let newRoot = buildTree(newArray, 0, newArray.length - 1);
    root.data = newRoot.data;
    root.left = newRoot.left;
    root.right = newRoot.right;
    // return root;
  };

  return {
    root,
    insert,
    deleteItem,
    find,
    levelOrder,
    preOrder,
    inOrder,
    postOrder,
    height,
    depth,
    isBalanced,
    rebalance,
  };
}

// Driver Script
let tree = Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 90, 2, 45, 11]);

console.log(tree.isBalanced());

console.log("levelOrder");
tree.levelOrder((nodes) => {
  console.log(nodes.data);
});
console.log("preOrder");
tree.preOrder((nodes) => {
  console.log(nodes.data);
});
console.log("inOrder");
tree.inOrder((nodes) => {
  console.log(nodes.data);
});
console.log("postOrder");
tree.postOrder((nodes) => {
  console.log(nodes.data);
});

tree.insert(1000);
tree.insert(1100);
tree.insert(1200);
tree.insert(1300);

console.log(tree.isBalanced());

console.log(prettyPrint(tree.root));

tree.rebalance();

console.log(prettyPrint(tree.root));

console.log(tree.isBalanced());
