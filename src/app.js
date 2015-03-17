import IDB from './IDB';

class View {
  constructor(options) {
  }

  render() {
    $('body').append('<h1>Hello</h1>');
  }
}

new View().render();