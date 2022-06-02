// eslint-disable-next-line import/prefer-default-export
export const MovementDataQuieries = {
  INSERT: {
    test: `INSERT testdata (timestamp, PersonId, type, X,Y, Id) VALUES (STR_TO_DATE( ? ,'%Y-%m-%d %H:%i:%s'), ? , ? , ? , ? , uuid());`,
    friday: `INSERT parkmovementfri (timestamp, PersonId, type, X,Y, Id) VALUES (STR_TO_DATE( ? ,'%Y-%m-%d %H:%i:%s'), ? , ? , ? , ? , uuid());`,
    saturday: `INSERT parkmovementsat (timestamp, PersonId, type, X,Y, Id) VALUES (STR_TO_DATE( ? ,'%Y-%m-%d %H:%i:%s'), ? , ? , ? , ? , uuid());`,
    sunday: `INSERT parkmovementsun (timestamp, PersonId, type, X,Y, Id) VALUES (STR_TO_DATE( ? ,'%Y-%m-%d %H:%i:%s'), ? , ? , ? , ? , uuid());`,
  },
  GET_ALL: {
    friday: 'SELECT * FROM dataprovenance.parkmovementfri',
    saturday: 'SELECT * FROM dataprovenance.parkmovementsat',
    sunday: 'SELECT * FROM dataprovenance.parkmovementsun',
    test: 'SELECT * FROM testdata',
  },
  GET_BY_PERSON_ID: {
    friday:
      'SELECT * FROM parkmovementfri use index (idx_parkmovementfri_PersonId) where PersonId= ? order by timestamp',
    saturday:
      'SELECT * FROM parkmovementsat use index (idx_parkmovementsat_PersonId) where PersonId= ? order by timestamp',
    sunday:
      'SELECT * FROM parkmovementsun use index (idx_parkmovementsun_PersonId) where PersonId= ? order by timestamp',
    test: 'SELECT * FROM testdata where PersonId= ? order by timestamp',
  },
};
