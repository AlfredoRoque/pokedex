import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class Pokemon{
  id: number;
  name: string;
  tipo: string[];
  image: string;
  description: string;
  specie: string;
  abilities: string[];
  specialAbility: string;
  game_indices:string[];
  moves:string[];
  back_image: string;
  weight: string;
  height: string;
  eggs_group: string[];
  gender: string[];
  habitats: string[];
  colors: string[];
  generations: string[];
  evolutions: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  initAPI = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";
  nextPageString = "";
  prevPageString = "";
  pokemonsList = [];
  pokemons = [];
  titles : String[] = ["#","Nombre", "Tipo","Foto"];
  busqueda = "";

  constructor(private http: HttpClient) { }

  async search(){
    if(this.busqueda!=""){
      const unicPoke = await fetch("https://pokeapi.co/api/v2/pokemon/"+this.busqueda);
      if(unicPoke.status==200){
        const data = await unicPoke.json();
        this.createSinglePokemon(data);
      }
    }else{
      window.location.href = "index.html";
    }
  }

  async searchLink(id){
      const unicPoke = await fetch("https://pokeapi.co/api/v2/pokemon/"+id);
      if(unicPoke.status==200){
        const data = await unicPoke.json();
        this.createSinglePokemon(data);
        document.getElementById("first_container").setAttribute("hidden","true");
      }
  }
  
  async nextPage(){
    this.pokemonsList = [];
    const unicPoke = await fetch(this.nextPageString);
    const data = await unicPoke.json();
    this.nextPageString = data.next;
    this.prevPageString = data.previous;
    this.createPokemon(data.results);
    this.pokemons = this.pokemonsList;
  }

  async prevPage(){
    this.pokemonsList = [];
    let unicPoke;
    if(this.prevPageString!=null){
      unicPoke = await fetch(this.prevPageString);
    }else{
      unicPoke = await fetch(this.initAPI);
    }
    const data = await unicPoke.json();
    this.nextPageString = data.next;
    this.prevPageString = data.previous;
    this.createPokemon(data.results);
    this.pokemons = this.pokemonsList;
  }

  

  async ngOnInit() {
    const reslist = await fetch(this.initAPI);
    const data = await reslist.json();
    //https://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/-1/Cucas Rocke/
    //https://www.bungie.net/Platform/Destiny2/1/Profile/4611686018431116718?components=100
    //https://www.bungie.net/Platform/Destiny2/1/Profile/4611686018431116718/Character/2305843009265175533/?components=200
    //https://www.bungie.net/Platform/GroupV2/User/1/4611686018431116718/0/1/
    //https://www.bungie.net/Platform/Destiny2/2/Profile/4611686018431116718/Character/2305843009265175533/?components=205
    //https://www.bungie.net/Platform/Destiny2/2/Profile/4611686018431116718/Item/6917529271860482391/?components=300,302,304,305
    // 798460
    //const destiny = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/6/1690783811" ,{
    //method: "GET",  
    //headers: {
    //    'X-API-KEY': '556dd417965d4042aca27f32344a49c6'
    //}
    //});

    //const dataDestiny = await destiny.json();
    //console.log(dataDestiny)
    this.nextPageString = data.next;
    this.prevPageString = data.previous;
    this.createPokemon(data.results);
    this.pokemons = this.pokemonsList;
  }

  
  
  async createPokemon(list){
    for (const poke of list) {
      let resPokemon = await fetch(poke.url);
      const dataPoke = await resPokemon.json();

      let p:Pokemon = new Pokemon();
      p.tipo = [];
      p.id =  dataPoke.id;
      p.name = dataPoke.name;
      p.image = dataPoke.sprites.other['official-artwork'].front_default;
      for (const typ of dataPoke.types) {
        const typedata = await this.searchApiStatic(typ.type.url);
        for (const typee of typedata.names) {
          if(typee.language.name==="es"){
            p.tipo.push(typee.name);
            if(dataPoke.types.indexOf(typ)<dataPoke.types.length-1){
              p.tipo.push(", ");
            }
          }
        }
      }
      if(p.tipo.length===0||p.tipo===undefined){
        p.tipo = dataPoke.types[0].type.name;
      }
      this.pokemonsList.push(p);
    }
  }

  createSinglePokemon(pok){
      this.pokemons=[];
      let p:Pokemon = new Pokemon();
      p.tipo = [];
      p.id =  pok.id;
      p.name = pok.name;
      p.image = pok.sprites.other['official-artwork'].front_default;
      for (const type of pok.types) {
        p.tipo.push(type.type.name);
      }
      if(pok.abilities!=null){
        p.abilities = pok.abilities;
      }
      if(pok.game_indices!=null){
        p.game_indices = pok.game_indices;
      }
      if(pok.moves!=null){
        p.moves = pok.moves;
      }
      if(pok.moves!=null){
        p.moves = pok.moves;
      }
      p.back_image = pok.sprites.back_default;
      this.pokemons.push(p);
  }

  async searchApiStatic(url){
    let typePoke = await fetch(url);
    let typedata = await typePoke.json();
    return typedata;
  }
  
}

