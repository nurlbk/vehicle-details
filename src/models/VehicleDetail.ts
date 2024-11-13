export type VehicleDetail = {
    ordId: number;
    name: string;
    unitPrice: number;
    quantity: number
    parent: VehicleDetail | null;
    childs: VehicleDetail[] | null;
    level: number;
}