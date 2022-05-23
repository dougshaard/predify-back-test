import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Phone from './Phone'

export default class Provider extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public companyId: number

  @hasMany(() => Phone)
  public phones: HasMany<typeof Phone>

  @column()
  public name: string

  @column()
  public cpf: string

  @column()
  public cnpj: string

  @column()
  public rg: string

  @column()
  public birth: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
