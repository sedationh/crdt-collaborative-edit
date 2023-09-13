import { useEffect, useState } from 'react'
import 'treeflex/dist/css/treeflex.css'
import Controller from '../src/controller'
import { TreeNode as TreeNodeType } from '../src/tree'

interface TreeProps {
  controller: Controller
}

const Tree = ({ controller }: TreeProps) => {
  const [root, setRoot] = useState(controller.editor.modal.tree.root)
  useEffect(() => {
    setInterval(() => {
      setRoot(controller.editor.modal.tree.root)
    }, 200)
  }, [])

  return (
    <div className="tf-tree">
      <ul>
        <li>
          <TreeNode node={root} />
        </li>
      </ul>
    </div>
  )
}

const TreeNode = ({ node }: { node: TreeNodeType }) => {
  const children = node.children.filter((node) => !!node)

  return (
    <>
      <span className="tf-nc">{node.val ? node.val : 'root'}</span>
      {!!children.length && (
        <ul>
          {children.map((child: TreeNodeType, index) => {
            return (
              <li key={String(child.val) + index}>
                <TreeNode node={child} />
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

export default Tree
