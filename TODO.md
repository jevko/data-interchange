# rebuild bundle on push

a github action?

# array inference

Currently arrays are inferred to be tuples. Implement optional array inference by checking that all elements have the same schema. Sketch:

```js
// todo: use to implement array schema
const areSchemasEqual = (a, b) => {
  const {type} = a
  if (type !== b.type) return false
  
  // note: assuming primitive types can't be refined further (won't be true in future)
  if (['string', 'float64', 'boolean', 'null'].includes(type)) return true

  if (type === 'tuple') return 'todo'
  if (type === 'array') return 'todo'
  if (type === 'object') return 'todo'
}
```