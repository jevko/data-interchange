export const jevkoToSchema = (jevko) => {
  const {subjevkos, suffix} = jevko
  const type = suffix.trim()

  if (['string', 'number', 'boolean', 'null'].includes(type)) {
    if (subjevkos.length > 0) throw Error('subs > 0 in string')
    return {type}
  }
  if (type === 'array') return toArray(jevko)
  if (type === 'tuple') return toTuple(jevko)
  if (type === 'first match') return toFirstMatch(jevko)
  if (type === 'object') return toObject(jevko)
  // todo: or infer
  throw Error('unknown type')
}

const toArray = (jevko) => {
  const {subjevkos, suffix} = jevko
  if (subjevkos.length !== 1) throw Error('subs !== 1 in array')
  const {prefix, jevko: j} = subjevkos[0]
  if (prefix.trim() !== '') throw Error('empty prefix expected')
  return {
    type: 'array',
    itemSchema: jevkoToSchema(j)
  }
}

const toTuple = (jevko) => {
  const {subjevkos, suffix} = jevko
  // note: allows empty tuple
  const itemSchemas = []
  for (const {prefix, jevko} of subjevkos) {
    if (prefix.trim() !== '') throw Error('empty prefix expected')
    itemSchemas.push(jevkoToSchema(jevko))
  }
  return {
    type: 'tuple',
    itemSchemas,
  }
}

const toFirstMatch = (jevko) => {
  const {subjevkos, suffix} = jevko
  // note: allows empty alternatives
  const alternatives = []
  for (const {prefix, jevko} of subjevkos) {
    if (prefix.trim() !== '') throw Error('empty prefix expected')
    alternatives.push(jevkoToSchema(jevko))
  }
  return {
    type: 'first match',
    alternatives,
  }
}

const toObject = (jevko) => {
  const {subjevkos, suffix} = jevko

  const props = Object.create(null)
  for (const {prefix, jevko} of subjevkos) {
    const key = prefix.trim()
    if (key === '') throw Error('empty key')
    if (key in props) throw Error('duplicate key')
    props[key] = jevkoToSchema(jevko)
  }

  return {
    type: 'object',
    props,
  }
}