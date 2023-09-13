import EventEmitter from 'eventemitter3'
import Controller, { Operation } from '../src/controller'

class MockServer extends EventEmitter {
  connections: Controller[] = []

  addClient(controller: Controller) {
    this.connections.push(controller)
    controller.mockIO.on('remoteOperation', (operation: Operation) => {
      if (operation.type === 'insert') {
        this.insert(controller, operation)
      } else if (operation.type === 'delete') {
        this.delete(controller, operation)
      }
      this.diagram(controller, operation)
    })
  }

  insert(from: Controller, payload: Operation) {
    this.connections
      .filter((controller) => controller !== from)
      .forEach((controller) => controller.applyOperation(payload))
  }

  delete(from: Controller, payload: Operation) {
    this.connections
      .filter((controller) => controller !== from)
      .forEach((controller) => controller.applyOperation(payload))
  }

  diagram(from: Controller, payload: Operation) {
    this.emit('diagram', from, payload)
  }
}

export default MockServer
