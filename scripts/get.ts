import { MissingParamError, NotFoundError } from "../errors/errorHandler.js"
import { getCollection } from "../utils/getCollection.js"
export interface GetDataOptions {
    where?: any,
    limit?: number
}
export interface GetDataProps extends GetDataOptions {
    collection: string
}

/**
 * ### get()
 * An asyncronous json-base api to get data from database.json
 *  
 * @param params.collection A collection to get data from 
 * @param params.where  A where clause like SQL's WHERE , (optional)
 * @param params.limit A Limit of record to retreive , (optional)
 * @example
 * ```
 * import { get } from 'json-base'
 * (async function(){
 *      const aUsersWithId2  =  await get({
 *              collection : "users",
 *              where : {
 *                    id : 2
 *                  },
 *              limit :  1
 *          })
 * }())
 * ```
 */
export async function get(params: GetDataProps): Promise<any> {
    let data_to_return: any;
    if (!params.collection) {
        throw new MissingParamError("collection")
    }
    const collection = await getCollection(params.collection)
    data_to_return = collection
    if (params.where) {
        const where_data = Object.entries(params.where)
        for (let i: number = 0; i < where_data.length; i++) {
            const data: any = data_to_return.filter((collection: any) => collection[`${where_data[i][0]}`] == `${where_data[i][1]}`)
            if (data)
                data_to_return = data
            else
                throw new NotFoundError(`Datum with '${where_data[i][0]}' set to '${where_data[i][1]}' was not found in '${params.collection}' Collection`)
        }
    }
    if (params.limit) {
        
        if (data_to_return && data_to_return.length != 1)
            data_to_return = (data_to_return as any[]).slice(0, params.limit)
    }

    return data_to_return
}