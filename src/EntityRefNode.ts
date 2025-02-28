import {AnyRefList} from "./AnyRefList";
import {AnyRef} from "./AnyRef";
import {EntityRefList} from "./EntityRefList";

export type EntityRefNode = AnyRef | AnyRefList;

export type EntityRefNodeOfRef<T extends AnyRef> = T | EntityRefList<T>;
