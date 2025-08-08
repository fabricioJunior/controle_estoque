export class ItemDto {
    name: string;
    price: number;
    quantity: number;

    constructor(partial?: Partial<ItemDto>) {
        Object.assign(this, partial);
    }
}