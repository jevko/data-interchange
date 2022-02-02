export const jevkoToValue = (jevko, schema) => {
  const {type} = schema
  if (type === 'string') return toString(jevko, schema)
  if (type === 'number') return toNumber(jevko, schema)
  if (type === 'boolean') return toBoolean(jevko, schema)
  if (type === 'null') return toNull(jevko, schema)
  if (type === 'array') return toArray(jevko, schema)
  if (type === 'tuple') return toTuple(jevko, schema)
  if (type === 'object') return toObject(jevko, schema)
  if (type === 'first match') return toFirstMatch(jevko, schema)
  throw Error(`Unknown schema type ${type}`)
}

const toString = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (subjevkos.length > 0) throw Error('nonempty subjevkos in string')
  return suffix
}

const toNumber = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (subjevkos.length > 0) throw Error('nonempty subjevkos in number')
  const num = Number.parseFloat(suffix)
  if (Number.isNaN(num)) throw Error('nan')
  return num
}

const toBoolean = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (subjevkos.length > 0) throw Error('nonempty subjevkos in boolean')
  if (suffix === 'true') return true
  if (suffix === 'false') return false
  throw Error('not a boolean')
}

const toNull = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (subjevkos.length > 0) throw Error('nonempty subjevkos in null')
  if (suffix === 'null') return null
  throw Error('not a null')
}

const toArray = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (suffix.trim() !== '') throw Error('suffix !== ""')
  const ret = []
  const {itemSchema} = schema
  for (const {prefix, jevko} of subjevkos) {
    if (prefix.trim() !== '') throw Error('nonempty prefix')
    ret.push(jevkoToValue(jevko, itemSchema))
  }
  return ret
}

const toTuple = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (suffix.trim() !== '') throw Error('suffix !== ""')
  const ret = []
  const {itemSchemas, isSealed} = schema
  if (itemSchemas.length > subjevkos.length) throw Error('bad tuple')
  if (isSealed && itemSchemas.length !== subjevkos.length) throw Error('also bad tuple')
  for (let i = 0; i < itemSchemas.length; ++i) {
    const {prefix, jevko} = subjevkos[i]
    if (prefix.trim() !== '') throw Error('nonempty prefix')
    ret.push(jevkoToValue(jevko, itemSchemas[i]))
  }
  return ret
}

const toObject = (jevko, schema) => {
  const {subjevkos, suffix} = jevko
  if (suffix.trim() !== '') throw Error('suffix !== ""')
  const keyJevkos = Object.create(null)
  const ret = Object.create(null)
  // if (subjevkos.length === 0) {
  //   // todo: if schema allows
  //   return ret
  // }
  const {optional = [], isSealed = true, props} = schema
  const keys = Object.keys(props)
  for (const {prefix, jevko} of subjevkos) {
    const key = prefix.trim()
    if (key === '') throw Error('empty key')
    if (key in keyJevkos) throw Error('duplicate key')
    if (isSealed && keys.includes(key) === false) throw Error('unknown key')
    keyJevkos[key] = jevko
  }
  for (const key of keys) {
    if (key in keyJevkos === false) {
      if (optional.includes(key) === false) throw Error('key required')
      continue
    }
    ret[key] = jevkoToValue(keyJevkos[key], props[key])
  }
  return ret
}
const toFirstMatch = (jevko, schema) => {
  const {alternatives} = schema

  for (const alt of alternatives) {
    try {
      const x = jevkoToValue(jevko, alt)
      return x
    } catch (e) {
      continue
    }
  }
  throw Error('union: invalid jevko')
}
