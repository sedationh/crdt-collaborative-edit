/* eslint-disable prefer-const */
import 'simplemde/dist/simplemde.min.css'
import CRDT from './crdt'
import SimpleMDE from 'simplemde'
import { EditorChange } from 'codemirror'
import { EventEmitter } from 'eventemitter3'
import Char from './char'
// 衔接 simplemde 和 CRDT
class Editor extends EventEmitter {
  modal: CRDT
  mde: SimpleMDE

  constructor(simpleMDE: SimpleMDE, modal: CRDT) {
    super()
    this.modal = modal
    this.mde = simpleMDE

    this.bindEmitterEvents()
  }

  bindEmitterEvents() {
    this.modal.on('remoteInsert', this.emit.bind(this, 'remoteInsert'))
    this.modal.on('remoteDelete', this.emit.bind(this, 'remoteDelete'))
    this.bindChangeEvent()
  }

  bindChangeEvent() {
    this.mde.codemirror.on('change', (_: never, changeObj: EditorChange) => {
      // 只处理local用户的行为
      if (changeObj.origin === 'setValue') return
      if (changeObj.origin === 'insertText') return
      if (changeObj.origin === 'deleteText') return

      switch (changeObj.origin) {
        case 'redo':
        case 'undo':
          // this.processUndoRedo(changeObj);
          break
        case '+input':
          // case 'paste':
          this.processInsert(changeObj)
          break
        case '+delete':
          // case 'cut':
          this.processDelete(changeObj)
          break
        default:
          throw new Error('Unknown operation attempted in editor.')
      }
    })
  }

  processInsert(changeObj: EditorChange) {
    const value = this.extractChars(changeObj.text)
    const linePos = changeObj.from.line
    const charPos = changeObj.from.ch
    const startIdx = this.findLinearIdx(linePos, charPos)
    this.modal.localInsert(value, startIdx)
  }

  processDelete(changeObj: EditorChange) {
    const idx = this.findLinearIdx(changeObj.from.line, changeObj.from.ch)
    this.modal.localDelete(idx)
  }

  extractChars(text: string[]) {
    if (text[0] === '' && text[1] === '' && text.length === 2) {
      return '\n'
    } else {
      return text.join('\n')
    }
  }

  findLinearIdx(lineIdx: number, chIdx: number) {
    const linesOfText = this.modal.text.split('\n')

    let index = 0
    for (let i = 0; i < lineIdx; i++) {
      index += linesOfText[i].length + 1
    }

    return index + chIdx
  }

  remoteInsert(char: Char) {
    this.modal.remoteInsert(char)
    this.remoteInsertSyncWithEditor(char)
  }

  remoteDelete(char: Char) {
    this.remoteDeleteSyncWithEditor(char)
    this.modal.remoteDelete(char)
  }

  remoteInsertSyncWithEditor(char: Char) {
    const value = char.value
    const index = this.findInsertIndex(char)
    const substring = this.modal.text.slice(0, index + 1)
    const linesOfText = substring.split('\n')
    let line, ch

    if (value === '\n') {
      line = linesOfText.length - 2
      ch = linesOfText[line].length
    } else {
      line = linesOfText.length - 1
      ch = linesOfText[line].length - 1
    }

    const positions = {
      from: {
        line: line,
        ch: ch,
      },
      to: {
        line: line,
        ch: ch,
      },
    }

    this.mde.codemirror.replaceRange(
      value,
      positions.from,
      positions.to,
      'insertText'
    )
  }

  remoteDeleteSyncWithEditor(char: Char) {
    const value = char.value
    const index = this.modal.findIndexByPosition(char)
    const substring = this.modal.text.slice(0, index + 1)
    const linesOfText = substring.split('\n')
    let line, ch, positions

    if (value === '\n') {
      line = linesOfText.length - 2
      ch = linesOfText[line].length

      positions = {
        from: {
          line: line,
          ch: ch,
        },
        to: {
          line: line + 1,
          ch: 0,
        },
      }
    } else {
      line = linesOfText.length - 1
      ch = linesOfText[line].length - 1

      positions = {
        from: {
          line: line,
          ch: ch,
        },
        to: {
          line: line,
          ch: ch + 1,
        },
      }
    }

    this.mde.codemirror.replaceRange(
      '',
      positions.from,
      positions.to,
      'deleteText'
    )
  }

  findInsertIndex(char: Char) {
    let left = 0
    let right = this.modal.struct.length - 1
    let mid, compareNum

    if (
      this.modal.struct.length === 0 ||
      char.compareWith(this.modal.struct[left]) < 0
    ) {
      return left
    } else if (char.compareWith(this.modal.struct[right]) > 0) {
      return this.modal.struct.length
    }

    while (left + 1 < right) {
      mid = Math.floor(left + (right - left) / 2)
      compareNum = char.compareWith(this.modal.struct[mid])

      if (compareNum === 0) {
        return mid
      } else if (compareNum > 0) {
        left = mid
      } else {
        right = mid
      }
    }

    return char.compareWith(this.modal.struct[left]) === 0 ? left : right
  }
}
export default Editor
