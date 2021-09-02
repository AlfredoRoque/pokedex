import { Component, Output, Input, OnInit } from '@angular/core';
import { Pokemon } from '../app.component';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.css']
})
export class SingleComponent implements OnInit {

  pokemons = [];
  titles : String[] = ["#","Name", "Type", "Abilities", "Games", "Moves","Picture","Back Picture"];
  constructor() { }

  ngOnInit() {
    var URLactual = window.location;
    var idd = URLactual.pathname.replace("single","");
    idd = idd.replace("//","");
    this.searchLink(idd);
  }

  async searchLink(id){
    const unicPoke = await fetch("https://pokeapi.co/api/v2/pokemon/"+id);
    if(unicPoke.status==200){
      const data = await unicPoke.json();
      this.createSinglePokemon(data);
      document.getElementById("first_container").setAttribute("hidden","true");
      document.getElementById("footer").setAttribute("hidden","true");
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
    p.back_image = pok.sprites.back_default;
    this.pokemons.push(p);
}

}

