const syncFetch = require('sync-fetch');

window.blendedSearch = {
    get vid() {
        return window.appConfig['vid'];
    },
    get blendKey() {
        let cloned_params = blendedSearch.set2.params;
        let key = `blend.${cloned_params['scope']}`;
        return key;
    },
    get hasBlendKey() {
        return blendedSearch.blendFilter && blendedSearch.blendFilter.length > 0;
    },
    get blendFilter() {
        
        let filter = '  ';

        if (filter != blendedSearch.blendKey &&
            filter != blendedSearch.blendKey.replace(/^blend\./, '').replaceAll('_', ' ') &&
            filter.length > 1) {
            return filter.split('|')
        }

        if (filter.length == 1) {
            return ['', '']; //TODO:FIx this
        }

        return [];
    },
    get allowed() {        
        let cloned_params = blendedSearch.set2.params;

        if (blendedSearch.hasBlendKey && cloned_params.tab !== 'jsearch_slot') {
            return true;
        }
        return false;
    },
    searchURL(url_set, url_path) {
        let esURL = new URL(`${window.location.origin}${url_path}`);

        Object.keys(url_set.params).forEach(key => {
            if (url_set.params[key] != undefined) {
                if (key == 'scope') {
                    esURL.searchParams.append(key, 'All_Content');
                } else {
                    esURL.searchParams.append(key, url_set.params[key])
                }
            }
        });
        
        return esURL;
    },    
    searchURL(url_set, url_path) {
        let esURL = new URL(`${window.location.origin}${url_path}`);

        Object.keys(url_set.params).forEach(key => {
            if (url_set.params[key] != undefined) {
                if (key == 'scope') {
                    esURL.searchParams.append(key, 'All_Content');
                } else {
                    esURL.searchParams.append(key, url_set.params[key])
                }
            }
        });
        
        return esURL;
    },    
    init: (reqRes) => {
        let self = this;        
        blendedSearch.set1.url = reqRes.url;
        blendedSearch.set1.headers = reqRes.headers;
        blendedSearch.set1.params = JSON.parse(JSON.stringify(reqRes.params));
        blendedSearch.set1.data = reqRes.data;

        let cloned_params = JSON.parse(JSON.stringify(reqRes.params));
        blendedSearch.set2.url = reqRes.url;
        blendedSearch.set2.headers = reqRes.headers;
        blendedSearch.set2.params = cloned_params;
        blendedSearch.set2.data = {};

        if (Object.keys(cloned_params).includes('scope')) {

            let facets = [];
            try {
                facets = blendedSearch.blendFilter;
            } catch (e) {
                console.log(`BLENDING: ${blendedSearch.vid} no extra facets defined.`)
            }

            if (facets && facets.length > 0) {
                if ('multiFacets' in cloned_params && cloned_params['multiFacets'].length > 0) {
                    cloned_params['multiFacets'] = `${cloned_params['multiFacets']}|,|${facets.join('|,|')}`;
                } else {
                    cloned_params['multiFacets'] = `${facets.join('|,|')}`;
                }
            }
        }
        cloned_params['pcAvailability'] = true;
        blendedSearch.set2.params = cloned_params;
    },
    set1: {
        url: '',
        headers: {},
        params: {},
        data: {},
        get score() {
            let s = 1;
            try {
                s = blendedSearch.set1.data.docs[0].pnx.control.score;
            } catch (error) {
                s = 1;
            }

            return s;
        },
        get limit() {
            let data = blendedSearch.limitOffset()
            return data[0];
        },
        get offset() {
            let data = blendedSearch.limitOffset()
            return data[1];
        }
    },
    set2: {
        url: '',
        headers: {},
        params: {},
        data: {},
        get score() {
            let s = 1;
            try {
                s = blendedSearch.set2.data.docs[0].rank;
            } catch (error) {
                s = 1;
            }

            return s;
        },
        search: () => {
            let result = {}
            blendedSearch.set2.data = {};
            let esURL = blendedSearch.searchURL(blendedSearch.set2, blendedSearch.set2.url);

            console.log(`BLENDING: ${esURL.href}`);
            console.log(`BLENDING: ${blendedSearch.allowed ? "ALLOWED" : "NOT ALLOWED"}`);
            //fetch result
            try {
                result = syncFetch(esURL, { method: 'GET', headers: blendedSearch.set2.headers }).json();
            } catch (e) {
                console.error(`BLENDING(ERROR): ${e.message}`)
                result = {};
            }
            blendedSearch.set2.data = result;

            return result;
        },
        get limit() {
            let data = blendedSearch.limitOffset()
            return data[2];
        },
        get offset() {
            let data = blendedSearch.limitOffset()
            return data[3];
        }
    },
    limitOffset() {
        let l1_fraction = parseFloat(Primo.bridge.translate.instant('blend.alma_fraction')) || 1.0;
        let l2_fraction = parseFloat(Primo.bridge.translate.instant('blend.lirias_fraction')) || 0.0;

        let t1 = 0;
        let l1 = Math.ceil(this.set1.params.limit * l1_fraction);
        let o1 = Math.ceil(this.set1.params.offset * l1_fraction);

        let t2 = 0;
        if (this.set2.data.info) {
            t2 = this.set2.data.info.total;
        }
        let l2 = Math.ceil(this.set1.params.limit * l2_fraction);
        let o2 = Math.ceil(this.set1.params.offset * l2_fraction);


        if ((l1 + l2) > this.set1.params.limit) {
            l2 = this.set1.params.limit - l1;
            if (l2 < 0) {
                l2 = 0;
            }
        }

        if ((t2 - o2) < l2) {
            l2 = t2 - o2
            l2 = l2 < 0 ? 0 : l2 //compensate for o2 > t2
        }

        if ((l1 + l2) < this.set1.params.limit) {
            l1 = this.set1.params.limit - l2;
        }

        if (this.set2.data.docs) {
            if (this.set2.data.docs.length < l2) {
                l2 = this.set2.data.docs.length;
            }
        }

        if (l2 == 0) {
            l1 = this.set1.params.limit;
            o1 = this.set1.params.offset;
            o2 = 0;
        }
        console.log(l1, o1, l2, o2);
        return [l1, o1, l2, o2];
    },
    mergeFacets(facets) {
        try {
            let facetMap = this.set2.data.facets.reduce((map, obj) => { map[obj['name']] = obj; return map }, {});
            facets.forEach((v, i, a) => {
                //merge into facet
                if (facetMap.hasOwnProperty(v['name'])) {
                    let mergedFacet = v['values'].concat(facetMap[v['name']]['values']).reduce((map, obj) => {
                        if (map.hasOwnProperty(obj['value'])) {
                            map[obj['value']] += obj['count'];
                        } else {
                            map[obj['value']] = parseInt(obj['count']);
                        }
                        return map;
                    }, {});

                    let p = [];
                    //transform into object
                    Object.keys(mergedFacet).forEach(k => p.push({ 'value': k, 'count': mergedFacet[k] }))

                    v['values'] = p;
                }
            });
        } catch (e) {
            console.log(`BLENDING: ${e.message}`);
        }

        return facets;
    },
    mergeDocs() {
        let docs = [];
        if (blendedSearch.set1.data.docs) {
            docs = docs.concat(blendedSearch.set1.data.docs.slice(0, blendedSearch.set1.limit));
        }
        if (blendedSearch.set2.data.docs) {
            docs = docs.concat(blendedSearch.set2.data.docs.slice(0, blendedSearch.set2.limit));
        }

        let rankSet1 = blendedSearch.set1.score;
        let rankSet2 = blendedSearch.set2.score;

        docs = docs.map(m => {
            if (m.hasOwnProperty('rank')) {
                m.pnx.control['score'] = (m.rank / rankSet2) * rankSet1;
            }
            return m;
        })

        try {
            switch (blendedSearch.set1.params.sort) {
                case 'title':
                    docs = docs.sort((a, b) => a.pnx.display.title[0].toLowerCase().replaceAll(/\W/g, '').localeCompare(b.pnx.display.title[0].toLowerCase().replaceAll(/\W/g, '')));
                    break;
                case 'author':
                    docs = docs.sort((a, b) => {
                        const creatorA = a.pnx.display.creator || [''];
                        const creatorB = b.pnx.display.creator || [''];
                        return creatorA[0].toLowerCase().replaceAll(/\W/g, '').localeCompare(creatorB[0].toLowerCase().replaceAll(/\W/g, ''));
                    });
                    break;
                case 'date_d': //newest
                    docs = docs.sort((a, b) => new Date(a.pnx.addata.date[0]) - new Date(b.pnx.addata.date[0]));
                    break;
                case 'date_a': //oldest
                    docs = docs.sort((a, b) => new Date(b.pnx.addata.date[0]) - new Date(a.pnx.addata.date[0]));
                    break;
                default:
                    docs = docs.sort((a, b) => b.pnx.control.score - a.pnx.control.score);
                    break;
            }
        } catch (e) {
            console.error(`Error sorting records:${e.message}`);
        }

        return docs
    }
};

pubSub.subscribe('before-pnxBaseURL', (reqRes) => {
    blendedSearch.originalLimit = reqRes.params.limit;
    blendedSearch.init(reqRes);
    if (blendedSearch.allowed) {    
        blendedSearch.set2.search();

        reqRes.params.limit = blendedSearch.set1.limit;
        reqRes.params.offset = blendedSearch.set1.offset;
        return reqRes;
    }

    return reqRes;
})

// federated search and merge result set
pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
    if (blendedSearch.allowed) {
        if (reqRes.config.params['scope'] != 'All_Content') {
            let result = blendedSearch.set2.data;
            blendedSearch.set1.data = JSON.parse(JSON.stringify(reqRes.data));
            console.log('BLENDING ResultSet1:', JSON.stringify(reqRes.data.info));
            console.log('BLENDING ResultSet2:', JSON.stringify(result.info));
        }
    }
    return reqRes;


    });
