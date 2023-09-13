import Controller from '../src/controller'
import MockServer from '../src/server'
import ReactDOM from 'react-dom'
import Tree from './Tree'
import { useEffect, useState } from 'react'

const $editor1 = document.getElementById('editor1') as HTMLTextAreaElement
const $editor2 = document.getElementById('editor2') as HTMLTextAreaElement

const controller1 = new Controller({
  element: $editor1,
  userId: 1,
})

const controller2 = new Controller({
  element: $editor2,
  userId: 2,
})

const ms = new MockServer()

ms.addClient(controller1)
ms.addClient(controller2)

const DiagramView = () => {
  const [editor1Diagram, setEditor1Diagram] = useState({
    type: 'None',
    value: '',
    position: '[]',
  })

  const [editor2Diagram, setEditor2Diagram] = useState({
    type: 'None',
    value: '',
    position: '[]',
  })
  useEffect(() => {
    ms.on('diagram', (from, operation) => {
      const value = operation.char.value
      const position = `[ ${operation.char.position
        .map((identifier: { index: number }) => identifier.index)
        .join(', ')} ]`
      if (from.userId === 1) {
        setEditor1Diagram({
          type: operation.type,
          value,
          position,
        })
      } else {
        setEditor2Diagram({
          type: operation.type,
          value,
          position,
        })
      }
    })
  }, [])

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>DiagramView</h2>
      <div className="diagram-wrapper">
        <div
          style={{
            backgroundColor:
              editor1Diagram?.type === 'insert' ? '#AED581' : '#FF8A65',
          }}
          className="diagram"
        >
          <div className="type">➡️</div>
          <div className="type">{editor1Diagram?.type}</div>
          <div className="char">{editor1Diagram?.value}</div>
          <div className="char">{editor1Diagram?.position}</div>
        </div>
        <div
          className="diagram"
          style={{
            backgroundColor:
              editor2Diagram?.type === 'insert' ? '#AED581' : '#FF8A65',
          }}
        >
          <div className="type">⬅️</div>
          <div className="type">{editor2Diagram?.type}</div>
          <div className="char">{editor2Diagram?.value}</div>
          <div className="char">{editor2Diagram?.position}</div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(
  <Tree controller={controller1} />,
  document.getElementById('tree-view1')
)
ReactDOM.render(
  <Tree controller={controller2} />,
  document.getElementById('tree-view2')
)

ReactDOM.render(<DiagramView />, document.querySelector('.mid'))
