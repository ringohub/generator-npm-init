import test from 'ava'
import path from 'path'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'

test('uses the right defaults on bare project', async (t) => { // eslint-disable-line
  const dir = await runGenerator(null, null, null)

  assert.file('package.json')

  assert.JSONFileContent('package.json', { // eslint-disable-line
    name: dir,
    version: '1.0.0',
    main: 'index.js',
    license: 'ISC',
    scripts: {
      test: 'echo \"Error: no test specified\" && exit 1'
    }
  })
})

test('uses prompt responses', async (t) => { // eslint-disable-line
  await runGenerator(
    {
      name: 'foo',
      description: 'lorem ipsum dolor',
      version: '9.9.9',
      main: 'app.js',
      repo: 'foo/bar',
      keywords: 'foo bar baz qux',
      author: 'foobar',
      license: 'MIT',
      test: 'ava --verbose'
    })

  assert.file('package.json')

  assert.JSONFileContent('package.json', {
    name: 'foo',
    description: 'lorem ipsum dolor',
    version: '9.9.9',
    main: 'app.js',
    repository: 'foo/bar',
    keywords: [
      'foo',
      'bar',
      'baz',
      'qux'
    ],
    author: 'foobar',
    license: 'MIT',
    scripts: {
      test: 'ava --verbose'
    }
  })
})

test('uses supplied defaults', async (t) => { // eslint-disable-line
  await runGenerator(
    null,
    {
      name: 'foo',
      description: 'lorem ipsum dolor',
      version: '9.9.9',
      main: 'app.js',
      repo: 'foo/bar',
      keywords: [
        'foo',
        'bar',
        'baz',
        'qux'
      ],
      author: 'foobar',
      license: 'MIT',
      test: 'ava --verbose'
    })

  assert.file('package.json')

  assert.JSONFileContent('package.json', {
    name: 'foo',
    description: 'lorem ipsum dolor',
    version: '9.9.9',
    main: 'app.js',
    repository: 'foo/bar',
    keywords: [
      'foo',
      'bar',
      'baz',
      'qux'
    ],
    author: 'foobar',
    license: 'MIT',
    scripts: {
      test: 'ava --verbose'
    }
  })
})

test('respects skip-* options', async (t) => { // eslint-disable-line
  await runGenerator(
    null,
    {
      'skip-name': true
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', { name: undefined, 'skip-name': undefined })
})

test('respects skip-test option', async (t) => { // eslint-disable-line
  await runGenerator(
    null,
    {
      'skip-test': true
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', { scripts: { test: undefined } })
})

function runGenerator(prompts, opts) {
  let basename

  return new Promise((resolve) => {
    helpers.run(path.join(__dirname, 'app'))
      .inTmpDir((d) => basename = path.basename(d))
      .withOptions(opts || {})
      .withPrompts(prompts || {})
      .on('end', () =>
        resolve(basename))
    })
}
