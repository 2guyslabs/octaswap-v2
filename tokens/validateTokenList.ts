import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { schema } from '@uniswap/token-lists'
import { buildTokenList } from './buildTokenList'

async function validateTokenList() {
  const buildedTokenList = buildTokenList()

  const ajv = new Ajv({ allErrors: true, verbose: true })
  addFormats(ajv)

  const validator = ajv.compile(schema)
  const validate = validator(buildedTokenList)

  if (validate) {
    await Bun.write(
      'tokens/tokenList.json',
      JSON.stringify(buildedTokenList, null, 2)
    )
  }

  if (validator.errors) {
    throw validator.errors.map((error) => {
      delete error.data
      return error
    })
  }
}

validateTokenList()
  .then(() => console.log('Token list is valid and written to file.'))
  .catch(console.error)
