import Char from './char'

export class TreeNode {
  children: TreeNode[] = []
  val: string | null

  constructor(val: string | null) {
    this.val = val
  }
}

export default class Tree {
  root = new TreeNode(null)

  buildTreeNodesFromStruct(struct: Char[]) {
    this.root = new TreeNode(null)

    // input
    // ;[[0, 1], [0, 2], [0, 5], [1], [5], [7], [8], [9], [9, 5]]
    for (const char of struct) {
      this.buildTheeNodeFromChar(char)
    }

    return this.root
  }

  buildTheeNodeFromChar(char: Char) {
    let p = this.root
    for (let i = 0; i < char.position.length; i++) {
      const { index } = char.position[i]
      if (!p.children[index]) {
        p.children[index] = new TreeNode(null)
      }
      p = p.children[index]
    }
    p.val = char.value
  }
}
