import { DEFAULT_OUTPUT_KEY } from '../constants'
import { processing } from '../processing'

describe('main', () => {
  const keyValue = {
    dev: 'development value',
    prod: 'production value',
  }

  const multikeyValue = {
    dev: {
      var1: 'dev qwerty',
      var2: 'dev Tratata',
    },
    prod: {
      var1: 'prod qwerty',
      var2: 'prod Tratata',
    },
  }

  describe('failed branch', () => {
    it('missing key and defaultKey', () => {
      expect(() => processing('{"dev": "value"}')).toThrow()
    })

    it('incorrect map', () => {
      expect(() => processing('some incorrect string', 'dev')).toThrow()
    })

    it('object output and output name', () => {
      expect(() => processing(JSON.stringify(multikeyValue), 'dev', '', 'outputName')).toThrow()
      expect(() => processing(JSON.stringify(multikeyValue), 'some', 'prod', 'outputName')).toThrow()
    })

    it('Empty object in output', () => {
      const multikeyCopy = {
        ...multikeyValue,
        dev: {},
      }
      expect(() => processing(JSON.stringify(multikeyCopy), 'dev')).toThrow()
      expect(() => processing(JSON.stringify(multikeyCopy), 'some', 'dev')).toThrow()
    })

    it('No defaultKey if no key matches found', () => {
      expect(() => processing(JSON.stringify(keyValue), 'some')).toThrow()
    })

    it('No matches by key or defaultKey', () => {
      expect(() => processing(JSON.stringify(keyValue), 'some', 'other')).toThrow()
    })

    it('undefined or null output', () => {
      expect(() => processing(JSON.stringify({ ...keyValue, dev: null }), 'dev')).toThrow()
      expect(() => processing(JSON.stringify({ ...keyValue, dev: undefined }), 'dev')).toThrow()
      expect(() => processing(JSON.stringify({ ...keyValue, dev: null }), 'some', 'dev')).toThrow()
      expect(() => processing(JSON.stringify({ ...keyValue, dev: undefined }), 'some', 'dev')).toThrow()
    })
  })

  describe('successed branch', () => {
    it('Object on output by key match', () => {
      const output = processing(JSON.stringify(multikeyValue), 'dev')
      expect(output).toEqual(multikeyValue.dev)
    })

    it('Object on output by key mismatch (defaultKey use)', () => {
      const output = processing(JSON.stringify(multikeyValue), 'some', 'dev')
      expect(output).toEqual(multikeyValue.dev)
    })

    it('String on output by match', () => {
      const outputKey = 'output'
      const output = processing(JSON.stringify(keyValue), 'dev', 'some', outputKey)
      expect(output).toEqual({
        [outputKey]: keyValue.dev,
      })
    })

    it('String on output by match (defaultKey use)', () => {
      const outputKey = 'output'
      const output = processing(JSON.stringify(keyValue), 'some', 'dev', outputKey)
      expect(output).toEqual({
        [outputKey]: keyValue.dev,
      })
    })

    it('String on output by match. default output key', () => {
      const output = processing(JSON.stringify(keyValue), 'dev')
      expect(output).toEqual({
        [DEFAULT_OUTPUT_KEY]: keyValue.dev,
      })
    })

    it('String on output by match. default output key (defaultKey use)', () => {
      const output = processing(JSON.stringify(keyValue), 'some', 'dev')
      expect(output).toEqual({
        [DEFAULT_OUTPUT_KEY]: keyValue.dev,
      })
    })
  })
})
