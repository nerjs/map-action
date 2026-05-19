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

    it('array value at key is rejected', () => {
      const map = JSON.stringify({ dev: [1, 2, 3] })
      expect(() => processing(map, 'dev')).toThrow(/Array/)
    })

    it('prototype keys are not picked from the map', () => {
      const map = JSON.stringify(keyValue)
      expect(() => processing(map, 'toString')).toThrow()
      expect(() => processing(map, 'constructor')).toThrow()
      expect(() => processing(map, '__proto__')).toThrow()
    })

    it('prototype key falls through to default_key', () => {
      const map = JSON.stringify(keyValue)
      const out = processing(map, 'toString', 'dev')
      expect(out).toEqual({ [DEFAULT_OUTPUT_KEY]: keyValue.dev })
    })

    it('forbidden output_key_name is rejected', () => {
      const map = JSON.stringify(keyValue)
      expect(() => processing(map, 'dev', '', '__proto__')).toThrow(/not allowed/)
      expect(() => processing(map, 'dev', '', 'constructor')).toThrow(/not allowed/)
      expect(() => processing(map, 'dev', '', 'prototype')).toThrow(/not allowed/)
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
