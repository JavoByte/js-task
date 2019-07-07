import Model from './Model';

class Bid extends Model {
  static attributes = [
    'merchant_id',
    'amount',
    'car_title',
  ];

  static casts = {
    amount: 'number',
  };
}

export default Bid;
