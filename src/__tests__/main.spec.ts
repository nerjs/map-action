import { DEFAULT_OUTPUT_KEY } from '../constants'
import { main } from '../main'

describe('testing action', () => {
  const controls = {
    getInput: jest.fn(),
    info: jest.fn(),
    setFailed: jest.fn(),
    setOutput: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('Failed parse', async () => {
    controls.getInput.mockImplementation((key: string) => {
      if (key === 'map') return 'some incorrect map'
      if (key === 'key') return 'dev'
    })
    main(controls)

    expect(controls.setFailed).toHaveBeenCalled()
  })

  it('Parse input', () => {
    controls.getInput.mockImplementation((key: string) => {
      if (key === 'map') return JSON.stringify({ dev: 'qwerty' })
      if (key === 'key') return 'dev'
    })
    main(controls)

    expect(controls.setFailed).not.toHaveBeenCalled()
    expect(controls.setOutput).toHaveBeenCalled()
    expect(controls.setOutput).toHaveBeenCalledWith(DEFAULT_OUTPUT_KEY, 'qwerty')
  })
})
