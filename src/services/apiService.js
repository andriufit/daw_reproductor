export default {

    BASE_URL: "https://freesound.org/apiv2",
    TOKEN: "N4XAd06Sn5p3sOJmhFUtB9JOACb4BxctCWUn839Z",

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