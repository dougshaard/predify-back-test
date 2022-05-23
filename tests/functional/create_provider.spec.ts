import { test } from '@japa/runner'
import { CompanyFactory, ProviderFactory, ProviderWhitRgFactory } from 'Database/factories'

test('it should create a provider with phone string', async ({ client, assert }) => {
  const empresa = await CompanyFactory.create()
  const provider = await ProviderFactory.make()
  const response = await client.post(`/create/${empresa.id}/provider`).json({
    name: provider.name,
    cnpj: provider.cnpj,
    phones: "['119999999999', '119999999998', '119999999997', '119999999991']",
  })
  assert.equal(response.status(), 201)
})

test('it should create a provider with phone array in object', async ({ client, assert }) => {
  const empresa = await CompanyFactory.create()
  const provider = await ProviderFactory.make()
  const response = await client.post(`/create/${empresa.id}/provider`).json({
    name: provider.name,
    cnpj: provider.cnpj,
    phones: ['119999999999', '119999999998', '119999999997', '119999999991'],
  })
  assert.equal(response.status(), 201)
})

test('it should create a provider without phone', async ({ client, assert }) => {
  const empresa = await CompanyFactory.create()
  const provider = await ProviderFactory.make()
  const response = await client.post(`/create/${empresa.id}/provider`).json({
    name: provider.name,
    cnpj: provider.cnpj,
  })
  assert.equal(response.status(), 201)
})

test('it should create a provider with CPF >= 18', async ({ client, assert }) => {
  const empresa = await CompanyFactory.merge({ uf: 35 }).create()
  const provider = await ProviderWhitRgFactory.make()
  const response = await client.post(`/create/${empresa.id}/provider`).json({
    name: provider.name,
    rg: provider.rg,
    cpf: provider.cpf,
    cnpj: provider.cnpj,
    birth: new Date('1997-03-01'),
  })
  assert.equal(response.status(), 201)
})

test('it should create a provider with CPF < 18', async ({ client, assert }) => {
  const empresa = await CompanyFactory.merge({ uf: 35 }).create()
  const provider = await ProviderWhitRgFactory.make()
  const response = await client.post(`/create/${empresa.id}/provider`).json({
    name: provider.name,
    rg: provider.rg,
    cpf: provider.cpf,
    cnpj: provider.cnpj,
    birth: new Date('2015-03-01'),
  })
  assert.equal(response.status(), 403)
})

test('it should create a provider with CPF without rg', async ({ client, assert }) => {
  const empresa = await CompanyFactory.merge({ uf: 35 }).create()
  const provider = await ProviderWhitRgFactory.make()
  const response = await client.post(`/create/${empresa.id}/provider`).json({
    name: provider.name,
    cpf: provider.cpf,
    cnpj: provider.cnpj,
    birth: new Date('1997-03-01'),
  })
  assert.equal(response.status(), 422)
})

test('it should create a provider with CPF without birth', async ({ client, assert }) => {
  const empresa = await CompanyFactory.merge({ uf: 35 }).create()
  const provider = await ProviderWhitRgFactory.make()
  const response = await client.post(`/create/${empresa.id}/provider`).json({
    name: provider.name,
    rg: provider.rg,
    cpf: provider.cpf,
    cnpj: provider.cnpj,
  })
  assert.equal(response.status(), 422)
})

test('it should create a provider with CPF without rg and birth', async ({ client, assert }) => {
  const empresa = await CompanyFactory.merge({ uf: 35 }).create()
  const provider = await ProviderWhitRgFactory.make()
  const response = await client.post(`/create/${empresa.id}/provider`).json({
    name: provider.name,
    cpf: provider.cpf,
    cnpj: provider.cnpj,
  })
  assert.equal(response.status(), 422)
})

test('it should get a provider by name', async ({ client, assert }) => {
  const empresa = await CompanyFactory.with('providers', 50).create()
  const response = await client.get(`/company/${empresa.id}/provider/filters`).qs({
    name: empresa.providers[0].name,
  })
  assert.equal(response.status(), 200)
  assert.isArray(response.body())
  assert.notEmpty(response.body())
})

test('it should get a provider by create date', async ({ client, assert }) => {
  const empresa = await CompanyFactory.with('providers', 50).create()
  const response = await client.get(`/company/${empresa.id}/provider/filters`).qs({
    date: empresa.providers[0].createdAt.toISODate(),
  })
  assert.equal(response.status(), 200)
  assert.isArray(response.body())
  assert.notEmpty(response.body())
})

test('it should get a provider by cpf', async ({ client, assert }) => {
  const empresa = await CompanyFactory.with('providers', 50).create()
  const response = await client.get(`/company/${empresa.id}/provider/filters`).qs({
    cpf: empresa.providers[0].cpf,
  })
  assert.equal(response.status(), 200)
  assert.isArray(response.body())
  assert.notEmpty(response.body())
})

test('it should get a provider by cnpj', async ({ client, assert }) => {
  const empresa = await CompanyFactory.with('providers', 50).create()
  const response = await client.get(`/company/${empresa.id}/provider/filters`).qs({
    cnpj: empresa.providers[0].cnpj,
  })
  assert.equal(response.status(), 200)
  assert.isArray(response.body())
  assert.notEmpty(response.body())
})
