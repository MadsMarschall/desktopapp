// eslint-disable-next-line import/prefer-default-export
export const MovementDataQuieries = {
  INSERT: {
    test: `INSERT testdata (timestamp, PersonId, type, X,Y, Id) VALUES (STR_TO_DATE( ? ,'%Y-%m-%d %H:%i:%s'), ? , ? , ? , ? , uuid());`,
    friday: `INSERT parkmovementfri (timestamp, PersonId, type, X,Y, Id) VALUES (STR_TO_DATE( ? ,'%Y-%m-%d %H:%i:%s'), ? , ? , ? , ? , uuid());`,
    saturday: `INSERT parkmovementsat (timestamp, PersonId, type, X,Y, Id) VALUES (STR_TO_DATE( ? ,'%Y-%m-%d %H:%i:%s'), ? , ? , ? , ? , uuid());`,
    sunday: `INSERT parkmovementsun (timestamp, PersonId, type, X,Y, Id) VALUES (STR_TO_DATE( ? ,'%Y-%m-%d %H:%i:%s'), ? , ? , ? , ? , uuid());`,
  },
  GET_ALL: {
    friday: 'SELECT * FROM parkmovementfri;',
    saturday: 'SELECT * FROM parkmovementsat;',
    sunday: 'SELECT * FROM parkmovementsun;',
    test: 'SELECT * FROM testdata;',
  },
  GET_BY_PERSON_ID: {
    friday:
      'SELECT * FROM parkmovementfri where PersonId= ? order by timestamp',
    saturday:
      'SELECT * FROM parkmovementsat where PersonId= ? order by timestamp',
    sunday:
      'SELECT * FROM parkmovementsun where PersonId= ? order by timestamp',
    test: 'SELECT * FROM testdata where PersonId= ? order by timestamp',
  },
};
