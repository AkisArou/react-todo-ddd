export interface IUseCase<P, R> {
    execute(params: P): R;
}
