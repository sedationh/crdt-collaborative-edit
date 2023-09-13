import SimpleMDE from 'simplemde'
import { EventEmitter } from 'eventemitter3'
import Char from './char'
import Editor from './editor'
import CRDT from './crdt'

interface EditorOptions {
  element?: HTMLElement
}

interface ControllerOptions extends EditorOptions {
  userId: number
}

export interface Operation {
  type: 'insert' | 'delete'
  char: Char
}

// 管理 Editor 与 Server的通讯
class Controller {
  userId: number
  editor: Editor
  mockIO = new EventEmitter()
  constructor(controllerOptions: ControllerOptions) {
    const mde = new SimpleMDE({
      spellChecker: false,
      toolbar: false,
      shortcuts: {},
      element:
        controllerOptions.element ||
        (document.getElementById('editor') as HTMLElement),
    })
    this.userId = controllerOptions.userId
    this.editor = new Editor(mde, new CRDT(this.userId))
    this.bindEmitterEvents()
  }

  bindEmitterEvents() {
    this.editor.on('remoteInsert', (char: Char) =>
      this.mockIO.emit('remoteOperation', {
        type: 'insert',
        char: char,
      })
    )

    this.editor.on('remoteDelete', (char: Char) =>
      this.mockIO.emit('remoteOperation', {
        type: 'delete',
        char: char,
      })
    )
  }

  applyOperation(operation: Operation) {
    if (operation.type === 'insert') {
      this.editor.remoteInsert(operation.char)
    } else if (operation.type === 'delete') {
      this.editor.remoteDelete(operation.char)
    }
  }
}

export default Controller
