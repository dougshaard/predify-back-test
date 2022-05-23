import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'

export default class CompaniesController {
  public async create({ response, request }: HttpContextContract) {
    const createdCompany = await Company.create(request.all())
    return response.created(createdCompany)
  }
}
