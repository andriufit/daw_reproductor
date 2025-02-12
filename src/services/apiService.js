export default {

    BASE_URL: "https://freesound.org/apiv2",
    TOKEN: "DnnYmUnPc6I82ypCwnagMmfb7M8ItY4uUUS9snia",

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