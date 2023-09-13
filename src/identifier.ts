/**
 * 作为 Char Position的记录单位
 */
class Identifier {
  index: number
  userId: number

  constructor(index: number, userId: number) {
    this.index = index
    this.userId = userId
  }

  compareWith(identifier: Identifier) {
    if (this.index < identifier.index) {
      return -1
    } else if (this.index > identifier.index) {
      return 1
    } else {
      return this.userId - identifier.userId
    }
  }
}

export default Identifier
