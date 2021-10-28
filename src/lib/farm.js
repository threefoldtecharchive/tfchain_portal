export async function getFarm (api, twinID) {
    const farms = await api.query.tfgridModule.farms.entries()
    const farm = farms.filter(farm => {
        const parsedFarm = farm[1].toJSON()
        if (parsedFarm.twin_id === twinID) {
            return parsedFarm
        }
    })

    return farm
}