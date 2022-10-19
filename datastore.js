import { Datastore } from '@google-cloud/datastore';

const _Datastore = Datastore;
export { _Datastore as Datastore };
export const datastore = new Datastore();
export function fromDatastore(item){
    item.id = item[Datastore.KEY].id;
    return item;
}