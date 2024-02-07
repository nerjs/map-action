import { parse } from '../parsers'
import { dump } from 'js-yaml'

describe('Yaml parser', () => {
  const testObject = {
    objectField: {
      value: 'qwerty',
      qwerty: 123,
    },
    arrayField: [
      {
        key: 'qwerty',
        value: 123,
      },
    ],
    some: 'qwerty',
  }

  it('empty value', () => {
    expect(parse('')).toEqual({})
  })

  it('incorrect value', () => {
    expect(parse('some string')).toEqual({})
  })

  it('parse json', () => {
    const jsonStr = JSON.stringify(testObject)

    const result = parse(jsonStr)
    expect(result).toEqual(testObject)
  })

  it('parse yaml', () => {
    const yamlStr = dump(testObject)

    const result = parse(yamlStr)
    expect(result).toEqual(testObject)
  })

  it('parse env', () => {
    const envStr = `
      SOME_VALUE = qwerty
      other_value=123
    `

    const result = parse(envStr)
    expect(result).toEqual({
      SOME_VALUE: 'qwerty',
      other_value: '123',
    })
  })
})
