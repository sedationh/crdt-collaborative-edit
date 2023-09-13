import Identifier from '../identifier'

describe('Identifier', () => {
  describe('compareTo', () => {
    it('compares itself to an id with a larger digit', () => {
      const id1 = new Identifier(1, 1)
      const id2 = new Identifier(2, 1)

      const comparator = id1.compareWith(id2)
      expect(comparator).toBe(-1)
    })

    it('compares itself to an id with a smaller digit', () => {
      const id1 = new Identifier(2, 1)
      const id2 = new Identifier(1, 1)

      const comparator = id1.compareWith(id2)
      expect(comparator).toBe(1)
    })

    it('compares itself to an id with a larger siteId', () => {
      const id1 = new Identifier(1, 1)
      const id2 = new Identifier(1, 2)

      const comparator = id1.compareWith(id2)
      expect(comparator).toBe(-1)
    })

    it('compares itself to an id with a smaller siteId', () => {
      const id1 = new Identifier(1, 2)
      const id2 = new Identifier(1, 1)

      const comparator = id1.compareWith(id2)
      expect(comparator).toBe(1)
    })

    it('compares itself to an id with the same digit and site', () => {
      const id1 = new Identifier(1, 1)
      const id2 = new Identifier(1, 1)

      const comparator = id1.compareWith(id2)
      expect(comparator).toBe(0)
    })
  })
})
