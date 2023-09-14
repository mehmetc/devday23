pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
    function renameFacet({ facets = {}, fromKey = "from", toKey = "to" } = {}) {
        return facets.map(f => {
            if (f.name == fromKey) {
                f.name = toKey;
            };
            return f;
        })
    }

    if (['lirias_profile', 'Archief'].includes(reqRes.config.params['scope'])) {
        // process result 
        // FACETS
        let facets = reqRes.data.facets;
        if (facets) {
            reqRes.data['facets'] = renameFacet({ facets: facets, fromKey: "lds_tlevel", toKey: "tlevel" });
        }

    }
    return reqRes;
});
