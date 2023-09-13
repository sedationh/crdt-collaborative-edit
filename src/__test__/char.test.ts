import Char from '../char'
import Identifier from '../identifier'

describe('Char', () => {
  describe('comparePositionTo', () => {
    const char1 = new Char('a', [
      new Identifier(2, 1),
      new Identifier(5, 1),
      new Identifier(1, 2),
    ])

    it("returns -1 if first position is 'lower' than second position", () => {
      const char2 = new Char('b', [
        new Identifier(2, 1),
        new Identifier(5, 1),
        new Identifier(3, 2),
      ])
      expect(char1.compareWith(char2)).toEqual(-1)
    })

    it("returns -1 if first site is 'lower' than second site", () => {
      const char2 = new Char('b', [
        new Identifier(2, 1),
        new Identifier(5, 2),
        new Identifier(1, 2),
      ])
      expect(char1.compareWith(char2)).toEqual(-1)
    })

    it("returns -1 if first position is 'shorter' than second position", () => {
      const char2 = new Char('b', [
        new Identifier(2, 1),
        new Identifier(5, 1),
        new Identifier(1, 2),
        new Identifier(8, 2),
      ])
      expect(char1.compareWith(char2)).toEqual(-1)
    })

    it("returns 1 if first position is 'higher' than second position", () => {
      const char2 = new Char('b', [
        new Identifier(2, 1),
        new Identifier(3, 1),
        new Identifier(1, 2),
      ])
      expect(char1.compareWith(char2)).toEqual(1)
    })

    it("returns 1 if first site is 'higher' than second site", () => {
      const char2 = new Char('b', [
        new Identifier(2, 1),
        new Identifier(5, 1),
        new Identifier(1, 1),
      ])
      expect(char1.compareWith(char2)).toEqual(1)
    })

    it("returns 1 if first position is 'longer' than second position", () => {
      const char2 = new Char('b', [new Identifier(2, 1), new Identifier(5, 1)])
      expect(char1.compareWith(char2)).toEqual(1)
    })

    it('returns 0 if positions are exactly the same', () => {
      const char2 = new Char('b', [
        new Identifier(2, 1),
        new Identifier(5, 1),
        new Identifier(1, 2),
      ])
      expect(char1.compareWith(char2)).toEqual(0)
    })
  })
})
