export class Order {
  constructor(
    public restaurantId: string, 
    public customerId: string, 
    public amount: number, 
    public status: 'Pending' | 'Paid' | 'Cancelled', 
    public dishes: string[], 
    public date?: Date, 
  ) {}
}