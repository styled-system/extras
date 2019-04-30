const Benchmark = require('benchmark')
const index = require('./dist.js').default
const alt = require('./dist-alt.js').default

const theme = {
  colors: {
    primary: 'tomato',
    secondary: 'cyan',
  },
  // space: [ 0, 4, 8, 16, 32, 64, 128, 256 ],
  fontSizes: [
    12, 14, 16, 24, 36
  ],
  fonts: {
    monospace: 'Menlo, monospace',
  },
  lineHeights: {
    body: 1.5,
  },
  fontWeights: {
    bold: 600,
  },
}

const fixtures = {
  basic: {
    fontSize: 32,
    fontWeight: 'bold',
    px: 2,
    py: 3,
    mb: 4,
    color: 'blue',
    borderRadius: 4,
  },
}

const tests = [
  {
    name: 'index.js',
    func: index,
    args: fixtures.basic,
  },
  {
    name: 'alt.js',
    func: alt,
    args: fixtures.basic,
  },
]

const suite = new Benchmark.Suite()

tests.forEach(({ name, func, args }) => {
  console.log(name, func(args)())
  suite.add(name, () => func(args)())
})

tests.forEach(({ name, func, args }) => {
  console.log(name + ' w/ theme', func(args)(theme))
  suite.add(name + ' with theme', () => func(args)(theme))
})

suite
  .on('cycle', event => {
    console.log(String(event.target))
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`)
  })
  .run({ async: true })
