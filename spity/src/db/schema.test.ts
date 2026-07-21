import { getTableColumns, getTableName } from 'drizzle-orm'
import {
  clubProfiles,
  comments,
  eventRegistrations,
  events,
  falaises,
  grimpeurProfiles,
  likes,
  medias,
  partnershipRequests,
  placeReports,
  posts,
  salles,
  userEquipment,
  users,
  voies,
} from './schema'

describe('database schema', () => {
  it.each([
    [users, 'users'],
    [grimpeurProfiles, 'grimpeur_profiles'],
    [userEquipment, 'user_equipment'],
    [clubProfiles, 'club_profiles'],
    [partnershipRequests, 'partnership_requests'],
    [salles, 'salles'],
    [falaises, 'falaises'],
    [voies, 'voies'],
    [placeReports, 'place_reports'],
    [posts, 'posts'],
    [medias, 'medias'],
    [comments, 'comments'],
    [likes, 'likes'],
    [events, 'events'],
    [eventRegistrations, 'event_registrations'],
  ])('declares the %s table as %s', (table, expectedName) => {
    expect(getTableName(table)).toBe(expectedName)
    expect(Object.keys(getTableColumns(table))).toContain('id')
  })

  it('exposes the foreign-key columns used by the core workflows', () => {
    expect(Object.keys(getTableColumns(partnershipRequests))).toEqual(expect.arrayContaining([
      'senderId',
      'recipientId',
      'status',
    ]))
    expect(Object.keys(getTableColumns(eventRegistrations))).toEqual(expect.arrayContaining([
      'eventId',
      'userId',
      'status',
    ]))
    expect(Object.keys(getTableColumns(voies))).toEqual(expect.arrayContaining(['falaiseId', 'cotation', 'status']))
  })
})
