import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Company from 'App/Models/Company'
import Provider from 'App/Models/Provider'
import { differenceInYears } from 'date-fns'

interface Pessoa {
  phones: string
  cpf: string
  name: string
  rg: string
  birth: string
  cnpj: string
}

export default class ProvidersController {
  public async create({ response, request }: HttpContextContract) {
    const { phones, birth, cnpj, name, rg, cpf } = request.only([
      'phones',
      'name',
      'birth',
      'rg',
      'cnpj',
      'cpf',
    ])
    const companyId = request.param('id')
    const findBy = await Company.findByOrFail('id', companyId)

    if (await this.hasCPF(cpf, rg, birth)) throw new BadRequestException('Dados incompletos', 422)

    if (!(await this.spAntiMinor(findBy.uf, { phones, cpf, rg, name, birth, cnpj })))
      throw new BadRequestException('Fornecedor menor de idade!', 403)

    const createdByRelation = await findBy.related('providers').create(request.all())
    if (phones && typeof phones === 'string') {
      JSON.parse(phones).forEach(async (element) => {
        await createdByRelation.related('phones').create({ phoneNumber: element })
      })
      const findProvider = await Database.query()
        .from('phones')
        .select('phone_number')
        .where('provider_id', createdByRelation.id)
      return response.created({ fornecedor: createdByRelation, telefones: findProvider })
    } else if (phones && typeof phones === 'object') {
      phones.forEach(async (element) => {
        await createdByRelation.related('phones').create({ phoneNumber: element })
      })
      const findProvider = await Database.query()
        .from('phones')
        .select('phone_number')
        .where('provider_id', createdByRelation.id)
      return response.created({ fornecedor: createdByRelation, telefones: findProvider })
    }
    return response.created(createdByRelation)
  }

  public async getProvider({ response, request }: HttpContextContract) {
    const companyId = request.param('id')
    const query = request.qs()
    if (query.name) {
      return response.ok(await this.orderByName(companyId, query.name))
    } else if (query.date) {
      return response.ok(await this.orderByDate(companyId, query.date))
    } else if (query.cnpj || query.cpf) {
      response.ok(await this.orderByCpfOrCnpj(companyId, query))
    } else throw new BadRequestException('Sem dados para procurar', 404)
  }

  private async spAntiMinor(uf: number, provider: Pessoa) {
    if (uf === 35 && provider.cpf) {
      const thisDate = new Date(provider.birth)
      const plusdate = new Date(Date.now())
      if (differenceInYears(plusdate, thisDate) >= 18) return true
      return false
    } else {
      return true
    }
  }

  private async hasCPF(cpf: string, rg: string, birth: Date) {
    if (cpf) {
      if (rg && birth) return false
      return true
    } else if (cpf && !rg) return true
    else if (cpf && !birth) return true
    else return false
  }

  private async orderByDate(companyId: number, date: string) {
    const findByDate = await Provider.query()
      .select('*')
      .where('company_id', companyId)
      .andWhere('created_at', 'LIKE', '%' + date + '%')
    return findByDate
  }

  private async orderByName(companyId: number, name: string) {
    const findByName = await Provider.query()
      .select('*')
      .where('company_id', companyId)
      .andWhere('name', 'LIKE', '%' + name + '%')
    return findByName
  }

  private async orderByCpfOrCnpj(companyId: number, dado) {
    if (dado.cpf) {
      const findByCpf = await Provider.query()
        .select('*')
        .where('company_id', companyId)
        .andWhere('cpf', dado.cpf)
      return findByCpf
    } else if (dado.cnpj) {
      const findByCnpj = await Provider.query()
        .select('*')
        .where('company_id', companyId)
        .andWhere('cnpj', dado.cnpj)
      return findByCnpj
    }
  }
}
