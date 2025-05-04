export class User {
  constructor(
    public firstName: string, 
    public lastName: string, 
    public email: string,
    public password: string,
    public role: 'restaurant' | 'customer' | 'admin',
    public restaurantName?: string, 
    public address?: string, 
    public phone?: string, 
    public pricePerPerson?: number, 
    public status?: 'in validation' | 'valid', 
  ) {}
}