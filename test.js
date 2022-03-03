import {parseJevko, sjevkoToSchema} from './devDeps.js'

import {jevkoBySchemaToValue} from './jevkoBySchemaToValue.js'
import { jevkoToHtml } from './jevkoToHtml.js'

// todo: fix

const jevkoStr = `
first name [John]
last name [Smith]
is alive [true]
age [27]
address [
  street address [21 2nd Street]
  city [New York]
  state [NY]
  postal code [10021-3100]
]
phone numbers [
  [
    type [home]
    number [212 555-1234]
  ]
  [
    type [office]
    number [646 555-4567]
  ]
]
children []
spouse [null]
`

const schemaStr = `
first name [string]
last name [string]
is alive [boolean]
age [float64]
address [
  street address [string]
  city [string]
  state [string]
  postal code [string]
object]
phone numbers [[
  type [string]
  number [string]
object]array]
children [[string]array]
spouse [[null][string]first match]
object
`

const expectedSchema = {
  type: 'object',
  props: { 
    "first name": {type: "string"},
    "last name": {type: "string"},
    "is alive": {type: "boolean"},
    "age": {type: "float64"},
    "address": {
      type: "object",
      props: {
        "street address": {type: "string"},
        "city": {type: "string"},
        "state": {type: "string"},
        "postal code": {type: "string"}
      },
    },
    "phone numbers": {
      type: "array",
      itemSchema: {
        type: "object",
        props: {
          "type": {type: "string"},
          "number": {type: "string"}
        },
      }
    },
    "children": {type: "string"},
    "spouse": {type: "first match", alternatives: [{type: "null"}, {type: "string"}]}
  }
}

const expectedObject = {
  "first name": "John",
  "last name": "Smith",
  "is alive": "true",
  age: "27",
  address: {
    "street address": "21 2nd Street",
    city: "New York",
    state: "NY",
    "postal code": "10021-3100"
  },
  "phone numbers": [
    { type: "home", number: "212 555-1234" },
    { type: "office", number: "646 555-4567" }
  ],
  children: "",
  spouse: ""
}

const parsedJevko = parseJevko(jevkoStr)

console.log(jevkoBySchemaToValue(parsedJevko, expectedSchema))

const schema = sjevkoToSchema(parseJevko(schemaStr))

console.log(jevkoBySchemaToValue(parsedJevko, schema))

console.log(jevkoToHtml(parsedJevko, schema))