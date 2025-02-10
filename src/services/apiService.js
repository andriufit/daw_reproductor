export default {

    BASE_URL: "https://freesound.org/apiv2",
    TOKEN: "94QI2cQexWIEFtOEIBCoQOUja0rKDf0N3JXFuaGp",

    async get(url) {
        url = url + "&token=" + this.TOKEN;
        return await fetch(url).then(res => res.json());
    },

    async getSounds(searchQuery = "", page = 1, pageSize = 10) {
        let url = `${this.BASE_URL}/search/text/?query=${searchQuery}&page=${page}&page_size=${pageSize}`;
        return await this.get(url);
    },

    async getSoundData(id) {
        return await this.get(`${this.BASE_URL}/sounds/${id}/?`);
    }

}