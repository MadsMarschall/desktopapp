import CreatePersonTrajectories, { IRideDetails } from '../../datapreprocess/createPersonTrajectories';
import { IDataPointMovement } from '../../shared/domain/Interfaces';


let createPersonTrajectories: CreatePersonTrajectories;
beforeEach(() => {
  createPersonTrajectories = new CreatePersonTrajectories();
});

test('create trajectory an transfer to callback', async () => {
  const dataStub: IDataPointMovement[] = [
    {
      timestamp: new Date(),
      PersonId: 1,
      type: 'check-in',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: ''
    },
    {
      timestamp: new Date(),
      PersonId: 1,
      type: 'check-in',
      X: 2,
      Y: 2,
      affectedRows: 0,
      id: ''
    },
    {
      timestamp: new Date(),
      PersonId: 2,
      type: 'check-in',
      X: 3,
      Y: 3,
      affectedRows: 0,
      id: ''
    },
    {
      timestamp: new Date(),
      PersonId: 2,
      type: 'check-in',
      X: 4,
      Y: 4,
      affectedRows: 0,
      id: ''
    },
    {
      timestamp: new Date(),
      PersonId: 3,
      type: 'check-in',
      X: 5,
      Y: 5,
      affectedRows: 0,
      id: ''
    }

  ];
  const trajectories: Array<IDataPointMovement[]> = [];
  await createPersonTrajectories.findAndRunTroughTrajectories(dataStub, (data: IDataPointMovement[]) => {
    trajectories.push(data);
  });
  expect(trajectories.length).toBe(3);
  expect(trajectories[0].length).toBe(2);
  expect(trajectories[1].length).toBe(2);
  expect(trajectories[2].length).toBe(1);
});

test('should add if type check-in', async () => {
  const DISTANCE_THRESHHOLD = 5;
  const TIME_THRESHHOLD = 1000 * 60 * 5;
  const unformattedTrajecotry: IDataPointMovement[] = [
    {
      timestamp: new Date(),
      PersonId: 1,
      type: 'check-in',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: ''
    },
    {
      timestamp: new Date(),
      PersonId: 1,
      type: 'movement',
      X: 10,
      Y: 10,
      affectedRows: 0,
      id: ''
    },
    {
      timestamp: new Date((new Date()).getTime() + TIME_THRESHHOLD),
      PersonId: 1,
      type: 'movement',
      X: 11,
      Y: 11,
      affectedRows: 0,
      id: ''
    },
    {
      timestamp: new Date((new Date()).getTime() + TIME_THRESHHOLD * 2),
      PersonId: 1,
      type: 'movement',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: ''
    }
  ];
  const result = await createPersonTrajectories.determineCheckinsFromTrajectory(unformattedTrajecotry, [], TIME_THRESHHOLD, DISTANCE_THRESHHOLD);
  expect(result[0].type).toBe('check-in');
});

test('should find checkin if time is over treshhold', async () => {
  const DISTANCE_THRESHHOLD = 5;
  const TIME_THRESHHOLD = 1000 * 60 * 5;
  const time = new Date();
  const rideDetails: IRideDetails = {
    X: 9, Y: 9, dinofunWorldName: '', parkguide: 0, realWorldType: '', type: ''
  };

  const unformattedTrajecotry: IDataPointMovement[] = [
    {
      timestamp: time,
      PersonId: 1,
      type: 'check-in',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '1'
    },
    {
      timestamp: time,
      PersonId: 1,
      type: 'movement',
      X: 10,
      Y: 10,
      affectedRows: 0,
      id: '2'
    },
    {
      timestamp: new Date(time.getTime() + TIME_THRESHHOLD + 1),
      PersonId: 1,
      type: 'movement',
      X: 11,
      Y: 11,
      affectedRows: 0,
      id: '3'
    },
    {
      timestamp: new Date(time.getTime() + TIME_THRESHHOLD * 2),
      PersonId: 1,
      type: 'movement',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '4'
    }
  ];
  const result = await createPersonTrajectories.determineCheckinsFromTrajectory(unformattedTrajecotry, [rideDetails], TIME_THRESHHOLD, DISTANCE_THRESHHOLD);
  expect(result.length).toBe(1);
  expect(result[0].type).toBe('check-in');
});

test('should should not checkin if not over treshholde', async () => {
  const DISTANCE_THRESHHOLD = 5;
  const TIME_THRESHHOLD = 1000 * 60 * 5;
  const time = new Date();
  const rideDetails: IRideDetails = {
    X: 9, Y: 9, dinofunWorldName: '', parkguide: 0, realWorldType: '', type: ''
  };

  const unformattedTrajecotry: IDataPointMovement[] = [
    {
      timestamp: time,
      PersonId: 1,
      type: 'check-in',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '1'
    },
    {
      timestamp: time,
      PersonId: 1,
      type: 'movement',
      X: 10,
      Y: 10,
      affectedRows: 0,
      id: '2'
    },
    {
      timestamp: new Date(time.getTime() + TIME_THRESHHOLD - 2),
      PersonId: 1,
      type: 'movement',
      X: 11,
      Y: 11,
      affectedRows: 0,
      id: '3'
    },
    {
      timestamp: new Date(time.getTime() + TIME_THRESHHOLD - 1),
      PersonId: 1,
      type: 'movement',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '4'
    }
  ];
  const result = await createPersonTrajectories.determineCheckinsFromTrajectory(unformattedTrajecotry, [rideDetails], TIME_THRESHHOLD, DISTANCE_THRESHHOLD);
  expect(result.length).toBe(1);
  expect(result[0].type).toBe('check-in');
});

test('should should not checkin if not within distance', async () => {
  const DISTANCE_THRESHHOLD = 0.5;
  const TIME_THRESHHOLD = 1000 * 60 * 5;
  const time = new Date();
  const rideDetails: IRideDetails[] = [{
    X: 9, Y: 9, dinofunWorldName: '', parkguide: 0, realWorldType: '', type: ''
  },
    {
      X: 50, Y: 50, dinofunWorldName: '', parkguide: 0, realWorldType: '', type: ''
    }
  ];

  const unformattedTrajecotry: IDataPointMovement[] = [
    {
      timestamp: time,
      PersonId: 1,
      type: 'check-in',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '1'
    },
    {
      timestamp: time,
      PersonId: 1,
      type: 'movement',
      X: 10,
      Y: 10,
      affectedRows: 0,
      id: '2'
    },
    {
      timestamp: new Date(time.getTime() + TIME_THRESHHOLD + 1),
      PersonId: 1,
      type: 'movement',
      X: 11,
      Y: 11,
      affectedRows: 0,
      id: '3'
    },
    {
      timestamp: new Date(time.getTime() + TIME_THRESHHOLD * 2),
      PersonId: 1,
      type: 'movement',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '4'
    }
  ];
  const result = await createPersonTrajectories.determineCheckinsFromTrajectory(unformattedTrajecotry, rideDetails, TIME_THRESHHOLD, DISTANCE_THRESHHOLD);
  expect(result.length).toBe(1);
  expect(result[0].type).toBe('check-in');
});

test('should simplify datapoints to interval', () => {
  const TIME_THRESHHOLD = 1000 * 60 * 5;
  const time = new Date();

  const trajectory: IDataPointMovement[] = [
    {
      timestamp: time,
      PersonId: 1,
      type: 'check-in',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '1'
    },
    {
      timestamp: time,
      PersonId: 1,
      type: 'movement',
      X: 10,
      Y: 10,
      affectedRows: 0,
      id: '2'
    },
    {
      timestamp: new Date(time.getTime() + TIME_THRESHHOLD + 1),
      PersonId: 1,
      type: 'movement',
      X: 11,
      Y: 11,
      affectedRows: 0,
      id: '3'
    },
    {
      timestamp: new Date(time.getTime() + TIME_THRESHHOLD * 2 + 2),
      PersonId: 1,
      type: 'movement',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '4'
    },
    {
      timestamp: new Date(time.getTime() + (TIME_THRESHHOLD * 3) + 3),
      PersonId: 1,
      type: 'movement',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '5'
    }
  ];
  const result = createPersonTrajectories.simplifyToTimeInterval(trajectory, TIME_THRESHHOLD);
  expect(result.length).toBe(4);
  expect(result[0].id).toBe('1');
  expect(result[1].id).toBe('3');
});

test('should simplify datapoints to interval', () => {
  const TIME_THRESHHOLD = 1000 * 60 * 5;
  const time = new Date();

  const trajectory: IDataPointMovement[] = [
    {
      timestamp: time,
      PersonId: 1,
      type: 'check-in',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '1'
    },
    {
      timestamp: time,
      PersonId: 1,
      type: 'movement',
      X: 10,
      Y: 10,
      affectedRows: 0,
      id: '2'
    },
    {
      timestamp: new Date(time.getTime() + TIME_THRESHHOLD + 1),
      PersonId: 1,
      type: 'movement',
      X: 11,
      Y: 11,
      affectedRows: 0,
      id: '3'
    },
    {
      timestamp: new Date(time.getTime() + TIME_THRESHHOLD * 2 + 2),
      PersonId: 1,
      type: 'movement',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '4'
    },
    {
      timestamp: new Date(time.getTime() + (TIME_THRESHHOLD * 3) + 3),
      PersonId: 1,
      type: 'movement',
      X: 1,
      Y: 1,
      affectedRows: 0,
      id: '5'
    }
  ];
  const result = createPersonTrajectories.simplifyToTimeInterval(trajectory, TIME_THRESHHOLD);

  expect(result.length).toBeGreaterThan(20);
  expect(result[result.length-3].id).toBe('1');
  expect(result[result.length-2].id).toBe('3');
  expect(result[result.length-1].id).toBe('4');
  expect((new Date(result[result.length-1].timestamp)).getSeconds()).toBe(0);
  expect((new Date(result[result.length-1].timestamp)).getMinutes()%5).toBe(0);
})
