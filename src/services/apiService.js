export default {
    BASE_URL: "https://freesound.org/apiv2",
    TOKEN: "kW0VpnM50E4fjgx7QN7naRApUG7bCESe5K4bjBAi",

    async get(url) {
        const fullUrl = `${url}&token=${this.TOKEN}`;
        const response = await fetch(fullUrl);
        return response.json(); 
    },

    async getSounds(searchQuery = "", nextUrl = "") {
        const url = nextUrl || `${this.BASE_URL}/search/text/?query=${searchQuery}`;
        return await this.get(url); 
    },

    async getsoundData(id) {
        return await this.get(`${this.BASE_URL}/sounds/${id}/?`);
    }
};