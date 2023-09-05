import { ProductQueryParams } from '@/Models/Models'
import {
  ClientResponse,
  ProductProjectionPagedQueryResponse,
} from '@commercetools/platform-sdk'
import { apiRoot } from '../../eComMerchant/client'

const getProducts = (
  props: ProductQueryParams,
): Promise<ClientResponse<ProductProjectionPagedQueryResponse>> =>
  !props.filter || props.filter === `categories.id:"undefined"`
    ? apiRoot
        .productProjections()
        .get({ queryArgs: { limit: props.limit, offset: props.offset } })
        .execute()
        .then((body) => body)
    : apiRoot
        .productProjections()
        .search()
        .get({
          queryArgs: {
            limit: props.limit,
            offset: props.offset,
            filter: props.filter,
          },
        })
        .execute()
        .then((body) => body)

export default getProducts
