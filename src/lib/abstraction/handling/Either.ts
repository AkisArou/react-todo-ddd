export class Either<L, R> {
    constructor(
        private readonly error: L,
        private readonly value: R) {
    }

    fold<B>(onSuccess: (value: R) => B, onFailure: (err: L) => B): B {
        return this instanceof Left
            ? onFailure(this.error)
            : onSuccess(this.value);
    }

    getOrCrash(): R {
        if(this instanceof Right)
            return this.value;
        else
            throw new Error();
    }

    getOrElse(elseFn: () => R): R {
        return this instanceof Left ? this.value : elseFn();
    }

    isLeft() {
        return this instanceof Left;
    }

    isRight() {
        return this instanceof Right;
    }
}
class Left<L, R> extends Either<L, unknown> {
    constructor(error: L) {
        super(error, null);
    }
}
class Right<L, R> extends Either<L, R> {
    constructor(value: R) {
        super(null as unknown as L, value);
    }
}
export function left<L, R> (x: L): Either<L, R> {
    return new Left(x) as Either<L, R>;
}
export function right<L, R> (x: R): Either<L, R> {
    return new Right(x) as Either<L, R>;
}

