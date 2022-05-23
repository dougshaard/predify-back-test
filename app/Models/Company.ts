import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Provider from './Provider'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uf: number

  @column()
  public name: string

  @column()
  public cnpj: string

  @hasMany(() => Provider)
  public providers: HasMany<typeof Provider>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime
}
