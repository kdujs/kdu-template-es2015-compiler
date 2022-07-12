const transpile = require('./index')
const Kdu = require('kdu')
const { compile } = require('kdu-template-compiler')

test('should work', () => {
  const res = compile(`
    <div>
      <div>{{ foo }}</div>
      <div k-for="{ name } in items">{{ name }}</div>
    </div>
  `)

  const toFunction = code => {
    code = transpile(`function render(){${code}}`)
    code = code.replace(/^function render\(\)\{|\}$/g, '')
    return new Function(code)
  }

  const vm = new Kdu({
    data: {
      foo: 'hello',
      items: [
        { name: 'foo' },
        { name: 'bar' }
      ]
    },
    render: toFunction(res.render),
    staticRenderFns: res.staticRenderFns.map(toFunction)
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(`<div>hello</div> <div>foo</div><div>bar</div>`)
})
