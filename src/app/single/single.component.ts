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
  API = "https://pokeapi.co/api/v2/pokemon/";
  max_results = "?limit=2000&offset=0";
  ARROW = "flecha";
  index = "index.html";
  lenguage = "es";
  API_gender = "https://pokeapi.co/api/v2/gender/";

  constructor() { }

  ngOnInit() {
    var URLactual = window.location;
    var idd = URLactual.pathname.replace("single","");
    idd = idd.replace("//","");
    this.searchLink(idd);
  }

  async searchLink(id){
    let first_api = await this.searchApiStatic(this.API+this.max_results);
    let last_poke = await this.searchApiStatic(first_api.results[first_api.results.length-1].url);
    if(id<=last_poke.id){
      const unicPoke = await this.searchApiId(this.API,id).then(x => {
        this.createSinglePokemon(x);
        document.getElementById("first_container").setAttribute("hidden","true");
        document.getElementById("footer").setAttribute("hidden","true");
      }).catch((x) => {
        location.href = this.index;
      });
    }else{
      location.href = this.index;
    }
  }

  async createSinglePokemon(pok){
    const kilogramo = 1;
    const hectogramoKilo = 10;
    const decimetro = 1;
    const metroDecim = 0.1;
    const MALE = "Masculino";
    const FEMALE = "Femenino";
    const GENDERLEES = "Sin Genero";
    this.pokemons=[];
    let p:Pokemon = new Pokemon();
    p.id =  pok.id;
    p.name = pok.name;
    if(pok.sprites.other['official-artwork'].front_default!=null){
      p.image = pok.sprites.other['official-artwork'].front_default;
    }else{
      p.image = pok.sprites.front_default;
    }
    console.log(p.image);
    //types
    p.tipo = [];
    for (const typ of pok.types) {
      const typedata = await this.searchApiStatic(typ.type.url);
      for (const typee of typedata.names) {
        if(typee.language.name===this.lenguage){
          p.tipo.push(typee.name);
          if(pok.types.indexOf(typ)<pok.types.length-1){
            p.tipo.push(", ");
          }
        }
      }
    }
    if(p.tipo.length===0||p.tipo===undefined){
      p.tipo = pok.types[0].type.name;
    }
    //types

    //abilities
    p.abilities = [];
    if(pok.abilities!=null){
      for (let ability of pok.abilities) {
        let abilityData = await this.searchApiStatic(ability.ability.url);
        if(pok.abilities.indexOf(ability)<pok.abilities.length-1){
          for (let abilityName of abilityData.names) {
            if(abilityName.language.name===this.lenguage){
              p.abilities.push(abilityName.name);
              if(pok.abilities.indexOf(ability)<pok.abilities.length-2){
                p.abilities.push(", ");
              }
            }
          }
        }else if(pok.abilities.indexOf(ability)===pok.abilities.length-1){
          for (let abilityName of abilityData.names) {
            if(abilityName.language.name===this.lenguage&&pok.abilities.indexOf(ability)==pok.abilities.length-1){
              p.specialAbility = abilityName.name;
            }
          }
        }
      }
    }
    if(p.abilities.length===0||p.abilities===undefined){
        p.abilities.push("Sin Habilidades");
    }
    //abilities

    //games
    p.game_indices = [];
    if(pok.game_indices!=null){
      for (let games of pok.game_indices) {
        let gamesData = await this.searchApiStatic(games.version.url);
        for (let agameName of gamesData.names) {
          if(agameName.language.name===this.lenguage){
            p.game_indices.push(agameName.name);
          }
        }
      }
    }
    if(p.game_indices.length===0||p.game_indices===undefined){
        p.game_indices.push("Sin Aparición en Video Juegos");
    }
    //games

    //moves
    p.moves = [];
    if(pok.moves!=null){
      for (let moves of pok.moves) {
        let movesData = await this.searchApiStatic(moves.move.url);
        for (let moveName of movesData.names) {
          if(moveName.language.name===this.lenguage){
            p.moves.push(moveName.name);
          }
        }
      }
    }
    if(p.moves.length===0||p.moves===undefined){
        p.moves.push("Sin Movimientos");
    }
    //moves

    //description
    let description = "";
    let descriptionDa = await this.searchApiId(this.API,pok.id);
    let descriptionData = await this.searchApiStatic(descriptionDa.species.url);
    let intDesc = 0;
    for (let desc of descriptionData.flavor_text_entries) {
        if(desc.language.name===this.lenguage){
          if(intDesc<=6){
            description = description+" "+desc.flavor_text;
            intDesc++;
          }
        }
    }
    if(description===""||description===undefined){
      description = descriptionData.flavor_text_entries[0].flavor_text;
    }
    p.description = description;
    //description

    //specie
    for (let desc of descriptionData.genera) {
      if(desc.language.name===this.lenguage){
        p.specie = desc.genus;
      }
    }
    //specie

    //peso
    if(pok.weight!==null&&pok.weight!==undefined){
      let c = (pok.weight*kilogramo)/hectogramoKilo;
      p.weight = c+" Kg";
    }
    //peso

    //altura
    if(pok.height!==null&&pok.height!==undefined){
      let c = (pok.height*metroDecim)/decimetro;
      p.height = Math.round(c*100)/100+" m";
    }
    //altura

    //huevo
    p.eggs_group = [];
    for (let egg of descriptionData.egg_groups) {
      let eggsData = await this.searchApiStatic(egg.url);
      for (let eggName of eggsData.names) {
        if(eggName.language.name===this.lenguage){
          p.eggs_group.push(eggName.name);
          if(descriptionData.egg_groups.indexOf(egg)<descriptionData.egg_groups.length-1){
            p.eggs_group.push(", ");
          }
        }
      }
    }
    if(p.eggs_group.length===0||p.eggs_group===undefined){
        p.eggs_group.push("Sin Grupo de Huevo");
    }
    //huevo

    //genero
    //https://pokeapi.co/api/v2/gender/id
    let females = await this.searchApiId(this.API_gender,1);
    let males = await this.searchApiId(this.API_gender,2);
    let genderless = await this.searchApiId(this.API_gender,3);
    p.gender = [];
    for (const male of males.pokemon_species_details) {
      if(male.pokemon_species.name===pok.name){
        p.gender.push(MALE);
      }
    }
    for (const female of females.pokemon_species_details) {
      if(female.pokemon_species.name===pok.name){
        p.gender.push(FEMALE);
      }
    }
    for (const genderles of genderless.pokemon_species_details) {
      if(genderles.pokemon_species.name===pok.name){
        p.gender.push(GENDERLEES);
      }
    }
    if(p.gender.length===0||p.gender===undefined){
      p.gender.push("Sin genero");
    }

    let gender2 = p.gender;
    p.gender = [];
    for (const gen of gender2) {
      if(gender2.indexOf(gen)<gender2.length-1){
        p.gender.push(gen);
        p.gender.push(", ");
      }else if(gender2.indexOf(gen)==gender2.length-1){
        p.gender.push(gen);
      }
    }
    //genero

    //habitat
    p.habitats = [];
    if(descriptionData.habitat!=null){
      if(descriptionData.habitat.length!=undefined){
        for (const habitat of descriptionData.habitat) {
          let habit = await this.searchApiStatic(habitat.url);
          for (let habitName of habit.names) {
            if(habitName.language.name===this.lenguage){
              p.habitats.push(habitName.name);
              if(descriptionData.habitat.indexOf(habitat)<descriptionData.habitat.length-1){
                p.habitats.push(", ");
              }
            }
          }
        }
      }else{
        let habit = await this.searchApiStatic(descriptionData.habitat.url);
        for (let habitName of habit.names) {
          if(habitName.language.name===this.lenguage){
            p.habitats.push(habitName.name);
          }
        }
      }
    }else{
      p.habitats.push("Sin Habitat");
    }
    //habitat

    //color
    p.colors = [];
    if(descriptionData.color!=null){
      if(descriptionData.color.length!=undefined){
        for (const color of descriptionData.color) {
          let col = await this.searchApiStatic(color.url);
          for (let colorName of col.names) {
            if(colorName.language.name===this.lenguage){
              p.colors.push(colorName.name);
              if(descriptionData.color.indexOf(color)<descriptionData.color.length-1){
                p.colors.push(", ");
              }
            }
          }
        }
      }else{
        let col = await this.searchApiStatic(descriptionData.color.url);
        for (let colorName of col.names) {
          if(colorName.language.name===this.lenguage){
            p.colors.push(colorName.name);
          }
        }
      }
    }else{
      p.colors.push("Sin Color");
    }
    //color

    //generation
    p.generations = [];
    if(descriptionData.generation!=null){
      if(descriptionData.generation.length!=undefined){
        for (const generation of descriptionData.generation) {
          let gen = await this.searchApiStatic(generation.url);
          for (let generationName of gen.names) {
            if(generationName.language.name===this.lenguage){
              p.generations.push(generationName.name);
              if(descriptionData.generation.indexOf(generation)<descriptionData.generation.length-1){
                p.generations.push(", ");
              }
            }
          }
        }
      }else{
        let gen = await this.searchApiStatic(descriptionData.generation.url);
        for (let generationName of gen.names) {
          if(generationName.language.name===this.lenguage){
            p.generations.push(generationName.name);
          }
        }
      }
    }else{
      p.generations.push("Sin Generacion");
    }
    //generation

    //evolution chain
    p.evolutions = [];
    if(descriptionData.evolution_chain!=null){
      if(descriptionData.evolution_chain!=null){
        if(descriptionData.evolution_chain.url!=null){
          let evol = await this.searchApiStatic(descriptionData.evolution_chain.url);
          let id_evol = evol.chain.species.url.replaceAll("/","");
          id_evol = id_evol.replaceAll("https:pokeapi.coapiv2pokemon-species","");
          let principal = await this.searchApiId(this.API, id_evol);
          p.evolutions.push(principal.sprites.front_default);
          console.log(principal.sprites.front_default);
          p.evolutions.push(this.ARROW);
          for (let evolution of evol.chain.evolves_to) {
            let id_evol = evolution.species.url.replaceAll("/","");
            id_evol = id_evol.replaceAll("https:pokeapi.coapiv2pokemon-species","");
            let poket = await this.searchApiId(this.API,id_evol);
            if(evol.chain.evolves_to.indexOf(evolution)>0){
              p.evolutions.push("-");
            }
            p.evolutions.push(poket.sprites.front_default);
            if(evolution!=null){
              if(evolution.evolves_to.length>0){
                p.evolutions.push(this.ARROW);
                for (let evolt of evolution.evolves_to) {
                  let id_evol = evolt.species.url.replaceAll("/","");
                  id_evol = id_evol.replaceAll("https:pokeapi.coapiv2pokemon-species","");
                  let poket2 = await this.searchApiId(this.API,id_evol);
                  if(evolution.evolves_to.indexOf(evolt)>0){
                    p.evolutions.push("-");
                  }
                p.evolutions.push(poket2.sprites.front_default);
                }
              }
            }
          }
          if(p.evolutions.length===2){
            let po = p.evolutions[0];
            p.evolutions = [];
            p.evolutions.push(po);
          }
        }else{
          p.evolutions.push("Sin Evoluciones");
        }
      }else{
        p.evolutions.push("Sin Evoluciones");
      }
    }else{
      p.evolutions.push("Sin Evoluciones");
    }
    p.back_image = pok.sprites.back_default;
    this.pokemons.push(p);
}

async searchApiStatic(url){
  let typePoke = await fetch(url);
  let typedata = await typePoke.json();
  return typedata;
}

async searchApiId(url,id){
  let typePoke = await fetch(url+id);
  let typedata = await typePoke.json();
  return typedata;
}

}

