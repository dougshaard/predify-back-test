import { test } from '@japa/runner'

test('it should create a company', async ({ client, assert }) => {
  const empresa = await import('Database/factories').then((m) => m.CompanyFactory.make())
  const response = await client.post('/create/company').json({
    name: empresa.name,
    uf: empresa.uf,
    cnpj: empresa.cnpj,
  })

  response.assertStatus(201)
  assert.exists(response.body().id, 'Id is undefined')
})
