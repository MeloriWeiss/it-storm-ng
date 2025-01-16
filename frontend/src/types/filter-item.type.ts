import {CategoriesType} from "./categories.type";

export type FilterItemType = {
  id: string,
  name: string,
  url: CategoriesType,
  active?: boolean
}
