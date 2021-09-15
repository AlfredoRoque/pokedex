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
  ARROW = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbUUv2PaYiXaHKzgTtnA1rinamfXZIYmmyvQ&usqp=CAU";

  constructor() { }

  ngOnInit() {
    var URLactual = window.location;
    var idd = URLactual.pathname.replace("single","");
    idd = idd.replace("//","");
    this.searchLink(idd);
  }

  async searchLink(id){
    if(id<=898){
    const unicPoke = await this.searchApiId(this.API,id);
      this.createSinglePokemon(unicPoke);
      //console.log(unicPoke);
      document.getElementById("first_container").setAttribute("hidden","true");
      document.getElementById("footer").setAttribute("hidden","true");
    }else{
      location.href ="index.html";
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
    p.image = pok.sprites.other['official-artwork'].front_default;
    //types
    p.tipo = [];
    for (const typ of pok.types) {
      const typedata = await this.searchApiStatic(typ.type.url);
      for (const typee of typedata.names) {
        if(typee.language.name==="es"){
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
            if(abilityName.language.name==="es"){
              p.abilities.push(abilityName.name);
              if(pok.abilities.indexOf(ability)<pok.abilities.length-2){
                p.abilities.push(", ");
              }
            }
          }
        }else if(pok.abilities.indexOf(ability)===pok.abilities.length-1){
          for (let abilityName of abilityData.names) {
            if(abilityName.language.name==="es"&&pok.abilities.indexOf(ability)==pok.abilities.length-1){
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
          if(agameName.language.name==="es"){
            p.game_indices.push(agameName.name);
          }
        }
      }
    }
    if(p.game_indices.length===0||p.game_indices===undefined){
        p.game_indices.push("Sin Aparición en Video Juegos");
    }
    console.log(p.game_indices);
    //games

    //moves
    p.moves = [];
    if(pok.moves!=null){
      for (let moves of pok.moves) {
        let movesData = await this.searchApiStatic(moves.move.url);
        for (let moveName of movesData.names) {
          if(moveName.language.name==="es"){
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
    let descriptionData = await this.searchApiId("https://pokeapi.co/api/v2/pokemon-species/",pok.id);
    //console.log(descriptionData);
    for (let desc of descriptionData.flavor_text_entries) {
      if(desc.language.name==="es"){
        description = description+" "+desc.flavor_text;
      }
    }
    if(description===""||description===undefined){
      description = descriptionData.flavor_text_entries[0].flavor_text;
    }
    p.description = description;
    //description

    //specie
    for (let desc of descriptionData.genera) {
      if(desc.language.name==="es"){
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
        if(eggName.language.name==="es"){
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
    let females = await this.searchApiId("https://pokeapi.co/api/v2/gender/",1);
    let males = await this.searchApiId("https://pokeapi.co/api/v2/gender/",2);
    let genderless = await this.searchApiId("https://pokeapi.co/api/v2/gender/",3);
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
            if(habitName.language.name==="es"){
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
          if(habitName.language.name==="es"){
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
            if(colorName.language.name==="es"){
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
          if(colorName.language.name==="es"){
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
            if(generationName.language.name==="es"){
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
          if(generationName.language.name==="es"){
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
      //console.log(descriptionData);
      if(descriptionData.evolution_chain!=null){
        if(descriptionData.evolution_chain.url!=null){
          //console.log(descriptionData.evolution_chain.url);
          let evol = await this.searchApiStatic(descriptionData.evolution_chain.url);
          let principal = await this.searchApiId(this.API, evol.chain.species.name);
          p.evolutions.push(principal.sprites.front_default);
          p.evolutions.push(this.ARROW);
          //console.log(principal);
          //console.log(evol);
          //console.log(evol.chain.evolves_to.length);
          for (let evolution of evol.chain.evolves_to) {
            let poket = await this.searchApiId(this.API,evolution.species.name);
            //console.log(poket);
            if(evol.chain.evolves_to.indexOf(evolution)>0){
              p.evolutions.push("-");
            }
            p.evolutions.push(poket.sprites.front_default);
            if(evolution!=null){
              if(evolution.evolves_to.length>0){
                p.evolutions.push(this.ARROW);
                for (let evolt of evolution.evolves_to) {
                  let poket2 = await this.searchApiId(this.API,evolt.species.name);
                  //console.log(poket2);
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
          //console.log(p.evolutions);
        }else{
          p.habitats.push("Sin Habitat");
        }
      }else{
        p.habitats.push("Sin Habitat");
      }
    }else{
      p.habitats.push("Sin Habitat");
    }
    //evolution chain
    //console.log(descriptionData);
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

