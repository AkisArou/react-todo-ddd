export interface IMapper<F, T> {
    mapFrom(from: F): T;
    mapTo(from: T): F;
}
