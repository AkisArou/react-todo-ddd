import {ITodoCacheModel} from "../model/ITodoCacheModel";
import {BooleanNumberConverter} from "../../../util/BooleanNumberConverter";
import {IMapper} from "../../../../abstraction/data/IMapper";
import {TodoEntity, TodoEntityFactory} from "../../../../domain/todo/entity/TodoEntity/TodoEntity";

export interface ITodoEntityMapper extends IMapper<ITodoCacheModel[], TodoEntity[]> {
}

export class TodoEntityMapper implements ITodoEntityMapper {
  mapFrom(from: ITodoCacheModel[]): TodoEntity[] {
    return from.map(tcm =>
      TodoEntityFactory.create(
        tcm.id,
        tcm.name,
        BooleanNumberConverter.fromNumberToBoolean(tcm.done),
      ));
  }

  mapTo(from: TodoEntity[]): ITodoCacheModel[] {
    return from.map(te => ({
      id: te.id,
      name: te.name.value.getOrCrash(),
      done: BooleanNumberConverter.fromBooleanToNumber(te.done)
    }));
  }
}
