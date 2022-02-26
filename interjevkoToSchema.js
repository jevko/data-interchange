// infers schema from interjevko
export const interjevkoToSchema = (jevko) => {
  const {subjevkos, suffix} = jevko

  const trimmed = suffix.trim()
  if (subjevkos.length === 0) {
    // todo: perhaps only untrimmed are ok, otherwise it's a string
    if (['true', 'false'].includes(trimmed)) return {type: 'boolean'}
    // note: converting empty suffix to null for now; later perhaps might be sensible to introduce the 'empty' type instead
    if (trimmed === 'null' || suffix === '') return {type: 'null'}

    if (trimmed === 'NaN') return {type: 'float64'}
    const num = Number(trimmed)
    if (Number.isNaN(num)) return {type: 'string'}
    return {type: 'float64'}
  }
  
  if (trimmed !== '') throw Error('suffix must be blank')

  const {prefix} = subjevkos[0]
  if (prefix.trim() === '') {
    // tuple/array
    const itemSchemas = []
    for (const {prefix, jevko} of subjevkos) {
      if (prefix.trim() !== '') throw Error('bad tuple/array')
      itemSchemas.push(interjevkoToSchema(jevko))
    }
    return {type: 'tuple', itemSchemas}
  }

  const props = Object.create(null)
  for (const {prefix, jevko} of subjevkos) {
    // todo: handle verbatim keys
    // todo: handle empty keys
    const key = prefix.trim()
    if (key in props) throw Error(`duplicate key (${key})`)
    props[key] = interjevkoToSchema(jevko)
  }
  return {type: 'object', props}
}