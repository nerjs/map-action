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

  it('json top-level array is rejected', () => {
    expect(() => parse('[1, 2, 3]')).toThrow(/key-value object/)
  })

  it('json top-level scalar is rejected', () => {
    expect(() => parse('42')).toThrow(/key-value object/)
    expect(() => parse('"qwerty"')).toThrow(/key-value object/)
    expect(() => parse('null')).toThrow(/key-value object/)
  })

  it('yaml top-level array is rejected', () => {
    expect(() => parse('- a\n- b\n')).toThrow(/key-value object/)
  })

  it('flow-style yaml without quoted keys is parsed via yaml fallback', () => {
    expect(parse('{a: 1, b: 2}')).toEqual({ a: 1, b: 2 })
  })

  it('input exceeding max length is rejected', () => {
    const big = '{' + ' '.repeat(64 * 1024) + '}'
    expect(() => parse(big)).toThrow(/exceeds/)
  })
})
