import { parse } from '../parsers'
import { dump } from 'js-yaml'

describe('parser', () => {
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
    'some value': 'qwerty',
  }

  it('empty value', () => {
    expect(() => parse('')).toThrow()
  })

  it('incorrect value', () => {
    expect(() => parse('some string')).toThrow()
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
})
