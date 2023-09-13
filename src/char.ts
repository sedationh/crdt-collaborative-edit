import Identifier from './identifier'

type Position = Identifier[]

// 包装后的字符
class Char {
  position: Position
  value: string

  constructor(value: string, position: Position) {
    this.position = position
    this.value = value
  }

  compareWith(char: Char) {
    const pos1 = this.position
    const pos2 = char.position
    const minLength = Math.min(pos1.length, pos2.length)
    for (let i = 0; i < minLength; i++) {
      const comp = pos1[i].compareWith(pos2[i])
      if (comp !== 0) return comp
    }
    return pos1.length - pos2.length
  }
}

export { Position }

export default Char
