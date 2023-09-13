import Char from '../char'
import CRDT from '../crdt'
import Identifier from '../identifier'

describe('CRDT', () => {
  describe('generatePosBetween', () => {
    const siteId = 1
    const crdt = new CRDT(siteId)

    it('returns a position with digit 5 when both positions are empty', () => {
      expect(crdt.generatePosBetween([], [])[0].index).toBe(5)
    })

    it('returns a position with digit 6 when first position digit is 2', () => {
      const pos1 = [new Identifier(2, siteId)]

      expect(crdt.generatePosBetween(pos1, [])[0].index).toBe(6)
    })

    it('returns a position with digit 4 when second position digit is 8', () => {
      const pos2 = [new Identifier(8, siteId)]

      expect(crdt.generatePosBetween([], pos2)[0].index).toBe(4)
    })

    it('returns a position half way between two positions when they have a difference of 1', () => {
      const pos1 = [new Identifier(2, siteId)]
      const pos2 = [new Identifier(3, siteId)]
      const newPos = crdt.generatePosBetween(pos1, pos2)
      const combinedPositionDigits = newPos.map((id) => id.index).join('')

      expect(combinedPositionDigits).toBe('25')
    })

    it('returns a position half way between two positions when they have same digits but different siteIds', () => {
      const pos1 = [new Identifier(2, siteId)]
      const pos2 = [new Identifier(2, siteId + 1)]
      const newPos = crdt.generatePosBetween(pos1, pos2)
      const combinedPositionDigits = newPos.map((id) => id.index).join('')

      expect(combinedPositionDigits).toBe('25')
    })

    it('returns a position halfway between two positions with multiple ids', () => {
      const pos1 = [new Identifier(2, siteId), new Identifier(4, siteId)]
      const pos2 = [new Identifier(2, siteId), new Identifier(8, siteId)]
      const newPos = crdt.generatePosBetween(pos1, pos2)
      const combinedPositionDigits = newPos.map((id) => id.index).join('')

      expect(combinedPositionDigits).toBe('26')
    })

    it('generates a position even when position arrays are different lengths', () => {
      const pos1 = [
        new Identifier(2, siteId),
        new Identifier(2, siteId),
        new Identifier(4, siteId),
      ]
      const pos2 = [new Identifier(2, siteId), new Identifier(8, siteId)]
      const newPos = crdt.generatePosBetween(pos1, pos2)
      const combinedPositionDigits = newPos.map((id) => id.index).join('')

      expect(combinedPositionDigits).toBe('25')
    })

    it('throws a sorting error if positions are sorted incorrectly', () => {
      const pos1 = [new Identifier(2, siteId + 1)]
      const pos2 = [new Identifier(2, siteId)]

      expect(function () {
        crdt.generatePosBetween(pos1, pos2)
      }).toThrow(new Error('Fix Position Sorting'))
    })
  })

  describe('generateChar', () => {
    let crdt
    let newChar: Char
    beforeEach(() => {
      crdt = new CRDT(25)
      // crdt.counter++
      newChar = crdt.generateChar('A', 0)
    })
    it('returns a new Char object', () => {
      expect(newChar instanceof Char).toBe(true)
    })
    it('creates the Char with the correct value', () => {
      expect(newChar.value).toEqual('A')
    })

    it('creates the Char with an array of position identifiers', () => {
      expect(newChar.position instanceof Array).toBe(true)
    })
    it('has at least one position identifier', () => {
      expect(newChar.position.length).toBeGreaterThan(0)
    })

    // it('creates the Char with the correct counter', () => {
    //   expect(newChar.counter).toEqual(1)
    // })
  })

  describe('sortStruct', () => {
    const crdt = new CRDT(25)
    const a = new Char('a', [new Identifier(2, 25)])
    const b = new Char('b', [new Identifier(1, 25)])
    crdt.insertChar(a)
    crdt.insertChar(b)
    it('returns the sorted structure', () => {
      const sorted = crdt.sortStruct()
      expect(sorted).toEqual([b, a])
    })
  })

  describe('insertChar', () => {
    const siteId = 1
    const id1 = new Identifier(1, siteId)
    const position = [id1]
    const char1 = new Char('A', position)
    it('adds char to CRDT', () => {
      const crdt = new CRDT(siteId)
      expect(crdt.struct.length).toBe(0)
      crdt.insertChar(char1)
      expect(crdt.struct.length).toBe(1)
    })
    it('returns new length of the CRDT', () => {
      const crdt = new CRDT(siteId)
      expect(crdt.insertChar(char1)).toBe(1)
    })

    it('Sorts the chars correctly', () => {
      const crdt = new CRDT(siteId)
      const char2 = new Char('B', [new Identifier(0, 0), new Identifier(5, 0)])
      crdt.insertChar(char1)
      crdt.insertChar(char2)
      expect(crdt.text).toBe('BA')
    })

    // it('does not increment counter', () => {
    //   const crdt = new CRDT(siteId)
    //   crdt.insertChar(char1)
    //   expect(crdt.counter).toBe(0)
    // })
  })

  // describe('localInsert', () => {
  //   it('creates char with value, counter, and position', () => {
  //     const siteId = 1
  //     const siteClock = 1
  //     const crdt = new CRDT(siteId)
  //     const newChar = crdt.localInsert('A', 0)
  //     expect(newChar.value).toEqual('A')
  //     expect(newChar.counter).toEqual(1)
  //     expect(newChar.position instanceof Array).toBe(true)
  //   })
  //   it('increments the local counter', () => {
  //     const siteId = 1
  //     const siteClock = 1
  //     const crdt = new CRDT(siteId)
  //     const char = crdt.localInsert('A', 0)
  //     expect(crdt.counter).toEqual(1)
  //   })
  // })

  // describe('updateText', () => {
  //   it('returns empty text when CRDT is empty', () => {
  //     const siteId = 1
  //     const crdt = new CRDT(siteId)
  //     expect(crdt.text).toEqual('')
  //   })
  //   it("returns char's value when car is added to CRDT", () => {
  //     const siteId = 1
  //     const siteClock = 1
  //     const crdt = new CRDT(siteId)
  //     const id1 = new Identifier(1, siteId)
  //     const position = [id1]
  //     const char1 = new Char('A', siteClock, position)
  //     const newLength = crdt.insertChar(char1)
  //     expect(crdt.text).toEqual('A')
  //   })
  // })
  // describe('localDelete', () => {
  //   let crdt
  //   let a
  //   let b
  //   beforeEach(() => {
  //     crdt = new CRDT(25)
  //     a = new Char('a', 0, [new Identifier(1, 25)])
  //     b = new Char('b', 0, [new Identifier(2, 25)])
  //     crdt.insertChar(a)
  //     crdt.insertChar(b)
  //   })
  //   it('deletes the correct character', () => {
  //     crdt.localDelete(0)
  //     expect(crdt.struct).toEqual([b])
  //   })
  //   it("increments the crdt's counter", () => {
  //     const oldCounter = crdt.counter
  //     crdt.localDelete(0)
  //     expect(crdt.counter).toEqual(oldCounter + 1)
  //   })
  //   it("decreases the crdt's length property and returns it", () => {
  //     const oldLength = crdt.length
  //     const newLength = crdt.localDelete(0)
  //     expect(newLength).toEqual(oldLength - 1)
  //   })
  // })

  // describe('remoteDelete', () => {
  //   const siteId = 1
  //   const siteClock = 1
  //   const id1 = new Identifier(1, siteId)
  //   const position = [id1]
  //   const char1 = new Char('A', siteClock, position)
  //   it('removes a char from the crdt', () => {
  //     const crdt = new CRDT(siteId)
  //     crdt.insertChar(char1)
  //     expect(crdt.length).toBe(1)
  //     crdt.remoteDelete(char1)
  //     expect(crdt.length).toBe(0)
  //   })
  //   it("throws error if char couldn't be found", () => {
  //     const crdt = new CRDT(siteId)
  //     expect(() => crdt.remoteDelete(char1)).toThrow(
  //       new Error('Character could not be found')
  //     )
  //   })
  // })
  // describe('incrementCounter', () => {
  //   it('increments the counter of the CRDT', () => {
  //     const crdt = new CRDT(1)
  //     expect(crdt.counter).toBe(0)
  //     crdt.incrementCounter()
  //     expect(crdt.counter).toBe(1)
  //   })
  // })
})
