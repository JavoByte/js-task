import Model from './Model';

class Merchant extends Model {
  static attributes = [
    'first_name',
    'last_name',
    'email',
    'avatar',
    'avatar_url',
    'phone',
    'has_premium',
  ];

  static casts = {
    has_premium: 'boolean',
  }

  get fullName() {
    return `${this.first_name} ${this.last_name}`;
  }
}

export default Merchant;
