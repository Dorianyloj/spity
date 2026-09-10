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
  mediaUploads,
  partnershipRequests,
  placeChangeRequestPhotos,
  placeChangeRequests,
  placeCreationRequests,
  placePhotos,
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
    [placeCreationRequests, 'place_creation_requests'],
    [placeChangeRequests, 'place_change_requests'],
    [placeChangeRequestPhotos, 'place_change_request_photos'],
    [placePhotos, 'place_photos'],
    [voies, 'voies'],
    [placeReports, 'place_reports'],
    [posts, 'posts'],
    [medias, 'medias'],
    [mediaUploads, 'media_uploads'],
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
    expect(Object.keys(getTableColumns(placeCreationRequests))).toEqual(expect.arrayContaining([
      'authorId',
      'kind',
      'status',
      'photoMediaId',
      'city',
      'department',
      'region',
      'parkingLatitude',
      'parkingLongitude',
      'reviewedBy',
      'reviewReason',
    ]))
    expect(Object.keys(getTableColumns(placeChangeRequests))).toEqual(expect.arrayContaining(['authorId', 'salleId', 'falaiseId', 'values', 'status']))
    expect(Object.keys(getTableColumns(placeChangeRequestPhotos))).toEqual(expect.arrayContaining(['requestId', 'mediaId']))
    expect(Object.keys(getTableColumns(placePhotos))).toEqual(expect.arrayContaining(['salleId', 'falaiseId', 'mediaId']))
    expect(Object.keys(getTableColumns(falaises))).toEqual(expect.arrayContaining(['parkingLatitude', 'parkingLongitude', 'disciplines', 'orientations', 'rockType']))
    expect(Object.keys(getTableColumns(salles))).toEqual(expect.arrayContaining(['department', 'region', 'restrictions', 'sourceUrl', 'notes']))
  })
})
