# map-action

GitHub Action that picks a value from a JSON or YAML map by key and exposes
it as a step output. Useful for environment-to-value lookup tables (per-env
URLs, image tags, feature flags) that you would otherwise duplicate across
workflow `if:` blocks.

## Usage

### Scalar value per environment

```yaml
- uses: nerjs/map-action@v0.1.0
  id: api
  with:
    key: ${{ github.ref_name }}
    default_key: main
    map: |
      main: https://api.example.com
      staging: https://api.staging.example.com

- run: echo "${{ steps.api.outputs.value }}"
```

`outputs.value` holds the scalar matching `key`, falling back to
`default_key` when `key` is empty or not found.

### Object value: every field becomes an output

```yaml
- uses: nerjs/map-action@v0.1.0
  id: env
  with:
    key: ${{ github.ref_name }}
    default_key: main
    map: |
      {
        "main":    { "url": "https://api.example.com",         "tag": "stable" },
        "staging": { "url": "https://api.staging.example.com", "tag": "edge" }
      }

- run: |
    echo "${{ steps.env.outputs.url }}"
    echo "${{ steps.env.outputs.tag }}"
```

When the looked-up value is an object, each top-level field becomes its own
output. `output_key_name` is not allowed in this case.

### Custom output name for scalar values

```yaml
- uses: nerjs/map-action@v0.1.0
  id: tag
  with:
    key: ${{ github.ref_name }}
    default_key: main
    output_key_name: image_tag
    map: '{"main":"stable","staging":"edge"}'

- run: docker pull myimage:${{ steps.tag.outputs.image_tag }}
```

## Inputs

| Name              | Required | Description                                                                                  |
|-------------------|----------|----------------------------------------------------------------------------------------------|
| `map`             | yes      | Mapping as a JSON object or YAML mapping at the top level.                                   |
| `key`             | no       | Primary key to look up. Either `key` or `default_key` must be set.                           |
| `default_key`     | no       | Fallback key used when `key` is empty or not present in the map.                             |
| `output_key_name` | no       | Output name when the value is a scalar. Defaults to `value`. Not allowed for object values.  |

## Outputs

- When the value is a scalar - a single output named `output_key_name`
  (`value` by default).
- When the value is an object - one output per top-level field of that
  object.

## Notes

- Top-level arrays and scalars are rejected: `map` must be a key-value
  structure.
- Output values are not auto-masked. If your map contains secrets, call
  `core.setSecret` on them in a prior step.
- Forbidden output names: `__proto__`, `prototype`, `constructor`.

## License

[MIT](LICENSE).
