import Common from '../common'

export default class Facet {
    static get all() {
        try {
            return Common.facetService.results
        } catch (e) {
            console.error(e)
            return [];
        }
    }
}