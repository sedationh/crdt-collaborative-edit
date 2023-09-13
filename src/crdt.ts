import { EventEmitter } from 'eventemitter3'
import Char, { Position } from './char'
import Identifier from './identifier'
import Tree from './tree'

const WIDTH = 10

// 实践CRDT算法的文字管理器
class CRDT extends EventEmitter {
  userId: number

  struct: Char[] = []

  tree = new Tree()

  get text() {
    return this.struct.map((char) => char.value).join('')
  }

  set text(text: string) {
    // for mock
    this.struct = text
      .split('')
      .map((value) => new Char(value, [new Identifier(0, 0)]))
  }

  constructor(userId: number) {
    super()
    this.userId = userId
  }

  localInsert(value: string, index: number) {
    const char = this.generateChar(value, index)
    this.insertChar(char)
    this.emit('remoteInsert', char)
  }

  remoteInsert(char: Char) {
    this.insertChar(char)
  }

  localDelete(index: number) {
    const deleteChar = this.struct[index]
    this.deleteChar(index)
    this.emit('remoteDelete', deleteChar)
  }

  remoteDelete(char: Char) {
    const index = this.findIndexByPosition(char)
    this.deleteChar(index)
  }

  insertChar(char: Char) {
    this.struct.push(char)
    this.sortStruct()
    this.tree.buildTreeNodesFromStruct(this.struct)
    return this.struct.length
  }

  deleteChar(index: number) {
    this.struct.splice(index, 1)
    this.tree.buildTreeNodesFromStruct(this.struct)
  }

  generateChar(value: string, index: number) {
    const posBefore = this.struct[index - 1]?.position || []
    const posAfter = this.struct[index]?.position || []
    const newPos = this.generatePosBetween(posBefore, posAfter)
    return new Char(value, newPos)
  }

  generatePosBetween(
    posBefore: Position,
    posAfter: Position,
    newPos: Position = []
  ): Position {
    const identifierBefore = posBefore[0] || new Identifier(0, -1)
    const identifierAfter = posAfter[0] || new Identifier(WIDTH, -1) // WIDTH = 10

    if (identifierAfter.index - identifierBefore.index > 1) {
      // 范围分配足够
      const mid =
        identifierBefore.index +
        Math.floor((identifierAfter.index - identifierBefore.index) / 2)
      newPos.push(new Identifier(mid, this.userId))
      return newPos
    } else if (identifierAfter.index - identifierBefore.index === 1) {
      // 本层不够分配了，需要再开一层
      newPos.push(identifierBefore)
      return this.generatePosBetween(posBefore.slice(1), [], newPos)
    } else {
      // 需要去下一层比较
      newPos.push(identifierBefore)
      return this.generatePosBetween(
        posBefore.slice(1),
        posAfter.slice(1),
        newPos
      )
    }
  }

  findIndexByPosition(char: Char) {
    let left = 0
    let right = this.struct.length - 1
    let mid, compareNum

    if (this.struct.length === 0) {
      throw new Error('Character does not exist in CRDT1.')
    }

    while (left + 1 < right) {
      mid = Math.floor(left + (right - left) / 2)
      compareNum = char.compareWith(this.struct[mid])

      if (compareNum === 0) {
        return mid
      } else if (compareNum > 0) {
        left = mid
      } else {
        right = mid
      }
    }

    if (char.compareWith(this.struct[left]) === 0) {
      return left
    } else if (char.compareWith(this.struct[right]) === 0) {
      return right
    } else {
      throw new Error('Character does not exist in CRDT2.')
    }
  }

  sortStruct() {
    return this.struct.sort((char1, char2) => char1.compareWith(char2))
  }
}

export default CRDT
