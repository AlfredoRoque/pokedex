import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class Pokemon{
  id: number;
  name: string;
  tipo: string;
  image: string;
  abilities: {};
  game_indices:{};
  moves:{};
  back_image: string;

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
  titles : String[] = ["#","Name", "Type","Picture"];
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
      p.id =  dataPoke.id;
      p.name = dataPoke.name;
      p.image = dataPoke.sprites.front_shiny;
      p.tipo = dataPoke.types[0].type.name;
      this.pokemonsList.push(p);
    }
  }

  createSinglePokemon(pok){
      this.pokemons=[];
      let p:Pokemon = new Pokemon();
      p.id =  pok.id;
      p.name = pok.name;
      p.image = pok.sprites.front_shiny;
      p.tipo = pok.types[0].type.name;
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
}