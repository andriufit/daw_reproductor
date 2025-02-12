export default {

    BASE_URL: "https://freesound.org/apiv2",
    // TOKEN: "94QI2cQexWIEFtOEIBCoQOUja0rKDf0N3JXFuaGp",
    TOKEN: "w5uHxwaLh9vfaBwtSJj7MVqJHxVB4hYBsJVtoiqO",

    async get(url) {
        url = url + "&token=" + this.TOKEN;

        return await fetch(url);
    },

    async getSounds(searchQuery = ""){
        let response = (await this.get(this.BASE_URL + "/search/text/?query=" + searchQuery)).json();   
        
        return response;
    },

    async getsoundData(id){
        let response = (await this.get(this.BASE_URL + "/sounds/" + id +"/?")).json();   
        
        return response;
    }

}