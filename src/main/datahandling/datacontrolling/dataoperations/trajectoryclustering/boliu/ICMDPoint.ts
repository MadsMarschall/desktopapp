export default interface ICMDPoint {
  m_nDimensions: number;
  m_coordinate: number[];

  /**
   * return the coordinate according to the dimension 'nth'
   * @param nth #dimension
   * @return
   */
  getM_coordinate(nth: number): number;

  getM_nDimensions(): any;

  /**
   * set the coordinate according to the dimension
   * @param nth dimension
   * @param value value
   */
  setM_coordinate(nth: number, value: number): void;
}
