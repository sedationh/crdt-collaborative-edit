// /**
//  * @jest-environment jsdom
//  */
// import Controller from '../controller'

// describe('Editor', () => {
//   document.body.innerHTML = `
// <div class="editors">
//   <div class="editor-wrap">
//     <h2>editor1</h2>
//     <textarea id="editor1"></textarea>
//   </div>
// </div>
// `

//   const $editor = document.getElementById('editor1') as HTMLTextAreaElement

//   const controller = new Controller({
//     element: $editor,
//   })

//   describe('findLinearIdx', () => {
//     it('returns 0 if lines of text is empty', () => {
//       controller.editor.modal.text = ''
//       expect(controller.editor.findLinearIdx(0, 0)).toEqual(0)
//     })

//     it('calculates linear index from a single line of text', () => {
//       controller.editor.modal.text = 'abcdefghijklmnop'
//       expect(controller.editor.findLinearIdx(0, 7)).toEqual(7)
//     })

//     it('calculates linear index from multiple lines of text', () => {
//       controller.editor.modal.text = 'abc\ndefgh\nijk\nlmnop'
//       expect(controller.editor.findLinearIdx(1, 2)).toEqual(6)
//     })

//     it('can find the linear index on the last line of text', () => {
//       controller.editor.modal.text = 'abc\ndefgh\nijk\nlmnop'
//       expect(controller.editor.findLinearIdx(3, 2)).toEqual(16)
//     })

//     it('can find the linear index at the end of a line of text', () => {
//       controller.editor.modal.text = 'abc\ndefgh\nijk\nlmnop'
//       expect(controller.editor.findLinearIdx(1, 5)).toEqual(9)
//     })
//   })
// })
