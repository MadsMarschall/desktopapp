import { IDataPointMovement } from '../../../../../../shared/domain/Interfaces';
import ICMDPoint from './ICMDPoint';


export default class CMDPoint implements ICMDPoint, IDataPointMovement {
  public PersonId: number= -1;
  public X: number = -1;
  public Y: number = -1;
  public affectedRows: number = -1;
  public id: string = "";
  public timestamp: Date = new Date();
  public type: string = "";

  m_nDimensions: number; 	// the number of dimensions of a point
  m_coordinate: number[] = new Array();	    // the coordinate of a point

	//default constructor which shall be never used, we can use the following constructor instead


	public constructor(nDimensions?: number, dataPointFromSQL?: IDataPointMovement) {
    if(dataPointFromSQL) {
      this.PersonId = dataPointFromSQL.PersonId;
      this.X = dataPointFromSQL.X;
      this.Y = dataPointFromSQL.Y;
      this.affectedRows = dataPointFromSQL.affectedRows;
      this.id = dataPointFromSQL.id;
      this.timestamp = dataPointFromSQL.timestamp;
      this.type = dataPointFromSQL.type;
      this.m_coordinate[0] = dataPointFromSQL.X;
      this.m_coordinate[1] = dataPointFromSQL.Y;
    }
		if(!nDimensions) {
			this.m_nDimensions = 2;
			this.m_coordinate.length = this.m_nDimensions;
			this.m_coordinate[0] = 0;
			this.m_coordinate[1] = 0;
		}
		this.m_nDimensions = nDimensions || 2;
		this.m_coordinate.length = this.m_nDimensions;
		for( let i=0; i < this.m_nDimensions; i++ ) {
			this.m_coordinate[i] = 0.0;
		}
	}

  /**
   * return the coordinate according to the dimension 'nth'
   * @param nth #dimension
   * @return
   */
  getM_coordinate(nth: number): number {

    return this.m_coordinate[nth];
  }

  getM_nDimensions() {
    return this.m_nDimensions;
  }

  /**
   * set the coordinate according to the dimension
   * @param nth dimension
   * @param value value
   */
  setM_coordinate(nth: number, value: number): void {
    this.m_coordinate[nth] = value;
  }




}
